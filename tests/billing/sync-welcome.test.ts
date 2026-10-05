import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// syncSubscription with PayPal and the welcome email replaced by fakes: the
// welcome is asked for only when an active subscription gives Pro and hasn't
// had one yet.

const paypalSub = vi.fn();
const welcome = vi.fn(async () => "sent");
vi.mock("@/lib/paypal/subscriptions", () => ({
  getSubscription: async () => paypalSub(),
  cancelSubscription: async () => {},
}));
vi.mock("@/lib/billing/welcome", () => ({ sendWelcomeEmail: (...a: unknown[]) => welcome(...(a as [])) }));
const alert = vi.fn(async () => "sent");
vi.mock("@/lib/billing/duplicate", () => ({ sendDuplicateAlert: (...a: unknown[]) => alert(...(a as [])) }));

const { syncSubscription } = await import("@/lib/billing/sync");

const now = Date.now();
const iso = (ms: number) => new Date(ms).toISOString();
const sub = (status: string) => ({
  id: "I-NEW",
  status,
  plan_id: "P-MONTHLY",
  custom_id: "u1",
  status_update_time: iso(now),
  billing_info: { last_payment: { time: iso(now - 1000) }, next_billing_time: iso(now + 30 * 86_400_000) },
});
const prisma = (existing: Record<string, unknown> | null) => ({
  user: { findUnique: async () => ({ id: "u1", email: "p@example.com", subscription: existing }) },
  subscription: { upsert: async () => ({}) },
});

beforeEach(() => {
  vi.stubEnv("PAYPAL_MODE", "sandbox");
  vi.stubEnv("PAYPAL_PLAN_MONTHLY", "P-MONTHLY");
  vi.stubEnv("PAYPAL_PLAN_YEARLY", "P-YEARLY");
  welcome.mockClear();
  alert.mockClear();
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("syncSubscription → welcome email", () => {
  it("asks for the welcome when a subscription becomes active", async () => {
    paypalSub.mockReturnValue(sub("ACTIVE"));
    const r = await syncSubscription(prisma(null) as never, "I-NEW");
    expect(r).toMatchObject({ result: "updated", status: "ACTIVE", pro: true });
    expect(welcome).toHaveBeenCalledWith(expect.anything(), "u1");
  });

  it("doesn't ask again for the same subscription, nor for a canceled one", async () => {
    paypalSub.mockReturnValue(sub("ACTIVE"));
    await syncSubscription(prisma({ paypalSubscriptionId: "I-NEW", status: "ACTIVE", welcomeEmailFor: "I-NEW" }) as never, "I-NEW");
    paypalSub.mockReturnValue(sub("CANCELLED"));
    await syncSubscription(prisma(null) as never, "I-NEW");
    expect(welcome).not.toHaveBeenCalled();
  });

  it("still stores the subscription when the email fails", async () => {
    paypalSub.mockReturnValue(sub("ACTIVE"));
    welcome.mockRejectedValueOnce(new Error("db down"));
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await syncSubscription(prisma(null) as never, "I-NEW");
    quiet.mockRestore();
    expect(r).toMatchObject({ result: "updated", pro: true });
  });
});

describe("syncSubscription → duplicate alert", () => {
  it("alerts the owner when a second active subscription is canceled, and only then", async () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    paypalSub.mockReturnValue(sub("ACTIVE"));
    const keep = { paypalSubscriptionId: "I-KEEP", status: "ACTIVE", currentPeriodEnd: new Date(now + 20 * 86_400_000) };
    const r = await syncSubscription(prisma(keep) as never, "I-NEW");
    quiet.mockRestore();
    expect(r).toEqual({ result: "duplicate", userId: "u1" });
    expect(alert).toHaveBeenCalledWith({ parentEmail: "p@example.com", userId: "u1", duplicateSubscriptionId: "I-NEW", keptSubscriptionId: "I-KEEP" });
    expect(welcome).not.toHaveBeenCalled();

    // The same duplicate seen again after its cancellation: ignored, no alert.
    alert.mockClear();
    paypalSub.mockReturnValue(sub("CANCELLED"));
    expect(await syncSubscription(prisma(keep) as never, "I-NEW")).toMatchObject({ result: "ignored", reason: "not_current" });
    expect(alert).not.toHaveBeenCalled();
  });
});
