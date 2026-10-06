import type { SubscriptionPlan } from "@prisma/client";
import { paypalMode } from "./client";

// The plans a parent can choose on the pricing page. The browser only ever
// sends one of these names; the PayPal plan IDs stay on the server.
// "test" is the sandbox-only daily plan used to watch renewals happen
// (docs/paypal-plan.md); it doesn't exist in live mode.
export const PLAN_CHOICES = ["monthly", "yearly", "test"] as const;
export type PlanChoice = (typeof PLAN_CHOICES)[number];

export function isPlanChoice(value: unknown): value is PlanChoice {
  return typeof value === "string" && (PLAN_CHOICES as readonly string[]).includes(value);
}

const PLAN_ENV: Record<PlanChoice, string> = {
  monthly: "PAYPAL_PLAN_MONTHLY",
  yearly: "PAYPAL_PLAN_YEARLY",
  test: "PAYPAL_PLAN_TEST",
};

const PLAN_KIND: Record<PlanChoice, SubscriptionPlan> = {
  monthly: "PRO_MONTHLY",
  yearly: "PRO_ANNUAL",
  test: "PRO_MONTHLY",
};

// How long one payment pays for, to know when Pro ends after a cancel.
const PLAN_PERIOD: Record<PlanChoice, { months?: number; days?: number }> = {
  monthly: { months: 1 },
  yearly: { months: 12 },
  test: { days: 1 },
};

function enabled(choice: PlanChoice): boolean {
  return choice !== "test" || paypalMode() === "sandbox";
}

// The PayPal plan ID for a choice, or null when it isn't configured (or is
// the test plan in live mode).
export function paypalPlanId(choice: PlanChoice): string | null {
  return (enabled(choice) && process.env[PLAN_ENV[choice]]) || null;
}

// Which of our plans a PayPal plan ID is; null for any other plan (another
// site's, or one we don't sell), which is then never given Pro.
export function planChoiceOf(paypalId: string | null | undefined): PlanChoice | null {
  if (!paypalId) return null;
  return PLAN_CHOICES.find((c) => paypalPlanId(c) === paypalId) ?? null;
}

export function subscriptionPlanOf(choice: PlanChoice): SubscriptionPlan {
  return PLAN_KIND[choice];
}

// The end of the period paid by a payment made at `paidAt`.
export function paidUntil(choice: PlanChoice, paidAt: Date): Date {
  const { months = 0, days = 0 } = PLAN_PERIOD[choice];
  const end = new Date(paidAt);
  if (months) {
    // 31 January + 1 month = 28/29 February, not 3 March.
    const day = end.getUTCDate();
    end.setUTCDate(1);
    end.setUTCMonth(end.getUTCMonth() + months);
    const lastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate();
    end.setUTCDate(Math.min(day, lastDay));
  }
  end.setUTCDate(end.getUTCDate() + days);
  return end;
}

// When Pro ends if the subscription is canceled: the end of the period paid
// by the last payment, else `fallback`. The sync stores this on a cancel and
// the cancel confirmation shows it, so the two always agree. It isn't
// PayPal's next billing time, which PayPal counts in its own time zone and
// can be up to a day earlier.
export function proEndIfCanceled(
  choice: PlanChoice | null,
  lastPaymentAt: Date | null,
  fallback: Date | null,
): Date | null {
  return choice && lastPaymentAt ? paidUntil(choice, lastPaymentAt) : fallback;
}
