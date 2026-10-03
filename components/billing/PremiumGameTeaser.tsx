import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

// Stands in for a premium game on its static, indexable page. The game itself
// is on the play page, which checks Pro on the server for every request
// (app/[locale]/games/[slug]/play).
export default async function PremiumGameTeaser({ locale, slug }: { locale: Locale; slug: string }) {
  const t = await getTranslations({ locale, namespace: "Paywall" });
  return (
    <section
      aria-labelledby="pro-game-heading"
      className="mt-8 rounded-block border-2 border-crayon-purple/40 bg-crayon-purple/5 p-6 text-center"
    >
      <h2 id="pro-game-heading" className="font-display font-bold text-xl">
        <span className="mr-2 inline-block rounded-full bg-crayon-purple/20 px-3 py-1 text-xs font-bold text-crayon-purple align-middle">
          Pro
        </span>
        {t("title")}
      </h2>
      <p className="mt-2 text-chalkboard/80 max-w-xl mx-auto">{t("game")}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-4">
        <Link
          href={{ pathname: "/games/[slug]/play", params: { slug } }}
          className="rounded-block bg-crayon-purple text-white font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
        >
          ▶ {t("play")}
        </Link>
        <Link
          href="/pricing"
          className="rounded-block border border-chalkboard/20 font-display font-bold px-5 py-3 hover:border-chalkboard/40 transition"
        >
          {t("seePlans")}
        </Link>
      </div>
    </section>
  );
}
