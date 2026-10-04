// Sends email through Resend's HTTP API (works on Cloudflare Workers with
// fetch). Settings, read per call (Workers runtime secrets):
//   RESEND_API_KEY  secret, never logged
//   EMAIL_FROM      e.g. "AlphaBes <hello@alphabes.com>" (a verified domain)
// See docs/paypal-plan.md (phase 6b).

export type Email = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  // Resend sends an email only once per key (for 24 hours), so a retried
  // job never sends the same reminder twice.
  idempotencyKey?: string;
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY / EMAIL_FROM are not configured.");
    this.name = "EmailNotConfiguredError";
  }
}

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A plain HTML version of the text: paragraphs, line breaks, links.
export function textToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/https?:\/\/\S+/g, (u) => `<a href="${u}">${u}</a>`).replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

export async function sendEmail(email: Email): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) throw new EmailNotConfiguredError();

  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
  if (email.idempotencyKey) headers["Idempotency-Key"] = email.idempotencyKey;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.text,
      html: textToHtml(email.text),
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { name?: string; message?: string } | null;
    throw new Error(`Resend error ${res.status}${data?.name ? ` ${data.name}` : ""}${data?.message ? `: ${data.message}` : ""}`);
  }
}
