import type { PrismaClient, Subscription } from "@prisma/client";
import { fromDbLocale } from "@/lib/i18n/db-locale";
import { absoluteUrl } from "@/lib/i18n/routes";
import { sendEmail } from "@/lib/email/send";
import { renewalReminderEmail } from "@/lib/email/templates";

// Yearly renewal reminders (owner's decision, docs/paypal-plan.md phase 6b):
// about 7 days before a yearly plan renews, one email in the parent's
// language with the date, the amount, how to cancel, and that the renewal
// isn't refunded (the 14-day refund covers only a first payment).
// Run once a day by the Cloudflare cron (custom-worker.ts →
// /api/cron/renewal-reminders). A run that is late or missed is caught up by
// the next one, because every renewal in the coming 7 days that hasn't had
// its reminder yet is due.

export const REMINDER_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type ReminderState = Pick<Subscription, "plan" | "status" | "currentPeriodEnd" | "renewalReminderFor">;

export function reminderDue(sub: ReminderState, now: Date): boolean {
  const end = sub.currentPeriodEnd?.getTime();
  if (sub.plan !== "PRO_ANNUAL" || sub.status !== "ACTIVE" || end === undefined) return false;
  if (end <= now.getTime() || end - now.getTime() > REMINDER_WINDOW_MS) return false;
  return sub.renewalReminderFor?.getTime() !== end;
}

export type ReminderRun = { due: number; sent: number; failed: number };

export async function sendRenewalReminders(prisma: PrismaClient, now: Date = new Date()): Promise<ReminderRun> {
  const candidates = await prisma.subscription.findMany({
    where: {
      plan: "PRO_ANNUAL",
      status: "ACTIVE",
      currentPeriodEnd: { gt: now, lte: new Date(now.getTime() + REMINDER_WINDOW_MS) },
    },
    include: { user: { select: { email: true, name: true, locale: true } } },
  });
  const due = candidates.filter((s) => reminderDue(s, now));
  let sent = 0;
  let failed = 0;

  for (const sub of due) {
    const end = sub.currentPeriodEnd!;
    // Claim this renewal first, so two runs at once can't both send it.
    const claimed = await prisma.subscription.updateMany({
      where: { id: sub.id, OR: [{ renewalReminderFor: null }, { renewalReminderFor: { not: end } }] },
      data: { renewalReminderFor: end },
    });
    if (claimed.count === 0) continue;

    const locale = fromDbLocale(sub.user.locale);
    const { subject, text } = renewalReminderEmail(locale, {
      name: sub.user.name,
      renewsOn: end,
      dashboardUrl: absoluteUrl(locale, "/dashboard"),
      refundsUrl: absoluteUrl(locale, "/refunds"),
    });
    try {
      await sendEmail({
        to: sub.user.email,
        subject,
        text,
        replyTo: process.env.CONTACT_TO_EMAIL || undefined,
        idempotencyKey: `renewal-reminder-${sub.id}-${end.toISOString()}`,
      });
      sent++;
    } catch (err) {
      failed++;
      console.error(`Renewal reminder for subscription ${sub.id} failed:`, err instanceof Error ? err.message : err);
      // Not sent: release the claim so the next run tries again.
      await prisma.subscription.updateMany({
        where: { id: sub.id, renewalReminderFor: end },
        data: { renewalReminderFor: sub.renewalReminderFor },
      });
    }
  }
  return { due: due.length, sent, failed };
}
