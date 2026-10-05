import type { Locale } from "@/i18n/routing";
import { PayPalError, paypalFetch } from "./client";

// The parts of PayPal's subscription object we use.
export interface PayPalSubscription {
  id: string;
  status: "APPROVAL_PENDING" | "APPROVED" | "ACTIVE" | "SUSPENDED" | "CANCELLED" | "EXPIRED";
  plan_id: string;
  custom_id?: string; // our User.id, set when the subscription is created
  status_update_time?: string;
  billing_info?: {
    next_billing_time?: string;
    last_payment?: { time?: string };
  };
  links?: { href: string; rel: string }[];
}

// PayPal's pages in the language of the page the parent came from (PayPal
// may still use the language of the buyer's own PayPal account).
export const PAYPAL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-MX",
  pt: "pt-BR",
};

export interface CreateSubscriptionParams {
  planId: string;
  userId: string;
  locale: Locale;
  returnUrl: string;
  cancelUrl: string;
}

// Creates a subscription waiting for the parent's approval. Nothing is
// stored yet: it only becomes ours once PayPal reports it active with our
// user id in custom_id (lib/billing/sync.ts).
export function createSubscription(p: CreateSubscriptionParams): Promise<PayPalSubscription> {
  return paypalFetch<PayPalSubscription>("/v1/billing/subscriptions", {
    method: "POST",
    requestId: `alphabes-sub-${crypto.randomUUID()}`,
    body: {
      plan_id: p.planId,
      custom_id: p.userId,
      application_context: {
        brand_name: "AlphaBes",
        locale: PAYPAL_LOCALES[p.locale],
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: p.returnUrl,
        cancel_url: p.cancelUrl,
      },
    },
  });
}

export function approveLink(sub: PayPalSubscription): string | null {
  return sub.links?.find((l) => l.rel === "approve")?.href ?? null;
}

// PayPal subscription ids look like "I-ABC123..."; checked before an id
// from a URL is put in an API path.
export function isPayPalSubscriptionId(id: unknown): id is string {
  return typeof id === "string" && /^I-[A-Z0-9]{6,40}$/.test(id);
}

export function getSubscription(id: string): Promise<PayPalSubscription> {
  return paypalFetch<PayPalSubscription>(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);
}

// Stops future payments. Canceling a subscription that is already canceled
// or expired is not an error here.
export async function cancelSubscription(id: string, reason: string): Promise<void> {
  try {
    await paypalFetch(`/v1/billing/subscriptions/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
      body: { reason: reason.slice(0, 127) },
    });
  } catch (err) {
    if (err instanceof PayPalError && err.status === 422) return; // SUBSCRIPTION_STATUS_INVALID
    throw err;
  }
}

// The subscription a payment (sale) belongs to; used for refunds, whose
// webhook carries only the sale id.
export async function subscriptionIdOfSale(saleId: string): Promise<string | null> {
  const sale = await paypalFetch<{ billing_agreement_id?: string }>(
    `/v1/payments/sale/${encodeURIComponent(saleId)}`,
  );
  return sale.billing_agreement_id ?? null;
}

export interface SubscriptionPayment {
  id: string; // the transaction (sale) id, as shown in PayPal → Activity
  status: string;
  amount: string | null; // e.g. "7.99 USD"
  time: string;
}

// The payments of a subscription in the last `days` days, newest first
// (read-only). Used for the duplicate alert (lib/billing/duplicate.ts).
export async function recentPayments(id: string, days = 7, now = new Date()): Promise<SubscriptionPayment[]> {
  const start = new Date(now.getTime() - days * 86_400_000).toISOString();
  const res = await paypalFetch<{
    transactions?: {
      id: string;
      status: string;
      time: string;
      amount_with_breakdown?: { gross_amount?: { value?: string; currency_code?: string } };
    }[];
  }>(
    `/v1/billing/subscriptions/${encodeURIComponent(id)}/transactions?start_time=${encodeURIComponent(start)}&end_time=${encodeURIComponent(now.toISOString())}`,
  );
  return (res.transactions ?? [])
    .map((t) => {
      const g = t.amount_with_breakdown?.gross_amount;
      return { id: t.id, status: t.status, amount: g?.value ? `${g.value} ${g.currency_code ?? "USD"}` : null, time: t.time };
    })
    .sort((a, b) => b.time.localeCompare(a.time));
}
