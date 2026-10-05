import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail, textToHtml, EmailNotConfiguredError } from "@/lib/email/send";
import { formatDate, renewalReminderEmail, welcomeToProEmail } from "@/lib/email/templates";
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

  it("offers the 14-day refund of the renewal itself (yearly renewals are refundable)", () => {
    const promise = {
      en: "full refund of this renewal within 14 days of the payment",
      fr: "remboursement complet de ce renouvellement dans les 14 jours qui suivent le paiement",
      es: "reembolso completo de esta renovación dentro de los 14 días siguientes al pago",
      pt: "reembolso total desta renovação em até 14 dias depois do pagamento",
    } as const;
    for (const [locale, phrase] of Object.entries(promise) as [keyof typeof promise, string][]) {
      const { text } = renewalReminderEmail(locale, r);
      expect(text, locale).toContain(phrase);
      expect(text, locale).not.toMatch(/premier paiement|primer pago|primeiro pagamento|first payment/);
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

describe("welcome to Pro email", () => {
  const w = {
    name: "Ana",
    plan: "PRO_MONTHLY" as const,
    renewsOn: new Date("2026-11-05T00:00:00Z"),
    dashboardUrl: "https://alphabes.com/es/mi-cuenta",
    downloadsUrl: "https://alphabes.com/es/fichas/paquetes",
  };

  it("is written in each language, with the plan, the renewal date and both links", () => {
    const es = welcomeToProEmail("es", w);
    expect(es.subject).toBe("¡Te damos la bienvenida a AlphaBes Pro!");
    expect(es.text).toContain("Hola, Ana:");
    expect(es.text).toContain("plan mensual");
    expect(es.text).toContain("5 de noviembre de 2026");
    expect(es.text).toContain(w.dashboardUrl);
    expect(es.text).toContain(w.downloadsUrl);
    expect(welcomeToProEmail("fr", { ...w, plan: "PRO_ANNUAL" }).text).toContain("abonnement AlphaBes Pro annuel");
    expect(welcomeToProEmail("pt", w).subject).toBe("Boas-vindas ao AlphaBes Pro!");
    expect(welcomeToProEmail("en", { ...w, name: null, renewsOn: null }).text).not.toContain("next renewal");
  });
});

describe("sendWelcomeEmail", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("EMAIL_FROM", "AlphaBes <hello@alphabes.com>");
  });

  function fakePrisma(row: Record<string, unknown>) {
    const state = { ...row };
    return {
      state,
      subscription: {
        findUnique: async () => ({ ...state, user: { email: "es@example.com", name: null, locale: "ES" } }),
        updateMany: async ({ where, data }: { where: { welcomeEmailFor: string | null }; data: { welcomeEmailFor: string | null } }) => {
          const ok = state.welcomeEmailFor === where.welcomeEmailFor;
          if (ok) state.welcomeEmailFor = data.welcomeEmailFor;
          return { count: ok ? 1 : 0 };
        },
      },
    };
  }
  const active = { plan: "PRO_MONTHLY", status: "ACTIVE", paypalSubscriptionId: "I-NEW", currentPeriodEnd: now, welcomeEmailFor: null };

  it("sends once per subscription, in the parent's language", async () => {
    const sent: { subject: string; idempotencyKey?: string }[] = [];
    vi.doMock("@/lib/email/send", async (orig) => ({
      ...(await orig<typeof import("@/lib/email/send")>()),
      sendEmail: async (e: { subject: string; idempotencyKey?: string }) => void sent.push(e),
    }));
    const { sendWelcomeEmail } = await import("@/lib/billing/welcome");
    const prisma = fakePrisma(active);
    expect(await sendWelcomeEmail(prisma as never, "u1")).toBe("sent");
    expect(await sendWelcomeEmail(prisma as never, "u1")).toBe("skipped");
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe("¡Te damos la bienvenida a AlphaBes Pro!");
    expect(sent[0].idempotencyKey).toBe("welcome-I-NEW");
    expect(prisma.state.welcomeEmailFor).toBe("I-NEW");

    // A later, new subscription gets its own welcome.
    prisma.state.paypalSubscriptionId = "I-NEXT";
    expect(await sendWelcomeEmail(prisma as never, "u1")).toBe("sent");
    expect(sent).toHaveLength(2);
    vi.doUnmock("@/lib/email/send");
  });

  it("skips inactive subscriptions and missing settings, and releases the claim when sending fails", async () => {
    vi.doMock("@/lib/email/send", async (orig) => ({
      ...(await orig<typeof import("@/lib/email/send")>()),
      sendEmail: async () => {
        throw new Error("Resend down");
      },
    }));
    const { sendWelcomeEmail } = await import("@/lib/billing/welcome");
    expect(await sendWelcomeEmail(fakePrisma({ ...active, status: "SUSPENDED" }) as never, "u1")).toBe("skipped");

    const prisma = fakePrisma({ ...active, welcomeEmailFor: "I-OLD" });
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await sendWelcomeEmail(prisma as never, "u1")).toBe("failed");
    quiet.mockRestore();
    expect(prisma.state.welcomeEmailFor).toBe("I-OLD"); // released, retried by the next sync

    vi.stubEnv("RESEND_API_KEY", "");
    expect(await sendWelcomeEmail(fakePrisma(active) as never, "u1")).toBe("skipped");
    vi.doUnmock("@/lib/email/send");
  });
});
