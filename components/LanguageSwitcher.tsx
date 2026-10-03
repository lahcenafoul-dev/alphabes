"use client";

import { useEffect, useRef, useState } from "react";
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

// EN / FR / ES / PT switch. Each link goes to the same page in the other
// language when it exists there, otherwise to its section index (or home
// page) in that language. The exact target is computed from the browser URL
// after mount (the server render links to the home pages), so static pages
// never hydrate with a wrong href.
//
// From 640 px the languages are pills in the header. Four pills don't fit a
// phone header (docs/portuguese-plan.md, P12), so below 640 px one button
// shows the current language and opens the list.
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const [hrefs, setHrefs] = useState<Record<Locale, string>>(homeHrefs);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    setOpen(false);
  }, [pathname]);

  // Close the phone list on a tap outside it or on Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div ref={menuRef} className="relative sm:hidden">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="language-menu"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 items-center gap-1 rounded-full border-2 border-chalkboard/15 px-3 font-display font-bold text-sm"
        >
          <span className="sr-only">{t("label")}: </span>
          <span lang={locale}>{locale.toUpperCase()}</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
        {open && (
          <ul
            id="language-menu"
            aria-label={t("label")}
            className="absolute right-0 top-full z-50 mt-2 w-44 rounded-block border border-chalkboard/10 bg-paper p-1 font-display font-bold shadow-blockHover"
          >
            {routing.locales.map((l) => (
              <li key={l}>
                {l === locale ? (
                  <span
                    lang={l}
                    aria-current="true"
                    className="flex items-center gap-3 rounded-block bg-chalkboard px-3 py-2.5 text-paper"
                  >
                    <span className="w-6">{l.toUpperCase()}</span>
                    {t(l)}
                  </span>
                ) : (
                  <a
                    href={hrefs[l]}
                    hrefLang={l}
                    lang={l}
                    onClick={() => rememberLocale(l)}
                    className="flex items-center gap-3 rounded-block px-3 py-2.5 hover:bg-crayon-blue/10"
                  >
                    <span className="w-6 text-chalkboard/60">{l.toUpperCase()}</span>
                    {t(l)}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        role="group"
        aria-label={t("label")}
        className="hidden items-center rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm sm:flex"
      >
        {routing.locales.map((l) =>
          l === locale ? (
            <span
              key={l}
              lang={l}
              title={t(l)}
              aria-current="true"
              className="rounded-full bg-chalkboard px-2.5 py-1 text-paper"
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
              className="rounded-full px-2.5 py-1 text-chalkboard/70 hover:text-chalkboard"
            >
              {l.toUpperCase()}
            </a>
          ),
        )}
      </div>
    </>
  );
}
