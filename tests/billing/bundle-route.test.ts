import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// The download route, with the access check and the bucket faked.
let access = { loggedIn: false, pro: false, suspended: false };
vi.mock("@/lib/billing/access", () => ({ getAccess: async () => access }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({}) }));
let stored: Uint8Array | null = new Uint8Array([37, 80, 68, 70]);
let readKey = "";
vi.mock("@/lib/billing/bundles", async (orig) => ({
  ...(await orig<typeof import("@/lib/billing/bundles")>()),
  readProFile: async (key: string) => ((readKey = key), stored ? { body: stored, size: stored.length } : null),
}));

describe("GET /api/bundles/[locale]/[slug]", () => {
  const get = async (locale: string, slug: string, query = "") => {
    const { GET } = await import("@/app/api/bundles/[locale]/[slug]/route");
    return GET(new Request(`https://alphabes.com/api/bundles/${locale}/${slug}${query}`), {
      params: Promise.resolve({ locale, slug }),
    });
  };
  // The route reads the Pro pack list (the whole sheet catalog): load it once.
  beforeAll(async () => {
    await import("@/app/api/bundles/[locale]/[slug]/route");
  }, 60_000);
  beforeEach(() => {
    access = { loggedIn: false, pro: false, suspended: false };
    stored = new Uint8Array([37, 80, 68, 70]);
    readKey = "";
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("404s unknown languages, bundles and odd slugs", async () => {
    expect((await get("de", "pack-lettre-a")).status).toBe(404);
    expect((await get("fr", "letter-a-bundle")).status).toBe(404);
    expect((await get("fr", "../../etc")).status).toBe(404);
  });

  it("sends a logged-out visitor to the login page, then back to the bundle page", async () => {
    const res = await get("fr", "pack-lettre-a");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe(
      "https://alphabes.com/fr/connexion?next=%2Ffr%2Ffiches%2Fpacks%2Fpack-lettre-a",
    );
  });

  it("sends a parent without Pro to the pricing page", async () => {
    access = { loggedIn: true, pro: false, suspended: false };
    const res = await get("es", "paquete-letra-a");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("https://alphabes.com/es/precios?billing=bundle");
  });

  it("serves the PDF to Pro, privately", async () => {
    access = { loggedIn: true, pro: true, suspended: false };
    const res = await get("en", "letter-a-bundle");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="alphabes-letter-a-bundle.pdf"');
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(new Uint8Array([37, 80, 68, 70]));
  });

  it("404s (and logs) a file missing from the bucket", async () => {
    access = { loggedIn: true, pro: true, suspended: false };
    stored = null;
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await get("pt", "pacote-letra-a")).status).toBe(404);
    expect(quiet).toHaveBeenCalledWith("Pro file missing from the bucket: pt/pacote-letra-a.pdf");
  });

  describe("Pro packs", () => {
    it("404s unknown packs, papers and parts", async () => {
      access = { loggedIn: true, pro: true, suspended: false };
      expect((await get("fr", "missing-numbers-complete-pack")).status).toBe(404);
      expect((await get("en", "missing-numbers-complete-pack", "?paper=a3")).status).toBe(404);
      expect((await get("en", "missing-numbers-complete-pack", "?part=2")).status).toBe(404);
      expect((await get("en", "mega-pack", "?part=6")).status).toBe(404);
      expect((await get("en", "mega-pack", "?part=0")).status).toBe(404);
      expect((await get("en", "mega-pack", "?part=1.5")).status).toBe(404);
    });

    it("sends a logged-out visitor to the login page, then back to the pack page", async () => {
      const res = await get("pt", "pacote-mega", "?paper=letter&part=3");
      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe(
        "https://alphabes.com/pt/entrar?next=%2Fpt%2Fatividades%2Fpacotes%2Fpacote-mega",
      );
      expect(readKey).toBe("");
    });

    it("sends a parent without Pro to the pricing page, without reading the file", async () => {
      access = { loggedIn: true, pro: false, suspended: false };
      const res = await get("fr", "pack-labyrinthes-complet", "?paper=a4");
      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe("https://alphabes.com/fr/tarifs?billing=bundle");
      expect(readKey).toBe("");
    });

    it("serves Pro the paper asked for, or the language's paper", async () => {
      access = { loggedIn: true, pro: true, suspended: false };
      let res = await get("fr", "pack-labyrinthes-complet");
      expect(res.status).toBe(200);
      expect(readKey).toBe("fr/packs/pack-labyrinthes-complet-a4.pdf");
      expect(res.headers.get("content-disposition")).toBe('attachment; filename="alphabes-pack-labyrinthes-complet-a4.pdf"');
      expect(res.headers.get("cache-control")).toBe("private, no-store");
      res = await get("en", "missing-numbers-complete-pack");
      expect(readKey).toBe("en/packs/missing-numbers-complete-pack-letter.pdf");
      res = await get("es", "paquete-mega", "?paper=letter&part=5");
      expect(res.status).toBe(200);
      expect(readKey).toBe("es/packs/paquete-mega-part-5-letter.pdf");
      res = await get("es", "paquete-mega");
      expect(readKey).toBe("es/packs/paquete-mega-part-1-a4.pdf");
    });
  });
});
