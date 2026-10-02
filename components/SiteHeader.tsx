import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { isAvailable, localizedPath } from "@/lib/i18n/routes";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

const NAV = [
  { href: "/alphabet", key: "alphabet" },
  { href: "/phonics", key: "phonics" },
  { href: "/worksheets", key: "worksheets" },
  { href: "/games", key: "games" },
  { href: "/stories", key: "stories" },
  { href: "/pricing", key: "pricing" },
] as const;

// Site-wide header: logo, main sections, parent account link, language switch.
// Below 390 px the spacing and logo shrink so it fits a 320 px phone.
// Static (no session lookup) so every page stays prerenderable; "My Account"
// leads to the dashboard, which sends signed-out visitors to the login page.
// Links are built from the locale prop rather than next-intl's <Link>, so the
// header never depends on the request locale (it also renders in
// app/global-not-found.tsx, outside [locale]).
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Header" });
  const items = NAV.filter((item) => isAvailable(locale, item.href));

  return (
    <header data-site-header className="relative border-b border-chalkboard/10 bg-paper print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4 max-[389px]:px-4 max-[389px]:gap-2">
        <Link href={localizedPath(locale, "/")} aria-label={t("homeLabel")} className="flex items-center gap-2 shrink-0">
          <span aria-hidden="true" className="letter-block h-9 w-9 text-xl">
            A
          </span>
          <span className="font-display text-2xl font-extrabold max-[389px]:text-xl">AlphaBes</span>
        </Link>

        <nav aria-label={t("mainNav")} className="hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-7 font-display font-bold">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={localizedPath(locale, item.href)} className="hover:text-crayon-blue transition-colors">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3 max-[389px]:gap-1.5">
          <Link
            href={localizedPath(locale, "/dashboard")}
            className="hidden sm:inline-block rounded-block bg-crayon-yellow px-4 py-2 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            {t("account")}
          </Link>
          <LanguageSwitcher />
          <MobileMenu
            items={items.map((item) => ({ href: localizedPath(locale, item.href), label: t(item.key) }))}
            account={{ href: localizedPath(locale, "/dashboard"), label: t("account") }}
            menuLabel={t("menu")}
            closeLabel={t("closeMenu")}
            navLabel={t("mainNav")}
          />
        </div>
      </div>
    </header>
  );
}
