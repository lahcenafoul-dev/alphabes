import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail, textToHtml, EmailNotConfiguredError } from "@/lib/email/send";
import { formatDate, renewalReminderEmail } from "@/lib/email/templates";
import { REMINDER_WINDOW_MS, reminderDue } from "@/lib/billing/reminders";

const day = 86_400_000;
const now = new Date("2026-10-04T08:00:00Z");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("sendEmail (Resend)", () => {
  it("refuses to run without settings", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");
    await expect(sendEmail({ to: "a@example.com", subject: "s", text: "t" })).rejects.toBeInstanceOf(EmailNotConfiguredError);
  });

  it("posts to Resend with the idempotency key and never puts the key in errors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_secret");
    vi.stubEnv("EMAIL_FROM", "AlphaBes <hello@alphabes.com>");
    const calls: { url: string; init: RequestInit }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init: RequestInit) => {
        calls.push({ url, init });
        return new Response(JSON.stringify({ id: "x" }));
      }),
    );
    await sendEmail({ to: "p@example.com", subject: "Hi", text: "Line\n\nhttps://alphabes.com/x", replyTo: "o@example.com", idempotencyKey: "k1" });
    const { url, init } = calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const headers = init.headers as Record<string, string>;
    expect(headers["Idempotency-Key"]).toBe("k1");
    expect(JSON.parse(init.body as string)).toMatchObject({
      from: "AlphaBes <hello@alphabes.com>",
      to: ["p@example.com"],
      subject: "Hi",
      reply_to: "o@example.com",
      html: '<p>Line</p>\n<p><a href="https://alphabes.com/x">https://alphabes.com/x</a></p>',
    });

    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ name: "validation_error", message: "bad" }), { status: 422 })));
    const err = await sendEmail({ to: "p@example.com", subject: "Hi", text: "t" }).catch((e: Error) => e);
    expect((err as Error).message).toBe("Resend error 422 validation_error: bad");
    expect((err as Error).message).not.toContain("re_test_secret");
  });

  it("escapes HTML in the text", () => {
    expect(textToHtml("<b>&</b>")).toBe("<p>&lt;b&gt;&amp;&lt;/b&gt;</p>");
  });
});

describe("renewal reminder email", () => {
  const r = {
    name: "Ana",
    renewsOn: new Date("2026-10-11T08:00:00Z"),
    dashboardUrl: "https://alphabes.com/x/dashboard",
    refundsUrl: "https://alphabes.com/x/refunds",
  };

  it("is written in each language, with the date, the amount, cancel and refund links", () => {
    const expected = {
      en: ["October 11, 2026", "$59", "Hello Ana,"],
      fr: ["11 octobre 2026", "59 $ US", "Bonjour Ana,"],
      es: ["11 de octubre de 2026", "US$59", "Hola, Ana:"],
      pt: ["11 de outubro de 2026", "US$ 59", "Olá, Ana!"],
    } as const;
    for (const [locale, [date, amount, greeting]] of Object.entries(expected) as [keyof typeof expected, readonly string[]][]) {
      const { subject, text } = renewalReminderEmail(locale, r);
      expect(formatDate(locale, r.renewsOn), locale).toBe(date);
      expect(subject, locale).toContain(date);
      expect(text.startsWith(greeting), locale).toBe(true);
      for (const part of [amount, r.dashboardUrl, r.refundsUrl, "14"]) expect(text, `${locale}: ${part}`).toContain(part);
    }
  });

  it("greets without a name, and never lets a name break the subject", () => {
    expect(renewalReminderEmail("en", { ...r, name: null }).text.startsWith("Hello,")).toBe(true);
    expect(renewalReminderEmail("es", { ...r, name: " " }).text.startsWith("Hola:")).toBe(true);
    expect(renewalReminderEmail("en", { ...r, name: "A\r\nBcc: x" }).text.split("\n")[0]).toBe("Hello A Bcc: x,");
  });
});

