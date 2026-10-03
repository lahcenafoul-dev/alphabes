import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasPro } from "@/lib/billing/entitlement";
import { isSameOrigin } from "@/lib/billing/same-origin";
import { decideSync, type BillingWrite } from "@/lib/billing/sync";
import { isPlanChoice, paidUntil, paypalPlanId, planChoiceOf, subscriptionPlanOf } from "@/lib/paypal/plans";
import { isPayPalSubscriptionId, type PayPalSubscription } from "@/lib/paypal/subscriptions";
import {
  HANDLED_EVENTS,
  buildVerifyRequestBody,
  subscriptionIdInEvent,
  verifyWebhookSignature,
} from "@/lib/paypal/webhooks";
// @ts-expect-error plain JS module
import { EVENT_TYPES } from "@/scripts/paypal/events.mjs";
// @ts-expect-error plain JS module
import { setEnvLine } from "@/scripts/paypal/common.mjs";

// Fake values for tests only.
const ENV = {
  PAYPAL_MODE: "sandbox",
  PAYPAL_CLIENT_ID: "test-client",
  PAYPAL_CLIENT_SECRET: "test-secret",
  PAYPAL_WEBHOOK_ID: "WH-TEST",
  PAYPAL_PLAN_MONTHLY: "P-MONTHLY",
  PAYPAL_PLAN_YEARLY: "P-YEARLY",
  PAYPAL_PLAN_TEST: "P-DAILY",
};

