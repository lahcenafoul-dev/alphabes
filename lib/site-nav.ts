// The main navigation, shared by the site header (components/SiteHeader.tsx)
// and the home page header (components/home/OwlHome.tsx): Alphabet ⌄,
// Numbers ⌄, Games, Worksheets ⌄, Stories, Parents, and Pricing on desktop. Every link goes to a page
// that exists in that language (tests/site-nav.test.ts).
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import { SHEET_KINDS } from "@/lib/sheets/catalog";

export type NavLink = { href: string; label: string };
export type NavItem = NavLink & { key: string; children?: NavLink[]; nofollow?: boolean; desktopOnly?: boolean };

type HeaderKey =
  | "alphabet" | "numbers" | "games" | "worksheets" | "stories" | "parents" | "pricing"
  | "allLetters" | "letterSounds" | "alphabetWorksheets" | "letterTracing" | "alphabetGames" | "flashcards"
  | "allNumbers" | "numberTracing" | "missingNumbers" | "dotToDot" | "numberStickers" | "numberFlashCards"
  | "allWorksheets" | "proPacks";

// The Header messages; the worksheet types' labels come from the catalog.
type Translate = (key: HeaderKey) => string;

const kindSlug = (en: string, locale: Locale) => SHEET_KINDS.find((k) => k.slug.en === en)!.slug[locale];

// Worksheet pages (/worksheets/[category]) for each menu entry, per language.
const LETTER_TRACING: Record<Locale, string> = { en: "tracing", fr: "trace-des-lettres", es: "trazo-de-letras", pt: "letra-bastao" };
export const NUMBER_TRACING: Record<Locale, string> = { en: "numbers", fr: "nombres", es: "numeros", pt: "numeros" };
export const NUMBER_STICKERS: Record<Locale, [string, string]> = {
  en: ["sticker-sheet-numbers-0-to-10", "sticker-sheet-numbers-11-to-20"],
  fr: ["gommettes-nombres-0-10", "gommettes-nombres-11-20"],
  es: ["stickers-numeros-0-10", "stickers-numeros-11-20"],
  pt: ["adesivos-numeros-0-10", "adesivos-numeros-11-20"],
};
// French and Portuguese have no number flash cards.
export const NUMBER_FLASH_CARDS: Partial<Record<Locale, [string, string]>> = {
  en: ["numbers-0-to-10-flash-cards", "numbers-11-to-20-flash-cards"],
  es: ["tarjetas-numeros-del-0-al-10", "tarjetas-numeros-del-11-al-20"],
};

export function sheetPath(locale: Locale, slug: string): string {
  return localizedPath(locale, "/worksheets/[category]", { category: slug });
}

export function alphabetLinks(locale: Locale, t: Translate): NavLink[] {
  const path = (p: Parameters<typeof localizedPath>[1]) => localizedPath(locale, p);
  return [
    { href: path("/alphabet"), label: t("allLetters") },
    { href: path("/phonics"), label: t("letterSounds") },
    // English has a letter worksheets page; the other hubs list theirs in a "letters" section.
    { href: locale === "en" ? sheetPath("en", "alphabet") : `${path("/worksheets")}#letters-heading`, label: t("alphabetWorksheets") },
    { href: sheetPath(locale, LETTER_TRACING[locale]), label: t("letterTracing") },
    { href: path("/games"), label: t("alphabetGames") },
    { href: path("/flashcards"), label: t("flashcards") },
  ];
}

export function numberLinks(locale: Locale, t: Translate): NavLink[] {
  const cards = NUMBER_FLASH_CARDS[locale];
  return [
    { href: localizedPath(locale, "/numbers"), label: t("allNumbers") },
    { href: sheetPath(locale, NUMBER_TRACING[locale]), label: t("numberTracing") },
    { href: sheetPath(locale, kindSlug("missing-numbers", locale)), label: t("missingNumbers") },
    { href: sheetPath(locale, kindSlug("dot-to-dot", locale)), label: t("dotToDot") },
    { href: sheetPath(locale, NUMBER_STICKERS[locale][0]), label: t("numberStickers") },
    ...(cards ? [{ href: sheetPath(locale, cards[0]), label: t("numberFlashCards") }] : []),
  ];
}

export function worksheetLinks(locale: Locale, t: Translate, { proPacks = true } = {}): NavLink[] {
  return [
    { href: localizedPath(locale, "/worksheets"), label: t("allWorksheets") },
    ...SHEET_KINDS.map((k) => ({ href: sheetPath(locale, k.slug[locale]), label: k.name[locale] })),
    ...(proPacks ? [{ href: localizedPath(locale, "/worksheets/bundles"), label: t("proPacks") }] : []),
  ];
}

/** The menu items in order; `children` are the dropdown links, the first being the section's own page. */
export function siteNav(locale: Locale, t: Translate, opts?: { proPacks?: boolean }): NavItem[] {
  const path = (p: Parameters<typeof localizedPath>[1]) => localizedPath(locale, p);
  return [
    { key: "alphabet", href: path("/alphabet"), label: t("alphabet"), children: alphabetLinks(locale, t) },
    { key: "numbers", href: path("/numbers"), label: t("numbers"), children: numberLinks(locale, t) },
    { key: "games", href: path("/games"), label: t("games") },
    { key: "worksheets", href: path("/worksheets"), label: t("worksheets"), children: worksheetLinks(locale, t, opts) },
    { key: "stories", href: path("/stories"), label: t("stories") },
    // Signed-out visitors are sent on to the login page, so crawlers needn't follow it.
    { key: "parents", href: path("/dashboard"), label: t("parents"), nofollow: true },
    // Not in the phone menu, which ends with the account or sign-up button.
    { key: "pricing", href: path("/pricing"), label: t("pricing"), desktopOnly: true },
  ];
}
