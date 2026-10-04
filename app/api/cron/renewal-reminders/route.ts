import { NextResponse } from "next/server";
import { sendRenewalReminders } from "@/lib/billing/reminders";
import { getPrisma } from "@/lib/prisma";

// Called once a day by the Cloudflare cron trigger (custom-worker.ts) with
// "Authorization: Bearer <CRON_SECRET>"; can also be called by hand with the
// same header. Sends the yearly renewal reminders (lib/billing/reminders.ts).

function sameSecret(given: string, expected: string): boolean {
  // Compares every character, so the time taken doesn't reveal the secret.
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < given.length; i++) diff |= given.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured.", code: "not_configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  if (!sameSecret(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Forbidden.", code: "forbidden" }, { status: 403 });
  }
  const run = await sendRenewalReminders(getPrisma());
  return NextResponse.json(run, { status: run.failed ? 500 : 200 });
}
