// The printable worksheet types added in 2026-10 (missing numbers, patterns,
// sticker sheets…): one catalogue per type in data/worksheets/, one layout
// script per type in scripts/sheets/. Every sheet exists in the four
// languages, with its own slug, title and instruction in each.
//
// Pure data, no imports: the middleware, the pages, the sitemap and the PDF
// scripts all read it.

export type SheetLocale = "en" | "fr" | "es" | "pt";
export const SHEET_LOCALES: readonly SheetLocale[] = ["en", "fr", "es", "pt"];

/** A text in each language. */
export type L10n<T = string> = Record<SheetLocale, T>;

export type SheetKindId = "missing-numbers" | "patterns" | "stickers" | "dot-to-dot" | "colouring" | "how-to-draw" | "body-parts" | "flash-cards" | "telling-time" | "mazes";

export type SheetFilterOption = { value: string; label: L10n };

/** A filter on a type's listing page ("Numbers up to", "Layout"…). */
export type SheetFilter = { key: string; label: L10n; options: SheetFilterOption[] };

export type Sheet<P = unknown> = {
  kind: SheetKindId;
  /** Stable internal id ("grid-1-10-apple-easy"), the seed of the sheet's random blanks. */
  id: string;
  slug: L10n;
  /** The H1, the PDF title and the start of the SEO title; unique across all sheets. */
  title: L10n;
  /** Short name for cards and breadcrumbs. */
  label: L10n;
  /** Meta description. */
  description: L10n;
  /** The instruction printed on the sheet. */
  instruction: L10n;
  /** Filter key → option value, as listed in the type's filters. */
  filters: Record<string, string>;
  /** Pages in the PDF, when more than one (card sets, answer keys). */
  pages?: number;
  /** What the layout script draws. */
  params: P;
};

export type SheetKind = {
  id: SheetKindId;
  /** The listing page's slug, also the PDF folder name. */
  slug: L10n;
  /** "Missing Numbers". */
  name: L10n;
  /** The listing page's H1. */
  heading: L10n;
  /** Meta title of the listing page. */
  metaTitle: L10n;
  /** Card blurb and meta description. */
  description: L10n;
  /** Paragraph at the top of the listing page. */
  intro: L10n;
  /** Tips for parents and teachers on each sheet page. */
  howTo: L10n;
  level: L10n;
  skills: L10n<string[]>;
  filters: SheetFilter[];
};

/** "Pommes" → "pommes", "maçãs grandes" → "macas-grandes". */
export function slugify(s: string): string {
  return s
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "Oe")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** A small seeded random generator (mulberry32), so every run draws the same blanks. */
export function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `count` distinct items of `list`, in a seeded random order. */
export function pick<T>(list: readonly T[], count: number, rand: () => number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
