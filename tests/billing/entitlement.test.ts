import { describe, expect, it } from "vitest";
import { hasPro, RENEWAL_GRACE_MS, type BillingState } from "@/lib/billing/entitlement";

const now = new Date("2026-10-03T12:00:00Z");
const day = 24 * 60 * 60 * 1000;
const at = (ms: number) => new Date(now.getTime() + ms);

function sub(over: Partial<BillingState>): BillingState {
  return { plan: "PRO_MONTHLY", status: "ACTIVE", currentPeriodEnd: at(10 * day), ...over };
}

describe("hasPro", () => {
  it("is false without a subscription or on the free plan", () => {
    expect(hasPro(null, now)).toBe(false);
    expect(hasPro(undefined, now)).toBe(false);
    expect(hasPro(sub({ plan: "FREE" }), now)).toBe(false);
    // New accounts get a FREE row with status ACTIVE and no period.
    expect(hasPro(sub({ plan: "FREE", currentPeriodEnd: null }), now)).toBe(false);
  });

  it("is true for an active monthly or yearly subscription", () => {
    expect(hasPro(sub({}), now)).toBe(true);
    expect(hasPro(sub({ plan: "PRO_ANNUAL", currentPeriodEnd: at(300 * day) }), now)).toBe(true);
    expect(hasPro(sub({ currentPeriodEnd: null }), now)).toBe(true);
  });

  it("keeps an active subscription through the renewal grace period only", () => {
    expect(hasPro(sub({ currentPeriodEnd: at(-day) }), now)).toBe(true);
    expect(hasPro(sub({ currentPeriodEnd: at(-RENEWAL_GRACE_MS + 1) }), now)).toBe(true);
    expect(hasPro(sub({ currentPeriodEnd: at(-RENEWAL_GRACE_MS) }), now)).toBe(false);
  });

  it("keeps Pro after canceling until the paid period ends, without grace", () => {
    expect(hasPro(sub({ status: "CANCELED" }), now)).toBe(true);
    expect(hasPro(sub({ status: "CANCELED", currentPeriodEnd: at(1) }), now)).toBe(true);
    expect(hasPro(sub({ status: "CANCELED", currentPeriodEnd: now }), now)).toBe(false);
    expect(hasPro(sub({ status: "CANCELED", currentPeriodEnd: at(-day) }), now)).toBe(false);
    expect(hasPro(sub({ status: "CANCELED", currentPeriodEnd: null }), now)).toBe(false);
    expect(hasPro(sub({ status: "EXPIRED" }), now)).toBe(true);
    expect(hasPro(sub({ status: "EXPIRED", currentPeriodEnd: at(-1) }), now)).toBe(false);
  });

  it("is false while waiting for approval, when suspended, and for old Stripe statuses", () => {
    for (const status of [
      "APPROVAL_PENDING",
      "SUSPENDED",
      "PAST_DUE",
      "TRIALING",
      "INCOMPLETE",
      "INCOMPLETE_EXPIRED",
      "UNPAID",
      "PAUSED",
    ] as const) {
      expect(hasPro(sub({ status }), now), status).toBe(false);
    }
  });

  it("uses the current time by default", () => {
    expect(hasPro({ plan: "PRO_MONTHLY", status: "ACTIVE", currentPeriodEnd: new Date(Date.now() + day) })).toBe(true);
    expect(hasPro({ plan: "PRO_MONTHLY", status: "CANCELED", currentPeriodEnd: new Date(Date.now() - day) })).toBe(false);
  });
});
