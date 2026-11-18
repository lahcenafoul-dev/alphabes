// The stories as the pages show them, built from prisma/stories-v2 (through
// prisma/stories-data.ts, which the seed also writes to the database): the
// texts, pictures, level, "new" badge, SEO description, questions, alt text
// and the "For parents" section. The story pages and lists are built from
// here at build time, so they are static and cached like every other page;
// the database only keeps children's progress (StoryProgress), and the seed
// keeps its Story rows in step with these files. Server only: pages pass the
// bits they need to client components as props.
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { DB_LOCALE, fromDbLocale } from "@/lib/i18n/db-locale";
import type { RouteParams } from "@/lib/i18n/routes";
import { allStories, type SeedStory } from "@/prisma/stories-data";
import { STORY_ALT, storyByGroup, type Level } from "@/prisma/stories-v2";
import { STORY_PUBLISHED } from "@/prisma/stories-v2/dates";
import { STORY_PARENTS } from "@/prisma/stories-v2/parents";

export type StoryExtras = {
  level: Level;
  isNew: boolean;
  description: string;
  questions: string[];
  /** [cover, page 1, page 2…] */
  alt: string[];
  /** "For parents": what the story teaches. */
  teaches: string;
  /** "For parents": words to practise. */
  words: string[];
};

export function storyExtras(group: string | null, locale: Locale): StoryExtras | null {
  const story = storyByGroup(group);
  if (!story) return null;
  const lang = DB_LOCALE[locale];
  const t = story.text[lang];
  const parents = STORY_PARENTS[story.group]?.[lang];
  return {
    level: story.level,
    isNew: story.isNew,
    description: t.description,
    questions: t.questions,
    alt: STORY_ALT[story.group]?.[lang] ?? [],
    teaches: parents?.teaches ?? "",
    words: parents?.words ?? [],
  };
}

/** When the story texts last changed (the "For parents" sections, SEO phase 3). */
export const STORIES_UPDATED = "2026-11-18T00:00:00.000Z";

export type StoryPageData = { id: string; pageNumber: number; text: string; imageUrl: string };

export type StoryData = {
  slug: string;
  title: string;
  locale: Locale;
  translationGroup: string;
  coverUrl: string;
  ageRangeMin: number;
  ageRangeMax: number;
  /** No story is Pro-only (docs/paypal-plan.md, B4: the owner flagged none). */
  isPremium: false;
  createdAt: Date;
  updatedAt: Date;
  pages: StoryPageData[];
};

function toStoryData(s: SeedStory): StoryData {
  return {
    slug: s.slug,
    title: s.title,
    locale: fromDbLocale(s.locale),
    translationGroup: s.translationGroup,
    // Every picture exists (tests/stories-data.test.ts), so no drawn fallback.
    coverUrl: s.cover,
    ageRangeMin: s.ageRangeMin,
    ageRangeMax: s.ageRangeMax,
    isPremium: false,
    createdAt: new Date(STORY_PUBLISHED[s.translationGroup]?.[s.locale] ?? STORIES_UPDATED),
    updatedAt: new Date(STORIES_UPDATED),
    pages: s.pages.map((p) => ({ id: `${s.slug}-${p.pageNumber}`, pageNumber: p.pageNumber, text: p.text, imageUrl: p.image })),
  };
}

/** One language's stories, in list order. */
export function storiesFor(locale: Locale): StoryData[] {
  return allStories.filter((s) => s.locale === DB_LOCALE[locale]).sort((a, b) => a.order - b.order).map(toStoryData);
}

/** A story exists only in its own language. */
export function storyBySlug(slug: string, locale: Locale): StoryData | null {
  const s = allStories.find((x) => x.slug === slug && x.locale === DB_LOCALE[locale]);
  return s ? toStoryData(s) : null;
}

/** The same tale in the other languages, for hreflang and the language switcher. */
export function storyTwins(group: string, locale: Locale): Partial<Record<Locale, RouteParams>> {
  const out: Partial<Record<Locale, RouteParams>> = {};
  for (const s of allStories) {
    const l = fromDbLocale(s.locale);
    if (s.translationGroup === group && l !== locale && routing.locales.includes(l)) out[l] = { slug: s.slug };
  }
  return out;
}

export { isStoryPicture, storyImageSrcSet, storyOgImage } from "@/lib/story-images";
