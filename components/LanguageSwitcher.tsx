"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  counterpartPath,
  localizedPath,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

function homeHrefs(): Record<Locale, string> {
  return Object.fromEntries(routing.locales.map((l) => [l, localizedPath(l, "/")])) as Record<Locale, string>;
}

// EN / FR toggle. Each link goes to the same page in the other language when
// it exists there, otherwise to its section index (or home page) in that
// language. The exact target is computed from the browser URL after mount
// (the server render links to the home pages), so static pages never
// hydrate with a wrong href.
export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const [hrefs, setHrefs] = useState<Record<Locale, string>>(homeHrefs);

  useEffect(() => {
    const match = matchPath(window.location.pathname);
    const next = homeHrefs();
    if (match) {
      for (const l of routing.locales) {
        if (l === match.locale) continue;
        // No twin (é, a French sound…): the section index, e.g. /alphabet.
        const target = counterpartPath(match, l) ?? sectionFallbackPath(match, l);
        if (target) next[l] = target;
      }
    }
    setHrefs(next);
  }, [pathname]);

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm"
    >
      {routing.locales.map((l) =>
        l === locale ? (
          <span
            key={l}
            lang={l}
            title={t(l)}
            aria-current="true"
            className="rounded-full bg-chalkboard px-2.5 py-1 text-paper max-[359px]:px-2"
          >
            {l.toUpperCase()}
          </span>
        ) : (
          <a
            key={l}
            href={hrefs[l]}
            hrefLang={l}
            lang={l}
            title={t(l)}
            onClick={() => rememberLocale(l)}
            className="rounded-full px-2.5 py-1 text-chalkboard/70 hover:text-chalkboard max-[359px]:px-2"
          >
            {l.toUpperCase()}
          </a>
        ),
      )}
    </div>
  );
}
