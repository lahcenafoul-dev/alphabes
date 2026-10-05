import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { duplicateAlertEmail } from "@/lib/email/templates";

const base = {
  sandbox: false,
  parentEmail: "parent@example.com",
  userId: "u1",
  duplicateSubscriptionId: "I-DUP",
  keptSubscriptionId: "I-KEEP",
};

describe("duplicate alert email (to the owner)", () => {
  it("names the parent, the payment to refund and both subscriptions", () => {
    const e = duplicateAlertEmail({ ...base, payment: { id: "8AB12345CD678901E", amount: "7.99 USD", time: "2026-10-05T13:30:00Z" } });
    expect(e.subject).toBe("AlphaBes: refund a duplicate subscription payment (parent@example.com)");
    expect(e.text).toContain("Parent: parent@example.com (account u1)");
    expect(e.text).toContain("Payment to refund: 8AB12345CD678901E, 7.99 USD, 2026-10-05T13:30:00Z");
    expect(e.text).toContain("Duplicate subscription (canceled): I-DUP");
    expect(e.text).toContain("Subscription the parent keeps: I-KEEP");
    expect(e.text).toContain("PayPal → Activity");
  });

  it("marks sandbox, and points to the subscription when PayPal hasn't listed the payment", () => {
    const e = duplicateAlertEmail({ ...base, sandbox: true, payment: null, parentEmail: "a@b.c\r\nBcc: x" });
    expect(e.subject).toBe("[sandbox] AlphaBes: refund a duplicate subscription payment (a@b.c Bcc: x)");
    expect(e.text).toContain("not listed by PayPal yet; search PayPal Activity for subscription I-DUP");
    expect(e.text).toContain("PayPal sandbox → Activity");
  });
});

describe("sendDuplicateAlert", () => {
  const sent: { to: string; subject: string; idempotencyKey?: string; text: string }[] = [];
  const payments = vi.fn();
  beforeEach(() => {
    vi.resetModules();
    sent.length = 0;
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM", "AlphaBes <hello@alphabes.com>");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    vi.stubEnv("PAYPAL_MODE", "live");
    vi.doMock("@/lib/email/send", async (orig) => ({
      ...(await orig<typeof import("@/lib/email/send")>()),
      sendEmail: async (e: (typeof sent)[number]) => void sent.push(e),
    }));
    vi.doMock("@/lib/paypal/subscriptions", () => ({ recentPayments: (...a: unknown[]) => payments(...a) }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@/lib/email/send");
    vi.doUnmock("@/lib/paypal/subscriptions");
  });

  it("emails the owner once per duplicate subscription, with the completed payment", async () => {
    payments.mockResolvedValue([
      { id: "PENDING1", status: "PENDING", amount: "7.99 USD", time: "2026-10-05T13:31:00Z" },
      { id: "SALE1", status: "COMPLETED", amount: "7.99 USD", time: "2026-10-05T13:30:00Z" },
    ]);
    const { sendDuplicateAlert } = await import("@/lib/billing/duplicate");
    expect(await sendDuplicateAlert(base)).toBe("sent");
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("owner@example.com");
    expect(sent[0].idempotencyKey).toBe("duplicate-alert-I-DUP");
    expect(sent[0].subject.startsWith("AlphaBes:")).toBe(true); // live: no [sandbox]
    expect(sent[0].text).toContain("Payment to refund: SALE1");
  });

  it("still alerts when PayPal's payment list fails, and skips without settings", async () => {
    payments.mockRejectedValue(new Error("PayPal down"));
    const { sendDuplicateAlert } = await import("@/lib/billing/duplicate");
    expect(await sendDuplicateAlert(base)).toBe("sent");
    expect(sent[0].text).toContain("not listed by PayPal yet");

    vi.stubEnv("CONTACT_TO_EMAIL", "");
    expect(await sendDuplicateAlert(base)).toBe("skipped");
    expect(sent).toHaveLength(1);
  });
});
