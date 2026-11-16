import bcrypt from "bcryptjs";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// The mobile app's API (app/api/app/*), with an in-memory database and the
// Pro file bucket faked.
type U = { id: string; email: string; name: string | null; passwordHash: string | null };
type Sub = { userId: string; plan: string; status: string; currentPeriodEnd: Date | null; paypalSubscriptionId?: string };
type Child = { id: string; parentId: string; firstName: string; ageBand: string; language: string; avatarKey: string | null; createdAt: Date };
type SP = { childId: string; storyId: string; lastPageRead: number; completed: boolean };

const db = {
  users: [] as U[],
  subs: [] as Sub[],
  children: [] as Child[],
  stories: [] as { id: string; slug: string; locale: string }[],
  progress: [] as SP[],
};

const fake = {
  user: {
    findUnique: async ({ where }: { where: { id?: string; email?: string } }) =>
      db.users.find((u) => (where.id ? u.id === where.id : u.email === where.email)) ?? null,
  },
  subscription: {
    findUnique: async ({ where }: { where: { userId: string } }) => {
      const s = db.subs.find((x) => x.userId === where.userId);
      return s ? { plan: s.plan, status: s.status, currentPeriodEnd: s.currentPeriodEnd } : null;
    },
  },
  childProfile: {
    findMany: async ({ where }: { where: { parentId: string } }) => db.children.filter((c) => c.parentId === where.parentId),
    findUnique: async ({ where }: { where: { id: string } }) => db.children.find((c) => c.id === where.id) ?? null,
    create: async ({ data }: { data: Omit<Child, "id" | "avatarKey" | "createdAt"> }) => {
      const c = { ...data, id: `child_${db.children.length + 1}`, avatarKey: null, createdAt: new Date() };
      db.children.push(c);
      return c;
    },
  },
  story: {
    findMany: async ({ where }: { where: { slug: { in: string[] } } }) => db.stories.filter((s) => where.slug.in.includes(s.slug)),
  },
  storyProgress: {
    upsert: async ({ where, update, create }: { where: { childId_storyId: { childId: string; storyId: string } }; update: Partial<SP>; create: SP }) => {
      const k = where.childId_storyId;
      const row = db.progress.find((p) => p.childId === k.childId && p.storyId === k.storyId);
      if (row) return Object.assign(row, update);
      db.progress.push({ ...create });
      return create;
    },
  },
  $transaction: async (ops: Promise<unknown>[]) => Promise.all(ops),
};
vi.mock("@/lib/prisma", () => ({ getPrisma: () => fake }));

let stored: Uint8Array | null = new Uint8Array([37, 80, 68, 70]);
let readKey = "";
vi.mock("@/lib/billing/bundles", async (orig) => ({
  ...(await orig<typeof import("@/lib/billing/bundles")>()),
  readProFile: async (key: string) => ((readKey = key), stored ? { body: stored, size: stored.length } : null),
}));

const json = (body: unknown, token?: string) =>
  new Request("https://alphabes.com/api/app/x", {
    method: "POST",
    headers: { "content-type": "application/json", ...(token && { authorization: `Bearer ${token}` }) },
    body: JSON.stringify(body),
  });
const get = (url: string, token?: string) => new Request(url, { headers: token ? { authorization: `Bearer ${token}` } : {} });

async function login(email: string, password: string) {
  const { POST } = await import("@/app/api/app/login/route");
  return POST(json({ email, password }) as never);
}
async function tokenFor(email: string) {
  return ((await (await login(email, "secret-pw")).json()) as { token: string }).token;
}

// No response may ever carry billing details (store rules).
const BILLING = /price|amount|paypal|plan|currentPeriodEnd|USD|EUR|\$\d/i;

