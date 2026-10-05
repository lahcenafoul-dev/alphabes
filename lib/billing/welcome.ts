import type { PrismaClient } from "@prisma/client";
import { fromDbLocale } from "@/lib/i18n/db-locale";
import { absoluteUrl } from "@/lib/i18n/routes";
import { emailConfigured, sendEmail } from "@/lib/email/send";
import { welcomeToProEmail } from "@/lib/email/templates";

// "Welcome to Pro" (owner's decision 2026-10-05, docs/paypal-plan.md): one
// email in the parent's language when a PayPal subscription becomes active,
// with links to the dashboard and the bundle downloads. Called by the sync
// after it stores an active subscription; the webhook and the return from
// PayPal may both get there, so the subscription is claimed in the database
// first (welcomeEmailFor), and released if sending fails, so a later sync
// tries again.

export type WelcomeResult = "sent" | "skipped" | "failed";

export async function sendWelcomeEmail(prisma: PrismaClient, userId: string): Promise<WelcomeResult> {
  if (!emailConfigured()) return "skipped";
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    include: { user: { select: { email: true, name: true, locale: true } } },
  });
  const id = sub?.paypalSubscriptionId;
  if (!sub || !id || sub.status !== "ACTIVE" || sub.plan === "FREE" || sub.welcomeEmailFor === id) return "skipped";

  const claimed = await prisma.subscription.updateMany({
    where: { userId, paypalSubscriptionId: id, welcomeEmailFor: sub.welcomeEmailFor },
    data: { welcomeEmailFor: id },
  });
  if (claimed.count === 0) return "skipped";

  const locale = fromDbLocale(sub.user.locale);
  const { subject, text } = welcomeToProEmail(locale, {
    name: sub.user.name,
    plan: sub.plan,
    renewsOn: sub.currentPeriodEnd,
    dashboardUrl: absoluteUrl(locale, "/dashboard"),
    downloadsUrl: absoluteUrl(locale, "/worksheets/bundles"),
  });
  try {
    await sendEmail({
      to: sub.user.email,
      subject,
      text,
      replyTo: process.env.CONTACT_TO_EMAIL || undefined,
      idempotencyKey: `welcome-${id}`,
    });
    return "sent";
  } catch (err) {
    console.error(`Welcome email for subscription ${id} failed:`, err instanceof Error ? err.message : err);
    await prisma.subscription.updateMany({
      where: { userId, welcomeEmailFor: id },
      data: { welcomeEmailFor: sub.welcomeEmailFor },
    });
    return "failed";
  }
}
