import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// /api/paypal/subscribe with the session, database and PayPal faked.
let sessionEmail: string | null = null;
let user: { id: string; role: "ADMIN" | "PARENT"; subscription: null } | null = null;
const created: unknown[] = [];
vi.mock("next-auth", () => ({ getServerSession: async () => (sessionEmail ? { user: { email: sessionEmail } } : null) }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ user: { findUnique: async () => user } }) }));
vi.mock("@/lib/paypal/subscriptions", () => ({
  createSubscription: async (p: unknown) => {
    created.push(p);
    return { id: "I-NEW", status: "APPROVAL_PENDING", plan_id: "P-MONTHLY", links: [{ rel: "approve", href: "https://www.sandbox.paypal.com/approve" }] };
  },
  approveLink: (s: { links: { rel: string; href: string }[] }) => s.links.find((l) => l.rel === "approve")?.href ?? null,
  cancelSubscription: async () => {},
}));

const { POST } = await import("@/app/api/paypal/subscribe/route");
const post = (locale: string) =>
  POST(
    new NextRequest("http://localhost:3000/api/paypal/subscribe", {
      method: "POST",
      headers: { origin: "http://localhost:3000", "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ plan: "monthly", locale }),
    }),
  );

beforeEach(() => {
  vi.stubEnv("PAYPAL_MODE", "sandbox");
  vi.stubEnv("PAYPAL_PLAN_MONTHLY", "P-MONTHLY");
  sessionEmail = null;
  user = null;
  created.length = 0;
});

describe("POST /api/paypal/subscribe", () => {
  it("sends a logged-out visitor to the login page in their language", async () => {
    const res = await post("fr");
    expect(res.headers.get("location")).toBe("http://localhost:3000/fr/connexion?next=%2Ffr%2Ftarifs");
  });

  it("treats a session whose account was deleted as logged out, not as a PayPal error", async () => {
    sessionEmail = "deleted@example.com";
    const res = await post("fr");
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost:3000/fr/connexion?next=%2Ffr%2Ftarifs");
    expect(created).toHaveLength(0);
  });

  it("keeps sandbox checkout closed to parents who aren't admins", async () => {
    sessionEmail = "parent@example.com";
    user = { id: "u1", role: "PARENT", subscription: null };
    expect((await post("es")).headers.get("location")).toBe("http://localhost:3000/es/precios?billing=soon");
    expect(created).toHaveLength(0);
  });

  it("sends an admin to PayPal in sandbox, in the page's language", async () => {
    sessionEmail = "admin@example.com";
    user = { id: "u2", role: "ADMIN", subscription: null };
    const res = await post("pt");
    expect(res.headers.get("location")).toBe("https://www.sandbox.paypal.com/approve");
    expect(created).toEqual([
      expect.objectContaining({ planId: "P-MONTHLY", userId: "u2", locale: "pt", returnUrl: "http://localhost:3000/pt/minha-conta?billing=return", cancelUrl: "http://localhost:3000/pt/precos?billing=canceled" }),
    ]);
  });
});
