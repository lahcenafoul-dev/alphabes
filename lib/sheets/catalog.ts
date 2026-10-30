// The registry of the new worksheet types (lib/sheets/types.ts): their
// listing pages and sheets, looked up by language and slug, and where each
// sheet's PDF and preview live. The pages under /worksheets/[category], the
// middleware (lib/i18n/known-params.ts), hreflang (lib/i18n/routes.ts), the
// sitemap and the PDF script (scripts/sheets/generate.ts) all read it.
import { missingNumbersKind, missingNumbersSheets } from "@/data/worksheets/missing-numbers";
import { patternsKind, patternsSheets } from "@/data/worksheets/patterns";
import { stickersKind, stickersSheets } from "@/data/worksheets/stickers";
import { SHEET_LOCALES, type Sheet, type SheetKind, type SheetKindId, type SheetLocale } from "./types";

export type { Sheet, SheetKind, SheetKindId, SheetLocale } from "./types";

/** In the order they're linked: each type links to its neighbours. */
export const SHEET_KINDS: SheetKind[] = [missingNumbersKind, patternsKind, stickersKind];

export const SHEETS: Sheet[] = [...missingNumbersSheets, ...patternsSheets, ...stickersSheets];

// Each language's existing worksheet folders (scripts/fiches-fr, fichas-es,
// atividades-pt, worksheets-en): the PDFs go in a folder named after the
// type, the previews next to the other previews.
const PDF_ROOT: Record<SheetLocale, string> = {
  en: "/worksheets-pdf",
  fr: "/fiches-pdf",
  es: "/fichas-pdf",
  pt: "/atividades-pdf",
};
const PREVIEW_DIR: Record<SheetLocale, string> = {
  en: "/worksheets-pdf/previews",
  fr: "/fiches-pdf/apercus",
  es: "/fichas-pdf/vistas-previas",
  pt: "/atividades-pdf/previas",
};

/** English sheets print on US Letter, the others on A4, like the rest of the site. */
export const SHEET_PAGE: Record<SheetLocale, "letter" | "a4"> = { en: "letter", fr: "a4", es: "a4", pt: "a4" };

/** The preview's size in pixels (476 px wide, the page's proportions). */
export const PREVIEW_SIZE: Record<"letter" | "a4", { width: number; height: number }> = {
  letter: { width: 476, height: 616 },
  a4: { width: 476, height: 673 },
};

const kindById = new Map(SHEET_KINDS.map((k) => [k.id, k]));
const bySlug: Record<SheetLocale, Map<string, Sheet>> = Object.fromEntries(
  SHEET_LOCALES.map((l) => [l, new Map(SHEETS.map((s) => [s.slug[l], s]))]),
) as Record<SheetLocale, Map<string, Sheet>>;
const kindBySlug: Record<SheetLocale, Map<string, SheetKind>> = Object.fromEntries(
  SHEET_LOCALES.map((l) => [l, new Map(SHEET_KINDS.map((k) => [k.slug[l], k]))]),
) as Record<SheetLocale, Map<string, SheetKind>>;

export function getSheetKind(id: SheetKindId): SheetKind {
  return kindById.get(id)!;
}

export function getSheetKindBySlug(locale: SheetLocale, slug: string): SheetKind | undefined {
  return kindBySlug[locale].get(slug);
}

export function getSheet(locale: SheetLocale, slug: string): Sheet | undefined {
  return bySlug[locale].get(slug);
}

export function sheetsOfKind(id: SheetKindId): Sheet[] {
  return SHEETS.filter((s) => s.kind === id);
}

/** "/fiches-pdf/nombres-manquants/nombres-manquants-1-10-grille-pommes-facile.pdf". */
export function sheetPdf(locale: SheetLocale, sheet: Sheet): string {
  return `${PDF_ROOT[locale]}/${getSheetKind(sheet.kind).slug[locale]}/${sheet.slug[locale]}.pdf`;
}

export function sheetPreview(locale: SheetLocale, sheet: Sheet): string {
  return `${PREVIEW_DIR[locale]}/${sheet.slug[locale]}.jpg`;
}

/** Every /worksheets/[category] param of these types in a language: listing pages, then sheets. */
export function sheetCategoryParams(locale: SheetLocale): string[] {
  return [...SHEET_KINDS.map((k) => k.slug[locale]), ...SHEETS.map((s) => s.slug[locale])];
}

/** Each page's slug in every language, for hreflang and the language switcher. */
export function sheetParamGroups(): Record<SheetLocale, string>[] {
  return [...SHEET_KINDS.map((k) => k.slug), ...SHEETS.map((s) => s.slug)];
}

/** Previous and next sheet of the same type (no wrap-around). */
export function sheetNeighbours(sheet: Sheet): { prev?: Sheet; next?: Sheet } {
  const list = sheetsOfKind(sheet.kind);
  const i = list.indexOf(sheet);
  return { prev: list[i - 1], next: list[i + 1] };
}

/** Sheets of the same type that share the most filters with this one. */
export function relatedSheets(sheet: Sheet, count = 6): Sheet[] {
  const keys = Object.keys(sheet.filters);
  return sheetsOfKind(sheet.kind)
    .filter((s) => s !== sheet)
    .map((s) => ({ s, score: keys.filter((k) => s.filters[k] === sheet.filters[k]).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ s }) => s);
}
