import type { Subscription } from "@prisma/client";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import ClientMessages from "@/components/ClientMessages";
import { hasPro } from "@/lib/billing/entitlement";
import { paypalAutopayUrl } from "@/lib/paypal/client";
import CancelSubscription from "./cancel-subscription";

// The parent's PayPal subscription: plan, renewal or end date, cancel
// button and a link to PayPal. Shown once the parent has had a PayPal
// subscription; before that, the dashboard's upsell is enough.
export default async function SubscriptionCard({ locale, sub }: { locale: Locale; sub: Subscription }) {
  const t = await getTranslations({ locale, namespace: "Billing" });
  const pro = hasPro(sub);
  const end = sub.currentPeriodEnd;
  const cancelable = sub.status === "ACTIVE" || sub.status === "SUSPENDED";

  let status: string | null = null;
  if (sub.status === "SUSPENDED") status = t("suspended");
  else if (sub.status === "ACTIVE" && pro) status = end ? t("renews", { date: end }) : t("activeNoDate");
  else if (pro && end) status = t("canceled", { date: end });
  else if (end) status = t("ended", { date: end });

  return (
    <section className="mt-10 rounded-block border border-chalkboard/10 p-6 shadow-block" aria-labelledby="billing-heading">
      <h2 id="billing-heading" className="font-display font-bold text-xl">
        {t("heading")}
      </h2>
      <p className="mt-2 font-bold">
        {pro ? (sub.plan === "PRO_ANNUAL" ? t("annual") : t("monthly")) : t("free")}
      </p>
      {status && <p className="mt-1 text-chalkboard/80">{status}</p>}
      {cancelable && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <ClientMessages locale={locale} namespaces={["Billing", "Errors"]}>
              <CancelSubscription periodEnd={sub.status === "ACTIVE" && end ? end.toISOString() : null} />
            </ClientMessages>
            <a
              href={paypalAutopayUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-crayon-blue underline"
            >
              {t("manage")}
            </a>
          </div>
          <p className="mt-3 text-sm text-chalkboard/60">{t("switchNote")}</p>
        </>
      )}
    </section>
  );
}
