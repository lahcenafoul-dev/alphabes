import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EmailNotConfiguredError, sendEmail } from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

// Contact form: the message is emailed to the owner (CONTACT_TO_EMAIL, a
// secret) with the parent's address as reply-to, through Resend
// (lib/email/send.ts). Refund requests arrive this way (the refund policy
// points here). Message contents are never written to the logs.
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields correctly.", code: "invalid_contact" }, { status: 400 });
  }
  const { name, email, message } = parsed.data;
  const to = process.env.CONTACT_TO_EMAIL;

  try {
    if (!to) throw new EmailNotConfiguredError();
    await sendEmail({
      to,
      subject: `AlphaBes contact: ${name.replace(/[\r\n]+/g, " ")}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      replyTo: email,
    });
  } catch (err) {
    if (err instanceof EmailNotConfiguredError && process.env.NODE_ENV === "development") {
      // Local development without email settings: accept, but say so.
      console.warn("Contact form: email is not configured, message not sent.");
      return NextResponse.json({ ok: true });
    }
    console.error("Contact form: sending failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Your message couldn't be sent. Please try again later.", code: "contact_failed" },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
