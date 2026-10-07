import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { isAvailable, localizedPath } from "@/lib/i18n/routes";

const columns = [
  {
    title: "learn",
    links: [
      { href: "/alphabet", label: "alphabet" },
      { href: "/stories", label: "stories" },
      { href: "/phonics", label: "phonics" },
      { href: "/worksheets", label: "worksheets" },
      { href: "/games", label: "games" },
      { href: "/flashcards", label: "flashcards" },
      { href: "/activities", label: "activities" },
      { href: "/preschool", label: "preschool" },
      { href: "/kindergarten", label: "kindergarten" },
    ],
  },
  {
    title: "account",
    links: [
      { href: "/pricing", label: "pricing" },
      { href: "/login", label: "login" },
      { href: "/register", label: "register" },
      { href: "/dashboard", label: "dashboard" },
    ],
  },
  {
    title: "company",
    links: [
      { href: "/about", label: "about" },
      { href: "/blog", label: "blog" },
      { href: "/contact", label: "contact" },
    ],
  },
  {
    title: "legal",
    links: [
      { href: "/privacy-policy", label: "privacy" },
      { href: "/terms", label: "terms" },
      { href: "/refunds", label: "refunds" },
      { href: "/cookies", label: "cookies" },
    ],
  },
] as const;

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Footer" });

  return (
    <footer className="bg-chalkboard text-paper mt-16 print:hidden">
      <div className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns
          .map((col) => ({ ...col, links: col.links.filter((link) => isAvailable(locale, link.href)) }))
          // A language whose pages arrive phase by phase can have an empty column.
          .filter((col) => col.links.length > 0)
          .map((col) => (
            <div key={col.title}>
              {/* Not a heading: four footer titles on every page would sit in each page's outline. */}
              <p className="font-display font-bold text-sm uppercase tracking-wide text-paper/60">
                {t(col.title)}
              </p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizedPath(locale, link.href)}
                      // The dashboard redirects visitors who aren't signed in to the login page.
                      rel={link.href === "/dashboard" ? "nofollow" : undefined}
                      className="text-paper/80 hover:text-paper text-sm"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-paper/60">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
