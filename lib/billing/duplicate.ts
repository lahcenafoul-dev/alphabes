import { paypalMode } from "@/lib/paypal/client";
import { recentPayments } from "@/lib/paypal/subscriptions";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { duplicateAlertEmail } from "@/lib/email/templates";

// Owner's decision 2026-10-05 (docs/paypal-plan.md, "Duplicate alert"):
// when the sync cancels a second subscription (two checkouts at once), email
// the owner (CONTACT_TO_EMAIL) the parent and the payment to refund. The
// return and the webhooks may each detect the same duplicate, so the email
// is sent once per subscription through Resend's idempotency key.

export type DuplicateAlertResult = "sent" | "skipped" | "failed";

export async function sendDuplicateAlert(d: {
  parentEmail: string;
  userId: string;
  duplicateSubscriptionId: string;
  keptSubscriptionId: string | null;
}): Promise<DuplicateAlertResult> {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to || !emailConfigured()) return "skipped";
  try {
    // Read-only; the alert still goes out without the payment id.
    const payment = await recentPayments(d.duplicateSubscriptionId)
      .then((p) => p.find((x) => x.status === "COMPLETED") ?? p[0] ?? null)
      .catch(() => null);
    const { subject, text } = duplicateAlertEmail({ ...d, sandbox: paypalMode() === "sandbox", payment });
    await sendEmail({ to, subject, text, idempotencyKey: `duplicate-alert-${d.duplicateSubscriptionId}` });
    return "sent";
  } catch (err) {
    console.error(`Duplicate alert for ${d.duplicateSubscriptionId} failed:`, err instanceof Error ? err.message : err);
    return "failed";
  }
}
