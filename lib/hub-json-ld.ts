// The lists of pages that hub pages link to, for their CollectionPage/ItemList
// JSON-LD (lib/json-ld.ts, buildCollectionPageJsonLd). Each list follows
// what the hub really shows, in the hub's language.
import type { Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/i18n/routes";
import { numberGames } from "@/lib/number-games";
import { SHEET_KINDS } from "@/lib/sheets/catalog";

export type HubItem = { name: string; url: string };

const SLIDING_PUZZLES: Record<Locale, string> = {
  en: "Sliding Puzzles",
  fr: "Taquins",
  es: "Rompecabezas deslizantes",
  pt: "Quebra-cabeças deslizantes",
};

/** The games hub: the letter games, the number games, then the sliding puzzles. */
export function gamesHubItems(locale: Locale, letterGames: { title: string; slug: string }[]): HubItem[] {
  const game = (g: { title: string; slug: string }) => ({ name: g.title, url: absoluteUrl(locale, "/games/[slug]", { slug: g.slug }) });
  return [
    ...letterGames.map(game),
    ...numberGames(locale).map(game),
    { name: SLIDING_PUZZLES[locale], url: absoluteUrl(locale, "/games/sliding-puzzle") },
  ];
}

/** The worksheet types shared by the four languages (SheetTypesSection on every worksheets hub). */
export function sheetKindItems(locale: Locale): HubItem[] {
  return SHEET_KINDS.map((k) => ({
    name: k.name[locale],
    url: absoluteUrl(locale, "/worksheets/[category]", { category: k.slug[locale] }),
  }));
}
