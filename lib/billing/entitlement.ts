import type { Subscription } from "@prisma/client";

// Whether a parent has AlphaBes Pro. Every Pro gate (premium games, premium
// stories, bundle downloads) asks this on the server; see docs/paypal-plan.md.
// Pure, so it reads only what lib/billing/sync.ts copied from PayPal.

export type BillingState = Pick<Subscription, "plan" | "status" | "currentPeriodEnd">;

// PayPal retries a failed renewal for a few days before suspending the
// subscription; Pro continues meanwhile.
export const RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000;

export function hasPro(sub: BillingState | null | undefined, now: Date = new Date()): boolean {
  if (!sub || sub.plan === "FREE") return false;
  const end = sub.currentPeriodEnd?.getTime();

  switch (sub.status) {
    case "ACTIVE":
      // PayPal gives every active subscription a next billing time; without
      // one, PayPal's ACTIVE is enough.
      return end === undefined || now.getTime() < end + RENEWAL_GRACE_MS;
    case "CANCELED":
    case "EXPIRED":
      // Canceling stops renewals; the paid period still runs to its end.
      // A refund ends it at once (sync sets currentPeriodEnd to then).
      return end !== undefined && now.getTime() < end;
    default:
      // APPROVAL_PENDING (not paid yet), SUSPENDED (payment failed) and the
      // old Stripe statuses.
      return false;
  }
}
