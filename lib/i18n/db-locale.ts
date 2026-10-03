// The site language ("fr") as stored in the database (Prisma's Locale enum,
// "FR"), and back. Pure, so middleware, pages, API routes and tests share it.
import type { Locale as DbLocale } from "@prisma/client";
import type { Locale } from "@/i18n/routing";

export const DB_LOCALE = { en: "EN", fr: "FR", es: "ES", pt: "PT" } as const satisfies Record<Locale, DbLocale>;

export function toDbLocale(locale: Locale): DbLocale {
  return DB_LOCALE[locale];
}

export function fromDbLocale(value: DbLocale): Locale {
  return value === "FR" ? "fr" : value === "ES" ? "es" : value === "PT" ? "pt" : "en";
}
