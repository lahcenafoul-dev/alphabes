import type { PrismaClient, Subscription, SubscriptionStatus } from "@prisma/client";
import { hasPro } from "./entitlement";
import { paidUntil, planChoiceOf, subscriptionPlanOf, type PlanChoice } from "@/lib/paypal/plans";
import { cancelSubscription, getSubscription, type PayPalSubscription } from "@/lib/paypal/subscriptions";
import { sendWelcomeEmail } from "./welcome";
import { sendDuplicateAlert } from "./duplicate";

// The only code that writes billing state (docs/paypal-plan.md). It copies
// PayPal's current state of a subscription instead of applying each event's
// change, so repeated, late or out-of-order events all end in the same,
// right state. Used by the webhook, the return from PayPal and the cancel
// button.

type Existing = Pick<
  Subscription,
  "status" | "plan" | "paypalSubscriptionId" | "currentPeriodEnd" | "lastPaymentAt" | "canceledAt"
>;

export type BillingWrite = Pick<
  Subscription,
  | "plan"
  | "status"
  | "paypalSubscriptionId"
  | "paypalPlanId"
  | "currentPeriodEnd"
  | "lastPaymentAt"
  | "canceledAt"
  | "syncedAt"
>;

// Why a subscription was left alone.
export type IgnoreReason =
  | "unknown_plan" // not one of our PayPal plans
  | "not_paid" // waiting for the parent's approval
  | "not_current" // an older subscription of this parent
  | "no_custom_id"
  | "other_account" // belongs to another parent
  | "unknown_user";

export type SyncDecision =
  | { kind: "write"; data: BillingWrite }
  | { kind: "ignore"; reason: IgnoreReason }
  // A second active subscription while the first one still gives Pro (two
  // checkouts at once). The newer one is canceled at PayPal; the owner
  // refunds its payment.
  | { kind: "duplicate" };

const STATUS: Record<PayPalSubscription["status"], SubscriptionStatus> = {
  APPROVAL_PENDING: "APPROVAL_PENDING",
  APPROVED: "APPROVAL_PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  CANCELLED: "CANCELED",
  EXPIRED: "EXPIRED",
};

const date = (s: string | undefined) => (s ? new Date(s) : null);
const ended = (s: SubscriptionStatus | undefined) => s === "CANCELED" || s === "EXPIRED";

export function decideSync(
  existing: Existing | null,
  sub: PayPalSubscription,
  opts: { refunded?: boolean; now?: Date } = {},
): SyncDecision {
  const now = opts.now ?? new Date();
  const choice: PlanChoice | null = planChoiceOf(sub.plan_id);
  if (!choice) return { kind: "ignore", reason: "unknown_plan" };
  if (sub.status === "APPROVAL_PENDING" || sub.status === "APPROVED") {
    return { kind: "ignore", reason: "not_paid" };
  }

  const same = existing?.paypalSubscriptionId === sub.id;
  if (existing?.paypalSubscriptionId && !same) {
    // Events about an older subscription of this parent change nothing; a
    // new active one replaces it, unless the current one still gives Pro.
    if (sub.status !== "ACTIVE") return { kind: "ignore", reason: "not_current" };
    if (existing.status === "ACTIVE" && hasPro(existing, now)) return { kind: "duplicate" };
  }
  const prev = same ? existing : null;

  const lastPaymentAt = date(sub.billing_info?.last_payment?.time) ?? prev?.lastPaymentAt ?? null;
  const paidEnd = lastPaymentAt ? paidUntil(choice, lastPaymentAt) : null;
  let status = STATUS[sub.status];
  let currentPeriodEnd: Date | null;
  let canceledAt: Date | null = null;

  if (status === "ACTIVE" || status === "SUSPENDED") {
    currentPeriodEnd = date(sub.billing_info?.next_billing_time) ?? paidEnd ?? prev?.currentPeriodEnd ?? null;
  } else {
    // Canceled or expired: Pro lasts to the end of the last paid period.
    // Once we've recorded that end it stays fixed, so a refund that ended
    // Pro early isn't undone by a later event.
    currentPeriodEnd =
      ended(prev?.status) && prev?.currentPeriodEnd
        ? prev.currentPeriodEnd
        : (paidEnd ?? (prev?.status === "ACTIVE" ? prev.currentPeriodEnd : null));
    canceledAt = prev?.canceledAt ?? date(sub.status_update_time) ?? now;
  }

  if (opts.refunded) {
    status = "CANCELED";
    currentPeriodEnd = currentPeriodEnd && currentPeriodEnd < now ? currentPeriodEnd : now;
    canceledAt = canceledAt ?? now;
  }

  return {
    kind: "write",
    data: {
      plan: subscriptionPlanOf(choice),
      status,
      paypalSubscriptionId: sub.id,
      paypalPlanId: sub.plan_id,
      currentPeriodEnd,
      lastPaymentAt,
      canceledAt,
      syncedAt: now,
    },
  };
}

export type SyncResult =
  | { result: "updated"; userId: string; status: SubscriptionStatus; pro: boolean }
  | { result: "ignored"; reason: IgnoreReason }
  | { result: "duplicate"; userId: string };

// Fetches the subscription from PayPal and stores its state for the parent
// in its custom_id. `expectUserId` (return from PayPal, cancel button)
// refuses a subscription that belongs to someone else. `refunded` (refund
// webhooks) cancels it at PayPal and ends Pro now.
export async function syncSubscription(
  prisma: PrismaClient,
  paypalId: string,
  opts: { expectUserId?: string; refunded?: boolean } = {},
): Promise<SyncResult> {
  let sub = await getSubscription(paypalId);
  const userId = sub.custom_id;
  if (!userId) return { result: "ignored", reason: "no_custom_id" };
  if (opts.expectUserId && opts.expectUserId !== userId) {
    return { result: "ignored", reason: "other_account" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  if (!user) return { result: "ignored", reason: "unknown_user" };

  if (opts.refunded && (sub.status === "ACTIVE" || sub.status === "SUSPENDED")) {
    await cancelSubscription(sub.id, "Payment refunded");
    sub = await getSubscription(paypalId);
  }

  const decision = decideSync(user.subscription, sub, { refunded: opts.refunded });
  if (decision.kind === "ignore") return { result: "ignored", reason: decision.reason };
  if (decision.kind === "duplicate") {
    console.error(`PayPal: duplicate subscription ${sub.id} for user ${userId} canceled; refund its payment.`);
    await cancelSubscription(sub.id, "Duplicate AlphaBes subscription");
    await sendDuplicateAlert({
      parentEmail: user.email,
      userId,
      duplicateSubscriptionId: sub.id,
      keptSubscriptionId: user.subscription?.paypalSubscriptionId ?? null,
    });
    return { result: "duplicate", userId };
  }

  await prisma.subscription.upsert({
    where: { userId },
    update: decision.data,
    create: { userId, ...decision.data },
  });
  const pro = hasPro(decision.data);
  if (pro && decision.data.status === "ACTIVE" && user.subscription?.welcomeEmailFor !== sub.id) {
    // Billing state is already stored; an email problem must not fail the sync.
    await sendWelcomeEmail(prisma, userId).catch((err) =>
      console.error("Welcome email failed:", err instanceof Error ? err.message : err),
    );
  }
  return { result: "updated", userId, status: decision.data.status, pro };
}
