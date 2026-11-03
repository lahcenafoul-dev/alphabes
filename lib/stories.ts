// What the story pages need beyond the database rows: the level, the "new"
// badge, the SEO description, the questions and the alt text, all from
// prisma/stories-v2 by translationGroup, and the picture URLs. Server only:
// pages pass the bits they need to client components as props.
import type { Locale } from "@/i18n/routing";
import { DB_LOCALE } from "@/lib/i18n/db-locale";
import { STORY_ALT, storyByGroup, type Level } from "@/prisma/stories-v2";

export type StoryExtras = {
  level: Level;
  isNew: boolean;
  description: string;
  questions: string[];
  /** [cover, page 1, page 2…] */
  alt: string[];
};

export function storyExtras(group: string | null, locale: Locale): StoryExtras | null {
  const story = storyByGroup(group);
  if (!story) return null;
  const lang = DB_LOCALE[locale];
  const t = story.text[lang];
  return { level: story.level, isNew: story.isNew, description: t.description, questions: t.questions, alt: STORY_ALT[story.group]?.[lang] ?? [] };
}

export { isStoryPicture, storyImageSrcSet, storyOgImage } from "@/lib/story-images";