beforeEach(() => {
  for (const [k, v] of Object.entries(ENV)) vi.stubEnv(k, v);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("plans", () => {
  it("accepts only the known plan names from the browser", () => {
    expect(isPlanChoice("monthly")).toBe(true);
    expect(isPlanChoice("yearly")).toBe(true);
    expect(isPlanChoice("P-MONTHLY")).toBe(false);
    expect(isPlanChoice(null)).toBe(false);
  });

  it("maps choices to PayPal plan ids and back", () => {
    expect(paypalPlanId("monthly")).toBe("P-MONTHLY");
    expect(paypalPlanId("yearly")).toBe("P-YEARLY");
    expect(planChoiceOf("P-YEARLY")).toBe("yearly");
    expect(planChoiceOf("P-SOMEONE-ELSES")).toBeNull();
    expect(planChoiceOf(undefined)).toBeNull();
    expect(subscriptionPlanOf("monthly")).toBe("PRO_MONTHLY");
    expect(subscriptionPlanOf("yearly")).toBe("PRO_ANNUAL");
  });

  it("has the daily test plan in sandbox only", () => {
    expect(paypalPlanId("test")).toBe("P-DAILY");
    vi.stubEnv("PAYPAL_MODE", "live");
    expect(paypalPlanId("test")).toBeNull();
    expect(planChoiceOf("P-DAILY")).toBeNull();
  });

  it("returns null for a plan that isn't configured", () => {
    vi.stubEnv("PAYPAL_PLAN_YEARLY", "");
    expect(paypalPlanId("yearly")).toBeNull();
  });

  it("computes the end of a paid period", () => {
    const d = (s: string) => new Date(s);
    expect(paidUntil("monthly", d("2026-10-03T10:00:00Z"))).toEqual(d("2026-11-03T10:00:00Z"));
    expect(paidUntil("monthly", d("2026-01-31T10:00:00Z"))).toEqual(d("2026-02-28T10:00:00Z"));
    expect(paidUntil("monthly", d("2028-01-31T10:00:00Z"))).toEqual(d("2028-02-29T10:00:00Z"));
    expect(paidUntil("monthly", d("2026-12-15T00:00:00Z"))).toEqual(d("2027-01-15T00:00:00Z"));
    expect(paidUntil("yearly", d("2028-02-29T10:00:00Z"))).toEqual(d("2029-02-28T10:00:00Z"));
    expect(paidUntil("test", d("2026-10-31T23:00:00Z"))).toEqual(d("2026-11-01T23:00:00Z"));
  });
});

describe("webhook helpers", () => {
  it("subscribes to exactly the events the route handles", () => {
    expect([...EVENT_TYPES].sort()).toEqual([...HANDLED_EVENTS].sort());
  });

  const headers = () =>
    new Headers({
      "paypal-auth-algo": "SHA256withRSA",
      "paypal-cert-url": "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-1",
      "paypal-transmission-id": "tx-1",
      "paypal-transmission-sig": "sig==",
      "paypal-transmission-time": "2026-10-03T12:00:00Z",
    });
  // Formatting that JSON.parse + JSON.stringify would change.
  const raw = '{"id":"WH-1","event_type":"PAYMENT.SALE.COMPLETED","resource":{"amount":{"total":"7.99"},"n":1.50,"t":"caf\\u00e9"}}';

  it("sends the event's exact bytes for verification", () => {
    const body = buildVerifyRequestBody(raw, headers(), "WH-TEST")!;
    expect(body.endsWith(`"webhook_event":${raw}}`)).toBe(true);
    const parsed = JSON.parse(body);
    expect(parsed).toMatchObject({
      auth_algo: "SHA256withRSA",
      transmission_id: "tx-1",
      transmission_sig: "sig==",
      webhook_id: "WH-TEST",
    });
    expect(parsed.webhook_event.id).toBe("WH-1");
  });

  it("refuses an event with a missing signature header", () => {
    const h = headers();
    h.delete("paypal-transmission-sig");
    expect(buildVerifyRequestBody(raw, h, "WH-TEST")).toBeNull();
  });

  it("asks PayPal to verify, with the raw body, and trusts only SUCCESS", async () => {
    const calls: { url: string; body: unknown }[] = [];
    let status = "SUCCESS";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: RequestInit) => {
        calls.push({ url, body: init.body });
        if (url.endsWith("/v1/oauth2/token")) {
          return new Response(JSON.stringify({ access_token: "tok", expires_in: 32400 }));
        }
        return new Response(JSON.stringify({ verification_status: status }));
      }),
    );
    expect(await verifyWebhookSignature(raw, headers())).toBe(true);
    const verify = calls.find((c) => c.url.endsWith("/verify-webhook-signature"))!;
    expect(verify.url.startsWith("https://api-m.sandbox.paypal.com/")).toBe(true);
    expect(verify.body).toBe(buildVerifyRequestBody(raw, headers(), "WH-TEST"));
    status = "FAILURE";
    expect(await verifyWebhookSignature(raw, headers())).toBe(false);
    const h = headers();
    h.delete("paypal-cert-url");
    expect(await verifyWebhookSignature(raw, h)).toBe(false);
  });

  it("finds the subscription an event is about", () => {
    const ev = (event_type: string, resource: Record<string, unknown>) => ({ id: "WH-1", event_type, resource });
    expect(subscriptionIdInEvent(ev("BILLING.SUBSCRIPTION.CANCELLED", { id: "I-ABC123" }))).toBe("I-ABC123");
    expect(subscriptionIdInEvent(ev("PAYMENT.SALE.COMPLETED", { id: "SALE1", billing_agreement_id: "I-ABC123" }))).toBe(
      "I-ABC123",
    );
    expect(subscriptionIdInEvent(ev("PAYMENT.SALE.REFUNDED", { id: "R1", sale_id: "SALE1" }))).toBeNull();
  });

  it("checks subscription ids before using them in a URL", () => {
    expect(isPayPalSubscriptionId("I-BW452GLLEP1G")).toBe(true);
    expect(isPayPalSubscriptionId("I-BW452/../x")).toBe(false);
    expect(isPayPalSubscriptionId("")).toBe(false);
    expect(isPayPalSubscriptionId(undefined)).toBe(false);
  });
});

describe("isSameOrigin", () => {
  const req = (origin?: string) =>
    new Request("https://alphabes.com/api/paypal/subscribe", {
      method: "POST",
      headers: origin ? { origin } : {},
    });
  it("accepts our own origin only", () => {
    expect(isSameOrigin(req("https://alphabes.com"))).toBe(true);
    expect(isSameOrigin(req("https://evil.example"))).toBe(false);
    expect(isSameOrigin(req("http://alphabes.com"))).toBe(false);
    expect(isSameOrigin(req())).toBe(false);
  });
});

