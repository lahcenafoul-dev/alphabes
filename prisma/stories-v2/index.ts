import { level1 } from "./level-1";
import { level2 } from "./level-2";
import { level3 } from "./level-3";
import type { StoryV2 } from "./types";

export * from "./types";

/** All 24 stories in list order (level 1, then 2, then 3). */
export const storiesV2: StoryV2[] = [...level1, ...level2, ...level3];