describe("reminderDue", () => {
  const sub = (over: Partial<Parameters<typeof reminderDue>[0]> = {}) => ({
    plan: "PRO_ANNUAL" as const,
    status: "ACTIVE" as const,
    currentPeriodEnd: new Date(now.getTime() + 6 * day),
    renewalReminderFor: null as Date | null,
    ...over,
  });

  it("is due for an active yearly plan renewing within 7 days, once per renewal", () => {
    expect(reminderDue(sub(), now)).toBe(true);
    expect(reminderDue(sub({ currentPeriodEnd: new Date(now.getTime() + REMINDER_WINDOW_MS) }), now)).toBe(true);
    expect(reminderDue(sub({ currentPeriodEnd: new Date(now.getTime() + REMINDER_WINDOW_MS + 1) }), now)).toBe(false);
    expect(reminderDue(sub({ currentPeriodEnd: now }), now)).toBe(false);
    const end = sub().currentPeriodEnd!;
    expect(reminderDue(sub({ renewalReminderFor: new Date(end) }), now)).toBe(false);
    // Reminded for last year's renewal: this year's is due again.
    expect(reminderDue(sub({ renewalReminderFor: new Date(end.getTime() - 365 * day) }), now)).toBe(true);
  });

  it("is never due for monthly plans, canceled or suspended subscriptions", () => {
    expect(reminderDue(sub({ plan: "PRO_MONTHLY" }), now)).toBe(false);
    expect(reminderDue(sub({ status: "CANCELED" }), now)).toBe(false);
    expect(reminderDue(sub({ status: "SUSPENDED" }), now)).toBe(false);
    expect(reminderDue(sub({ currentPeriodEnd: null }), now)).toBe(false);
  });
});

describe("sendRenewalReminders", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("sends one email per due renewal, in the parent's language, and releases the claim on failure", async () => {
    const sent: { to: string; subject: string; idempotencyKey?: string }[] = [];
    vi.doMock("@/lib/email/send", () => ({
      sendEmail: async (e: { to: string; subject: string; idempotencyKey?: string }) => {
        if (e.to === "fails@example.com") throw new Error("Resend down");
        sent.push(e);
      },
    }));
    const { sendRenewalReminders } = await import("@/lib/billing/reminders");
    const end = new Date(now.getTime() + 6 * day);
    const rows = [
      { id: "s1", plan: "PRO_ANNUAL", status: "ACTIVE", currentPeriodEnd: end, renewalReminderFor: null, user: { email: "fr@example.com", name: "Léa", locale: "FR" } },
      { id: "s2", plan: "PRO_ANNUAL", status: "ACTIVE", currentPeriodEnd: end, renewalReminderFor: end, user: { email: "done@example.com", name: null, locale: "EN" } },
      { id: "s3", plan: "PRO_ANNUAL", status: "ACTIVE", currentPeriodEnd: end, renewalReminderFor: null, user: { email: "fails@example.com", name: null, locale: "PT" } },
    ];
    const state = new Map(rows.map((r) => [r.id, r.renewalReminderFor as Date | null]));
    const prisma = {
      subscription: {
        findMany: async () => rows,
        updateMany: async ({ where, data }: { where: { id: string; renewalReminderFor?: Date }; data: { renewalReminderFor: Date | null } }) => {
          const cur = state.get(where.id) ?? null;
          const isRelease = where.renewalReminderFor !== undefined;
          const ok = isRelease ? cur?.getTime() === where.renewalReminderFor!.getTime() : cur?.getTime() !== data.renewalReminderFor?.getTime();
          if (ok) state.set(where.id, data.renewalReminderFor);
          return { count: ok ? 1 : 0 };
        },
      },
    };
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    const run = await sendRenewalReminders(prisma as never, now);
    quiet.mockRestore();

    expect(run).toEqual({ due: 2, sent: 1, failed: 1 });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("fr@example.com");
    expect(sent[0].subject).toBe("Votre abonnement annuel AlphaBes Pro se renouvelle le 10 octobre 2026");
    expect(sent[0].idempotencyKey).toBe(`renewal-reminder-s1-${end.toISOString()}`);
    expect(state.get("s1")?.getTime()).toBe(end.getTime()); // recorded
    expect(state.get("s3")).toBeNull(); // released, retried on the next run
    vi.doUnmock("@/lib/email/send");
  });
});
