import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Access } from "@/lib/billing/access";
import { localizedPath } from "@/lib/i18n/routes";

// Shown in place of Pro content (a premium game, the rest of a premium
// story, a whole-bundle download) to visitors without Pro.
export default async function Paywall({
  locale,
  kind,
  access,
  next,
}: {
  locale: Locale;
  kind: "game" | "story" | "bundle";
  access: Access;
  // Where to come back to after logging in (a path on this site).
  next: string;
}) {
  const t = await getTranslations({ locale, namespace: "Paywall" });
  return (
    <section
      aria-labelledby="paywall-heading"
      className="mt-8 rounded-block border-2 border-crayon-purple/40 bg-crayon-purple/5 p-6 text-center"
    >
      <h2 id="paywall-heading" className="font-display font-bold text-xl">
        <span aria-hidden="true">🔒 </span>
        {t("title")}
      </h2>
      <p className="mt-2 text-chalkboard/80 max-w-xl mx-auto">{access.suspended ? t("suspended") : t(kind)}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-4">
        <Link
          href="/pricing"
          className="rounded-block bg-crayon-yellow font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          {t("seePlans")}
        </Link>
        {!access.loggedIn && (
          <a
            href={`${localizedPath(locale, "/login")}?next=${encodeURIComponent(next)}`}
            className="rounded-block border border-chalkboard/20 font-display font-bold px-5 py-2.5 hover:border-chalkboard/40 transition"
          >
            {t("login")}
          </a>
        )}
      </div>
    </section>
  );
}