describe("setEnvLine (setup scripts writing .env)", () => {
  it("replaces, appends and keeps line endings and comments", () => {
    expect(setEnvLine("", "A", "1")).toBe("A=1\n");
    expect(setEnvLine("X=1\nA=old\n", "A", "new")).toBe("X=1\nA=new\n");
    expect(setEnvLine("X=1\r\n", "A", "2")).toBe("X=1\r\nA=2\r\n");
    expect(setEnvLine("X=1", "A", "2")).toBe("X=1\nA=2\n");
    expect(setEnvLine("# A=example\nAB=1\n", "A", "2")).toBe("# A=example\nAB=1\nA=2\n");
  });
});

describe("decideSync", () => {
  const now = new Date("2026-10-03T12:00:00Z");
  const paypal = (over: Partial<PayPalSubscription> = {}): PayPalSubscription => ({
    id: "I-NEW000001",
    status: "ACTIVE",
    plan_id: "P-MONTHLY",
    custom_id: "user1",
    billing_info: {
      last_payment: { time: "2026-10-03T11:00:00Z" },
      next_billing_time: "2026-11-03T10:00:00Z",
    },
    ...over,
  });
  type Existing = Parameters<typeof decideSync>[0];
  const free: Existing = {
    plan: "FREE",
    status: "ACTIVE",
    paypalSubscriptionId: null,
    currentPeriodEnd: null,
    lastPaymentAt: null,
    canceledAt: null,
  };
  const write = (d: ReturnType<typeof decideSync>): BillingWrite => {
    if (d.kind !== "write") throw new Error(`expected write, got ${JSON.stringify(d)}`);
    return d.data;
  };

  it("activates a new monthly or yearly subscription", () => {
    const data = write(decideSync(free, paypal(), { now }));
    expect(data).toMatchObject({
      plan: "PRO_MONTHLY",
      status: "ACTIVE",
      paypalSubscriptionId: "I-NEW000001",
      paypalPlanId: "P-MONTHLY",
      currentPeriodEnd: new Date("2026-11-03T10:00:00Z"),
      lastPaymentAt: new Date("2026-10-03T11:00:00Z"),
      canceledAt: null,
      syncedAt: now,
    });
    expect(hasPro(data, now)).toBe(true);
    expect(write(decideSync(null, paypal({ plan_id: "P-YEARLY" }), { now })).plan).toBe("PRO_ANNUAL");
  });

  it("ignores other plans and subscriptions not yet approved", () => {
    expect(decideSync(free, paypal({ plan_id: "P-OTHER" }), { now })).toMatchObject({ kind: "ignore" });
    expect(decideSync(free, paypal({ status: "APPROVAL_PENDING" }), { now })).toMatchObject({ kind: "ignore" });
    expect(decideSync(free, paypal({ status: "APPROVED" }), { now })).toMatchObject({ kind: "ignore" });
  });

  it("moves the period forward on renewal", () => {
    const active = write(decideSync(free, paypal(), { now }));
    const later = new Date("2026-11-03T12:00:00Z");
    const renewed = write(
      decideSync(
        active,
        paypal({
          billing_info: {
            last_payment: { time: "2026-11-03T10:05:00Z" },
            next_billing_time: "2026-12-03T10:00:00Z",
          },
        }),
        { now: later },
      ),
    );
    expect(renewed.currentPeriodEnd).toEqual(new Date("2026-12-03T10:00:00Z"));
    expect(hasPro(renewed, later)).toBe(true);
  });

  it("removes Pro when PayPal suspends the subscription", () => {
    const active = write(decideSync(free, paypal(), { now }));
    const suspended = write(decideSync(active, paypal({ status: "SUSPENDED" }), { now }));
    expect(suspended.status).toBe("SUSPENDED");
    expect(hasPro(suspended, now)).toBe(false);
  });

  it("keeps Pro after a cancel until the paid period ends", () => {
    const active = write(decideSync(free, paypal(), { now }));
    const canceled = write(
      decideSync(
        active,
        paypal({
          status: "CANCELLED",
          status_update_time: "2026-10-10T09:00:00Z",
          billing_info: { last_payment: { time: "2026-10-03T11:00:00Z" } },
        }),
        { now: new Date("2026-10-10T09:00:01Z") },
      ),
    );
    expect(canceled.status).toBe("CANCELED");
    expect(canceled.canceledAt).toEqual(new Date("2026-10-10T09:00:00Z"));
    expect(canceled.currentPeriodEnd).toEqual(new Date("2026-11-03T11:00:00Z"));
    expect(hasPro(canceled, new Date("2026-11-03T10:59:00Z"))).toBe(true);
    expect(hasPro(canceled, new Date("2026-11-03T11:00:00Z"))).toBe(false);

    // Later events (EXPIRED, a resent CANCELLED) don't change the dates.
    const expired = write(decideSync(canceled, paypal({ status: "EXPIRED", billing_info: {} }), { now }));
    expect(expired.currentPeriodEnd).toEqual(canceled.currentPeriodEnd);
    expect(expired.canceledAt).toEqual(canceled.canceledAt);
  });

  it("falls back to the recorded period end if PayPal omits the last payment", () => {
    const active = write(decideSync(free, paypal(), { now }));
    const canceled = write(decideSync(active, paypal({ status: "CANCELLED", billing_info: {} }), { now }));
    // lastPaymentAt is kept from before, so the paid period still counts.
    expect(canceled.currentPeriodEnd).toEqual(new Date("2026-11-03T11:00:00Z"));
    const noHistory = write(decideSync(free, paypal({ status: "CANCELLED", billing_info: {} }), { now }));
    expect(noHistory.currentPeriodEnd).toBeNull();
    expect(hasPro(noHistory, now)).toBe(false);
  });

  it("ends Pro at once on a refund, and a later event doesn't bring it back", () => {
    const active = write(decideSync(free, paypal(), { now }));
    const refundTime = new Date("2026-10-05T08:00:00Z");
    const refunded = write(
      decideSync(active, paypal({ status: "CANCELLED", billing_info: { last_payment: { time: "2026-10-03T11:00:00Z" } } }), {
        refunded: true,
        now: refundTime,
      }),
    );
    expect(refunded.status).toBe("CANCELED");
    expect(refunded.currentPeriodEnd).toEqual(refundTime);
    expect(hasPro(refunded, refundTime)).toBe(false);

    const resent = write(
      decideSync(refunded, paypal({ status: "CANCELLED", billing_info: { last_payment: { time: "2026-10-03T11:00:00Z" } } }), {
        now: new Date("2026-10-06T00:00:00Z"),
      }),
    );
    expect(resent.currentPeriodEnd).toEqual(refundTime);
  });

  it("ignores events about an older subscription", () => {
    const current = write(decideSync(free, paypal(), { now }));
    const old = paypal({ id: "I-OLD000001", status: "EXPIRED" });
    expect(decideSync(current, old, { now })).toMatchObject({ kind: "ignore" });
  });

  it("lets a new subscription replace one that no longer gives Pro", () => {
    const ended = { ...write(decideSync(free, paypal(), { now })), status: "CANCELED" as const, currentPeriodEnd: new Date("2026-10-01T00:00:00Z") };
    const next = write(decideSync(ended, paypal({ id: "I-NEXT00001" }), { now }));
    expect(next.paypalSubscriptionId).toBe("I-NEXT00001");
    expect(next.canceledAt).toBeNull();

    const suspended = { ...ended, status: "SUSPENDED" as const, currentPeriodEnd: new Date("2026-11-01T00:00:00Z") };
    expect(write(decideSync(suspended, paypal({ id: "I-NEXT00001" }), { now })).status).toBe("ACTIVE");
  });

  it("flags a second active subscription while the first still gives Pro", () => {
    const current = write(decideSync(free, paypal(), { now }));
    expect(decideSync(current, paypal({ id: "I-SECOND001" }), { now })).toEqual({ kind: "duplicate" });
  });
});
