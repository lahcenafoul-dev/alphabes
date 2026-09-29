import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/pricing"),
  };
}

export default async function PricingPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Pricing" });

  const plans = [
    { key: "free", priceId: null },
    { key: "monthly", priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null },
    { key: "annual", priceId: process.env.STRIPE_PRICE_PRO_ANNUAL ?? null },
  ].map(({ key, priceId }) => {
    const k = key as "free" | "monthly" | "annual";
    return {
      name: t(`${k}.name`),
      price: t(`${k}.price`),
      period: t(`${k}.period`),
      priceId,
      features: t.raw(`${k}.features`) as string[],
    };
  });

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold text-center">{t("heading")}</h1>
      <p className="mt-2 text-center text-chalkboard/70">{t("subtitle")}</p>
      <p className="mt-4 max-w-2xl mx-auto text-center text-chalkboard/70">{t("intro")}</p>

      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-block border border-chalkboard/10 p-6 shadow-block flex flex-col"
          >
            <h2 className="font-display font-bold text-xl">{plan.name}</h2>
            <p className="mt-2 text-3xl font-extrabold">
              {plan.price}
              <span className="text-base font-normal">{plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-chalkboard/70 flex-1">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            {plan.priceId ? (
              <form action="/api/stripe/checkout" method="POST" className="mt-6">
                <input type="hidden" name="priceId" value={plan.priceId} />
                <button
                  type="submit"
                  className="w-full rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
                >
                  {t("choose", { plan: plan.name })}
                </button>
              </form>
            ) : (
              <Link
                href="/register"
                className="mt-6 block text-center rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
              >
                {t("startFree")}
              </Link>
            )}
          </div>
        ))}
      </div>

      {t("currencyNote") && (
        <p className="mt-6 text-center text-sm text-chalkboard/60">{t("currencyNote")}</p>
      )}
    </main>
  );
}
