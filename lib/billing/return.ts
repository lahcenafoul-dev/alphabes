import type { PrismaClient } from "@prisma/client";
import { isPayPalSubscriptionId } from "@/lib/paypal/subscriptions";
import { syncSubscription } from "./sync";

// The notices the dashboard can show about billing (messages: Billing.*).
export type BillingNotice = "returnActive" | "returnPending" | "returnProblem" | "duplicate" | "alreadyPro";

// The parent is back from PayPal (?billing=return&subscription_id=I-...).
// The query string only says which subscription to look at: its state is
// read from PayPal, and it must belong to this parent. The webhook does the
// same, so whichever arrives first activates Pro.
export async function confirmReturn(
  prisma: PrismaClient,
  userId: string,
  subscriptionId: unknown,
): Promise<BillingNotice> {
  if (!isPayPalSubscriptionId(subscriptionId)) return "returnProblem";
  try {
    const r = await syncSubscription(prisma, subscriptionId, { expectUserId: userId });
    if (r.result === "duplicate") return "duplicate";
    if (r.result === "updated") return r.pro ? "returnActive" : r.status === "APPROVAL_PENDING" ? "returnPending" : "returnProblem";
    return r.reason === "not_paid" ? "returnPending" : "returnProblem";
  } catch (err) {
    console.error("PayPal: return check failed:", err instanceof Error ? err.message : err);
    return "returnProblem";
  }
}

// Which notice the dashboard URL asks for, before any PayPal check.
export function requestedNotice(billing: unknown): "return" | "alreadyPro" | null {
  return billing === "return" ? "return" : billing === "already_pro" ? "alreadyPro" : null;
}