describe("/api/app", () => {
  let hash = "";
  beforeAll(async () => {
    hash = await bcrypt.hash("secret-pw", 4);
    // The packs route reads the whole sheet catalog: load it once.
    await import("@/app/api/app/packs/[locale]/[slug]/route");
  }, 60_000);
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret-for-the-app-token-0123456789");
    db.users = [
      { id: "u_free", email: "free@example.com", name: "Free Parent", passwordHash: hash },
      { id: "u_pro", email: "pro@example.com", name: "Pro Parent", passwordHash: hash },
    ];
    db.subs = [{ userId: "u_pro", plan: "MONTHLY", status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + 86_400_000), paypalSubscriptionId: "I-SECRET" }];
    db.children = [
      { id: "c_free", parentId: "u_free", firstName: "Sam", ageBand: "3-4", language: "EN", avatarKey: null, createdAt: new Date(1) },
      { id: "c_pro", parentId: "u_pro", firstName: "Léa", ageBand: "5-6", language: "FR", avatarKey: "fox", createdAt: new Date(2) },
    ];
    db.stories = [
      { id: "s1", slug: "the-little-apple", locale: "EN" },
      { id: "s2", slug: "la-petite-pomme", locale: "FR" },
    ];
    db.progress = [];
    stored = new Uint8Array([37, 80, 68, 70]);
    readKey = "";
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("login", () => {
    it("returns a token and the account for the right password", async () => {
      const res = await login("PRO@example.com ", "secret-pw");
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(typeof body.token).toBe("string");
      expect(body.account).toEqual({
        name: "Pro Parent",
        email: "pro@example.com",
        pro: true,
        children: [{ id: "c_pro", firstName: "Léa", ageBand: "5-6", language: "fr", avatarKey: "fox" }],
      });
      expect(JSON.stringify(body)).not.toMatch(BILLING);
    });

    it("refuses a wrong password or unknown e-mail with the same answer", async () => {
      for (const res of [await login("pro@example.com", "nope"), await login("nobody@example.com", "secret-pw")]) {
        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ error: expect.any(String), code: "invalid_login" });
      }
    });

    it("refuses a malformed body", async () => {
      const { POST } = await import("@/app/api/app/login/route");
      expect((await POST(json({ email: "x" }) as never)).status).toBe(400);
    });
  });

  describe("me", () => {
    it("answers 401 without a token or with a bad one", async () => {
      const { GET } = await import("@/app/api/app/me/route");
      expect((await GET(get("https://alphabes.com/api/app/me"))).status).toBe(401);
      const res = await GET(get("https://alphabes.com/api/app/me", "junk"));
      expect(res.status).toBe(401);
      expect((await res.json()).code).toBe("unauthorized");
    });

    it("returns the account and a renewed token; Pro follows the subscription", async () => {
      const { GET } = await import("@/app/api/app/me/route");
      const token = await tokenFor("free@example.com");
      let body = await (await GET(get("https://alphabes.com/api/app/me", token))).json();
      expect(body.account.pro).toBe(false);
      expect(typeof body.token).toBe("string");
      db.subs.push({ userId: "u_free", plan: "YEARLY", status: "ACTIVE", currentPeriodEnd: null });
      body = await (await GET(get("https://alphabes.com/api/app/me", token))).json();
      expect(body.account.pro).toBe(true);
      expect(JSON.stringify(body)).not.toMatch(BILLING);
    });

    it("signs the app out after a password change on the website", async () => {
      const { GET } = await import("@/app/api/app/me/route");
      const token = await tokenFor("pro@example.com");
      db.users[1].passwordHash = await bcrypt.hash("new-password", 4);
      expect((await GET(get("https://alphabes.com/api/app/me", token))).status).toBe(401);
    });
  });

  describe("children", () => {
    it("lists only this parent's children and adds one", async () => {
      const { GET, POST } = await import("@/app/api/app/children/route");
      const token = await tokenFor("free@example.com");
      expect((await (await GET(get("https://alphabes.com/api/app/children", token))).json()).children.map((c: Child) => c.id)).toEqual(["c_free"]);
      const res = await POST(json({ firstName: " Mia ", ageBand: "7-8", language: "es" }, token));
      expect(res.status).toBe(201);
      expect((await res.json()).child).toMatchObject({ firstName: "Mia", ageBand: "7-8", language: "es" });
      expect(db.children.at(-1)).toMatchObject({ parentId: "u_free", language: "ES" });
      expect((await POST(json({ firstName: "", ageBand: "9-10" }, token))).status).toBe(400);
      expect((await POST(json({ firstName: "Mia", ageBand: "3-4" }))).status).toBe(401);
    });
  });

  describe("progress", () => {
    it("saves stories for the parent's own child; never undoes a finished story", async () => {
      const { POST } = await import("@/app/api/app/progress/route");
      const token = await tokenFor("pro@example.com");
      let res = await POST(json({ childId: "c_pro", stories: [{ locale: "fr", slug: "la-petite-pomme", lastPageRead: 6, completed: true }] }, token));
      expect(await res.json()).toEqual({ saved: 1, unknown: [] });
      res = await POST(json({ childId: "c_pro", stories: [{ locale: "fr", slug: "la-petite-pomme", lastPageRead: 2, completed: false }] }, token));
      expect(res.status).toBe(200);
      expect(db.progress).toEqual([{ childId: "c_pro", storyId: "s2", lastPageRead: 2, completed: true }]);
    });

    it("refuses another parent's child", async () => {
      const { POST } = await import("@/app/api/app/progress/route");
      const token = await tokenFor("pro@example.com");
      const res = await POST(json({ childId: "c_free", stories: [{ locale: "en", slug: "the-little-apple", lastPageRead: 1, completed: false }] }, token));
      expect(res.status).toBe(404);
      expect((await res.json()).code).toBe("profile_not_found");
      expect(db.progress).toEqual([]);
    });

    it("skips unknown stories and stories in the wrong language", async () => {
      const { POST } = await import("@/app/api/app/progress/route");
      const token = await tokenFor("free@example.com");
      const res = await POST(
        json({ childId: "c_free", stories: [{ locale: "en", slug: "no-such-story", lastPageRead: 1, completed: true }, { locale: "en", slug: "la-petite-pomme", lastPageRead: 1, completed: true }, { locale: "en", slug: "the-little-apple", lastPageRead: 6, completed: true }] }, token),
      );
      expect(await res.json()).toEqual({ saved: 1, unknown: ["no-such-story", "la-petite-pomme"] });
    });

    it("accepts at most 100 entries, and needs a token", async () => {
      const { POST } = await import("@/app/api/app/progress/route");
      const token = await tokenFor("free@example.com");
      const many = Array.from({ length: 101 }, () => ({ locale: "en", slug: "the-little-apple", lastPageRead: 1, completed: false }));
      expect((await POST(json({ childId: "c_free", stories: many }, token))).status).toBe(400);
      expect((await POST(json({ childId: "c_free", stories: many.slice(0, 1) }))).status).toBe(401);
    });
  });

  describe("packs", () => {
    const pack = async (locale: string, slug: string, token?: string, query = "") => {
      const { GET } = await import("@/app/api/app/packs/[locale]/[slug]/route");
      return GET(get(`https://alphabes.com/api/app/packs/${locale}/${slug}${query}`, token), { params: Promise.resolve({ locale, slug }) });
    };

    it("answers in JSON, never redirecting: 401 without a token, 403 without Pro", async () => {
      let res = await pack("en", "letter-a-bundle");
      expect(res.status).toBe(401);
      expect(res.headers.get("location")).toBeNull();
      res = await pack("en", "letter-a-bundle", await tokenFor("free@example.com"));
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ error: expect.any(String), code: "pro_required" });
      expect(readKey).toBe("");
    });

    it("serves the PDF to Pro, privately", async () => {
      const res = await pack("en", "letter-a-bundle", await tokenFor("pro@example.com"));
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toBe("application/pdf");
      expect(res.headers.get("cache-control")).toBe("private, no-store");
      expect(new Uint8Array(await res.arrayBuffer())).toEqual(new Uint8Array([37, 80, 68, 70]));
    });

    it("404s unknown packs, papers and parts", async () => {
      const token = await tokenFor("pro@example.com");
      expect((await pack("de", "letter-a-bundle", token)).status).toBe(404);
      expect((await pack("en", "../../etc", token)).status).toBe(404);
      expect((await pack("en", "mega-pack", token, "?part=6")).status).toBe(404);
      expect((await pack("en", "missing-numbers-complete-pack", token, "?paper=a3")).status).toBe(404);
    });
  });
});
