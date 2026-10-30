"use client";

import { routing, type Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { rememberLocale } from "@/components/LanguageSwitcher";

const NAMES: Record<Locale, string> = { en: "English", fr: "Français", es: "Español", pt: "Português" };

// The home page footer's language links: each language's home page. Like the
// header switcher, a click remembers the choice (NEXT_LOCALE), or the
// middleware would send the visitor back to the language they came from.
export default function LanguageLinks({ locale, label }: { locale: Locale; label: string }) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {routing.locales.map((l) => (
          <li key={l}>
            <a
              href={localizedPath(l, "/")}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? "page" : undefined}
              onClick={() => rememberLocale(l)}
              className={`text-owl-muted underline-offset-4 hover:text-owl-purple ${l === locale ? "underline" : ""}`}
            >
              {NAMES[l]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
