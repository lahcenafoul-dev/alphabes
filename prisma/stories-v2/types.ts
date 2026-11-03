// Stories v2 (docs/stories-plan.md): 24 stories, 8 per level, each written
// natively in English, French, Spanish and Portuguese with the same plot and
// the same pages, so one set of pictures serves all four languages.
//
// French is for grande section / CP: short present-tense sentences. Spanish is
// neutral Latin American Spanish (no words that change by country, see
// tests/stories-v2.test.ts) with many direct syllables. Portuguese is Brazilian,
// with words from the famílias silábicas.
//
// `scenes` and `cover` are the English picture descriptions used to write the
// Canva prompts (scripts/stories/prompts.ts); character names in them pick the
// fixed character descriptions in scripts/stories/characters.ts.

export type Lang = "EN" | "FR" | "ES" | "PT";

/** 1: ages 3–4, 6 pages. 2: ages 4–6, 7 pages. 3: ages 6–8, 8 pages. */
export type Level = 1 | 2 | 3;

export type StoryText = {
  slug: string;
  title: string;
  /** Short SEO description. */
  description: string;
  /** One entry per page, same count as `scenes`. */
  pages: string[];
  /** "Talk about it" questions for parents, shown after the last page. */
  questions: string[];
};

export type StoryV2 = {
  /** Same as Story.translationGroup; also the image folder name. */
  group: string;
  level: Level;
  /** Added in stories v2 (the 8 older stories are rewritten, not new). */
  isNew: boolean;
  cover: string;
  scenes: string[];
  text: Record<Lang, StoryText>;
};

export const LEVEL_PAGES: Record<Level, number> = { 1: 6, 2: 7, 3: 8 };
export const LEVEL_AGES: Record<Level, [number, number]> = { 1: [3, 4], 2: [4, 6], 3: [6, 8] };

/** Alt text per language: [cover, page 1, page 2…], written from the scenes. */
export type StoryAlt = Record<Lang, string[]>;
