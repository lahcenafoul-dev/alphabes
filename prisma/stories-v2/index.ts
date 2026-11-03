import { alt1 } from "./alt-1";
import { alt2 } from "./alt-2";
import { alt3 } from "./alt-3";
import { level1 } from "./level-1";
import { level2 } from "./level-2";
import { level3 } from "./level-3";
import type { StoryAlt, StoryV2 } from "./types";

export * from "./types";

/** All 24 stories in list order (level 1, then 2, then 3). */
export const storiesV2: StoryV2[] = [...level1, ...level2, ...level3];

/** Alt text by story group: [cover, page 1, page 2…] per language. */
export const STORY_ALT: Record<string, StoryAlt> = { ...alt1, ...alt2, ...alt3 };

export const storyByGroup = (group: string | null | undefined): StoryV2 | undefined =>
  group ? storiesV2.find((s) => s.group === group) : undefined;
