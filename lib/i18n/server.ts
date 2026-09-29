import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { isLocale } from "./routes";

// Call at the top of every localized page and layout: validates the
// [locale] segment and enables static rendering for next-intl.
export function initLocale(locale: string): Locale {
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export type LocaleParams = Promise<{ locale: string }>;
