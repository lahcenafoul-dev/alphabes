import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { isAvailable, localizedPath } from "@/lib/i18n/routes";
import { SHEET_KINDS } from "@/lib/sheets/catalog";
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
// The section links show inline from 1024 px (between 768 and 1023 px they
// didn't fit next to the switcher) and in the menu below that. Below 390 px
// the spacing and logo shrink so it fits a 320 px phone.
// Static (no session lookup) so every page stays prerenderable; "My Account"
// leads to the dashboard, which sends signed-out visitors to the login page.
// Links are built from the locale prop rather than next-intl's <Link>, so the
// header never depends on the request locale (it also renders in
// app/global-not-found.tsx, outside [locale]).
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Header" });
  const items = NAV.filter((item) => isAvailable(locale, item.href));
  // The "Worksheets" dropdown: the hub, then the worksheet types of lib/sheets/catalog.ts.
  const worksheetLinks = [
    { href: localizedPath(locale, "/worksheets"), label: t("allWorksheets") },
    ...SHEET_KINDS.map((k) => ({
      href: localizedPath(locale, "/worksheets/[category]", { category: k.slug[locale] }),
      label: k.name[locale],
    })),
  ];

  return (
    <header data-site-header className="relative border-b border-chalkboard/10 bg-paper print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4 max-[389px]:px-4 max-[389px]:gap-2">
        <Link href={localizedPath(locale, "/")} aria-label={t("homeLabel")} className="flex items-center gap-2 shrink-0">
          <span aria-hidden="true" className="letter-block h-9 w-9 text-xl">
            A
          </span>
          <span className="font-display text-2xl font-extrabold max-[389px]:text-xl">AlphaBes</span>
        </Link>

        <nav aria-label={t("mainNav")} className="hidden lg:block">
          <ul className="flex items-center gap-5 lg:gap-7 font-display font-bold">
            {items.map((item) =>
              item.key === "worksheets" ? (
                // Opens on hover and while any of its links has focus, so it
                // works from the keyboard without JavaScript.
                <li key={item.href} className="group relative">
                  <Link href={localizedPath(locale, item.href)} className="inline-flex items-center gap-1 hover:text-crayon-blue transition-colors">
                    {t(item.key)}
                    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                      <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-40 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="w-60 rounded-block border border-chalkboard/10 bg-paper p-2 shadow-block">
                      {worksheetLinks.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="block rounded-block px-3 py-2 hover:bg-crayon-blue/10 focus-visible:bg-crayon-blue/10">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={localizedPath(locale, item.href)} className="hover:text-crayon-blue transition-colors">
                    {t(item.key)}
                  </Link>
                </li>
              ),
            )}
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
            items={items.map((item) => ({
              href: localizedPath(locale, item.href),
              label: t(item.key),
              ...(item.key === "worksheets" && { children: worksheetLinks.slice(1) }),
            }))}
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
