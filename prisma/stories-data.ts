// The stories as the database stores them, in all four languages. Built from
// prisma/stories-v2 (the texts, written per language, see
// docs/stories-plan.md). Used by prisma/seed-stories.ts (which writes them to
// the database) and scripts/stories/audio.ts (which makes the narration).
// Pure data, no imports beyond the texts.
import { LEVEL_AGES, storiesV2, type Lang, type Level } from "./stories-v2";

export type SeedPage = {
  pageNumber: number;
  text: string;
  /** The picture under public/ (scripts/stories/images.ts makes it). */
  image: string;
  /** The old drawn scene (components/StoryIllustration.tsx) used while the picture is missing. */
  fallbackScene: string | null;
};

export type SeedStory = {
  slug: string;
  locale: Lang;
  /** Same tale, same pictures, in the other languages. */
  translationGroup: string;
  title: string;
  level: Level;
  ageRangeMin: number;
  ageRangeMax: number;
  order: number;
  cover: string;
  coverFallbackScene: string | null;
  pages: SeedPage[];
};

/** The 8 stories drawn as SVG scenes before stories v2 (5 scenes each). */
const DRAWN = new Set(["apple", "bear", "cat", "dog", "duck", "fish", "owl", "lion"]);
const OLD_SCENES = 5;

/** A story picture at the largest size; storyImageSrcSet (lib/stories.ts) adds the small one. */
export const storyImagePath = (group: string, name: string) => `/stories/${group}/${name}-1200.webp`;

function build(locale: Lang): SeedStory[] {
  return storiesV2.map((s, i) => {
    const t = s.text[locale];
    const drawn = DRAWN.has(s.group);
    return {
      slug: t.slug,
      locale,
      translationGroup: s.group,
      title: t.title,
      level: s.level,
      ageRangeMin: LEVEL_AGES[s.level][0],
      ageRangeMax: LEVEL_AGES[s.level][1],
      order: i + 1,
      cover: storyImagePath(s.group, "cover"),
      coverFallbackScene: drawn ? `${s.group}-1` : null,
      pages: t.pages.map((text, p) => ({
        pageNumber: p + 1,
        text,
        image: storyImagePath(s.group, `p${p + 1}`),
        fallbackScene: drawn && p < OLD_SCENES ? `${s.group}-${p + 1}` : null,
      })),
    };
  });
}

export const englishStories = build("EN");
export const frenchStories = build("FR");
export const spanishStories = build("ES");
export const portugueseStories = build("PT");
export const allStories: SeedStory[] = [...englishStories, ...frenchStories, ...spanishStories, ...portugueseStories];
