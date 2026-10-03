import { paypalFetch } from "./client";
import { subscriptionIdOfSale } from "./subscriptions";

// The events app/api/paypal/webhook acts on. scripts/paypal-setup-webhook.mjs
// subscribes to exactly these (a test checks the two lists match).
export const HANDLED_EVENTS = [
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.UPDATED",
  "BILLING.SUBSCRIPTION.RE-ACTIVATED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.EXPIRED",
  "PAYMENT.SALE.COMPLETED",
  "PAYMENT.SALE.REFUNDED",
  "PAYMENT.SALE.REVERSED",
] as const;

// A refund or reversal of a subscription payment ends Pro at once
// (docs/paypal-plan.md, B5).
export const REFUND_EVENTS: ReadonlySet<string> = new Set(["PAYMENT.SALE.REFUNDED", "PAYMENT.SALE.REVERSED"]);

export interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  resource: Record<string, unknown>;
}

export function isWebhookEvent(value: unknown): value is PayPalWebhookEvent {
  const v = value as PayPalWebhookEvent | null;
  return (
    typeof v === "object" &&
    v !== null &&
    typeof v.id === "string" &&
    v.id.length > 0 &&
    typeof v.event_type === "string" &&
    typeof v.resource === "object" &&
    v.resource !== null
  );
}

const SIGNATURE_HEADERS = {
  auth_algo: "paypal-auth-algo",
  cert_url: "paypal-cert-url",
  transmission_id: "paypal-transmission-id",
  transmission_sig: "paypal-transmission-sig",
  transmission_time: "paypal-transmission-time",
} as const;

// The body of PayPal's verify-webhook-signature request. The event goes in
// as the exact bytes PayPal sent: parsing and re-serializing it can change
// it (number formats, escapes) and make a genuine event fail the check.
// Returns null when a signature header is missing.
export function buildVerifyRequestBody(rawBody: string, headers: Headers, webhookId: string): string | null {
  const fields: Record<string, string> = {};
  for (const [field, header] of Object.entries(SIGNATURE_HEADERS)) {
    const value = headers.get(header);
    if (!value) return null;
    fields[field] = value;
  }
  fields.webhook_id = webhookId;
  const prefix = JSON.stringify(fields).slice(0, -1); // without the closing brace
  return `${prefix},"webhook_event":${rawBody}}`;
}

// Anyone can POST to the webhook URL; only PayPal can produce a signature
// it confirms for our webhook id. Never act on an event without this.
// rawBody must already have been checked to be a JSON object.
export async function verifyWebhookSignature(rawBody: string, headers: Headers): Promise<boolean> {
  // Unsigned requests are refused without asking PayPal.
  if (!buildVerifyRequestBody(rawBody, headers, "")) return false;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
  const body = buildVerifyRequestBody(rawBody, headers, webhookId);
  if (!body) return false;
  const result = await paypalFetch<{ verification_status?: string }>("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body,
  });
  return result.verification_status === "SUCCESS";
}

const str = (v: unknown) => (typeof v === "string" && v ? v : null);

// The subscription id an event is about, without calling PayPal; null when
// it can't be read from the event alone.
export function subscriptionIdInEvent(event: PayPalWebhookEvent): string | null {
  if (event.event_type.startsWith("BILLING.SUBSCRIPTION.")) return str(event.resource.id);
  if (event.event_type.startsWith("PAYMENT.SALE.")) return str(event.resource.billing_agreement_id);
  return null;
}

// Same, asking PayPal for the sale when a refund carries only its sale id.
export async function resolveSubscriptionId(event: PayPalWebhookEvent): Promise<string | null> {
  const direct = subscriptionIdInEvent(event);
  if (direct) return direct;
  const saleId = REFUND_EVENTS.has(event.event_type) ? str(event.resource.sale_id) : null;
  return saleId ? subscriptionIdOfSale(saleId) : null;
}
