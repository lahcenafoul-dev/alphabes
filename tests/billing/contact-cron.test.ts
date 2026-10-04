import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The contact route and the cron route, with email sending and the reminder
// job faked.
const sent: { to: string; subject: string; text: string; replyTo?: string }[] = [];
let failSend = false;
vi.mock("@/lib/email/send", async (orig) => {
  const real = await orig<typeof import("@/lib/email/send")>();
  return {
    ...real,
    sendEmail: async (e: (typeof sent)[number]) => {
      if (!process.env.RESEND_API_KEY) throw new real.EmailNotConfiguredError();
      if (failSend) throw new Error("Resend down");
      sent.push(e);
    },
  };
});
const runs: number[] = [];
vi.mock("@/lib/billing/reminders", () => ({
  sendRenewalReminders: async () => {
    runs.push(1);
    return { due: 2, sent: 2, failed: 0 };
  },
}));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({}) }));

const { POST: contact } = await import("@/app/api/contact/route");
const { POST: cron } = await import("@/app/api/cron/renewal-reminders/route");

const postContact = (body: unknown) =>
  contact(new Request("https://alphabes.com/api/contact", { method: "POST", body: JSON.stringify(body) }) as never);
const good = { name: "Ana\r\nBcc: x", email: "ana@example.com", message: "Refund please" };

beforeEach(() => {
  sent.length = 0;
  runs.length = 0;
  failSend = false;
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("EMAIL_FROM", "AlphaBes <hello@alphabes.com>");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/contact", () => {
  it("emails the message to the owner with the parent as reply-to, and logs no content", async () => {
    const log = vi.spyOn(console, "log");
    const res = await postContact(good);
    expect(res.status).toBe(200);
    expect(sent).toEqual([
      { to: "owner@example.com", subject: "AlphaBes contact: Ana Bcc: x", text: "From: Ana\r\nBcc: x <ana@example.com>\n\nRefund please", replyTo: "ana@example.com" },
    ]);
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it("rejects invalid input", async () => {
    expect((await postContact({ name: "", email: "x", message: "" })).status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it("tells the visitor when the message couldn't be sent", async () => {
    failSend = true;
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await postContact(good);
    expect(res.status).toBe(502);
    expect(await res.json()).toMatchObject({ code: "contact_failed" });
    quiet.mockRestore();
  });

  it("fails clearly in production without email settings, accepts in development", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    expect((await postContact(good)).status).toBe(502);
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect((await postContact(good)).status).toBe(200);
    quiet.mockRestore();
    warn.mockRestore();
  });
});

describe("POST /api/cron/renewal-reminders", () => {
  const call = (auth?: string) =>
    cron(new Request("https://alphabes.com/api/cron/renewal-reminders", { method: "POST", headers: auth ? { authorization: auth } : {} }));

  it("needs the secret", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer x")).status).toBe(503);
    vi.stubEnv("CRON_SECRET", "s3cret-value");
    expect((await call()).status).toBe(403);
    expect((await call("Bearer wrong-value")).status).toBe(403);
    expect((await call("Bearer s3cret-valu")).status).toBe(403);
    expect(runs).toHaveLength(0);
  });

  it("runs the reminders with the right secret", async () => {
    vi.stubEnv("CRON_SECRET", "s3cret-value");
    const res = await call("Bearer s3cret-value");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ due: 2, sent: 2, failed: 0 });
    expect(runs).toHaveLength(1);
  });
});
