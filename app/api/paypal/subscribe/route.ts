import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { hasPro } from "@/lib/billing/entitlement";
import { isSameOrigin } from "@/lib/billing/same-origin";
import { isLocale, localizedPath } from "@/lib/i18n/routes";
import { paypalMode } from "@/lib/paypal/client";
import { isPlanChoice, paypalPlanId } from "@/lib/paypal/plans";
import { approveLink, cancelSubscription, createSubscription } from "@/lib/paypal/subscriptions";

// The pricing page's "Choose" buttons post here (plan=monthly|yearly and the
// page's locale). We create the subscription at PayPal and send the parent
// to PayPal's page to approve it. Nothing is stored yet: the subscription
// becomes Pro when PayPal reports it active (return to the dashboard, or
// the webhook), see lib/billing/sync.ts.
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const localeValue = form?.get("locale");
  const locale = isLocale(localeValue) ? localeValue : "en";
  const origin = req.nextUrl.origin;
  const to = (path: string) => NextResponse.redirect(new URL(path, origin), 303);
  const pricing = (billing: string) => to(`${localizedPath(locale, "/pricing")}?billing=${billing}`);

  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden.", code: "forbidden" }, { status: 403 });
  }

  const login = () => {
    const next = encodeURIComponent(localizedPath(locale, "/pricing"));
    return to(`${localizedPath(locale, "/login")}?next=${next}`);
  };
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return login();

  const choice = form?.get("plan");
  if (!isPlanChoice(choice)) return pricing("invalid_plan");

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } });
  // A session whose account no longer exists (deleted since it signed in):
  // treat it as logged out rather than as a PayPal error.
  if (!user) return login();

  // One subscription at a time: switching plans waits until the paid period
  // ends (docs/paypal-plan.md, B6).
  if (hasPro(user.subscription)) return to(`${localizedPath(locale, "/dashboard")}?billing=already_pro`);

  // While the site runs on PayPal's sandbox, only admins can check out (B7).
  // The daily test plan exists only in sandbox and only for admins.
  if ((paypalMode() === "sandbox" || choice === "test") && user.role !== "ADMIN") return pricing("soon");

  const planId = paypalPlanId(choice);
  if (!planId) {
    console.error(`PayPal: no plan configured for "${choice}" in ${paypalMode()} mode.`);
    return pricing("error");
  }

  try {
    // A suspended subscription (failed payments) would start charging again
    // if the parent fixed their payment method; stop it before a new one.
    const old = user.subscription;
    if (old?.paypalSubscriptionId && old.status === "SUSPENDED") {
      await cancelSubscription(old.paypalSubscriptionId, "Replaced by a new AlphaBes subscription");
    }

    const sub = await createSubscription({
      planId,
      userId: user.id,
      locale,
      returnUrl: `${origin}${localizedPath(locale, "/dashboard")}?billing=return`,
      cancelUrl: `${origin}${localizedPath(locale, "/pricing")}?billing=canceled`,
    });
    const approve = approveLink(sub);
    if (!approve) throw new Error("PayPal returned no approve link.");
    return NextResponse.redirect(approve, 303);
  } catch (err) {
    console.error("PayPal: could not start a subscription:", err instanceof Error ? err.message : err);
    return pricing("error");
  }
}
