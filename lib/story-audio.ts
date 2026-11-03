// Where a story's narration MP3s live (scripts/stories/audio.ts makes them).
// One file per page, and page 0 is the title read on the cover:
//   /audio/stories/v2/<locale>/<slug>/<page>.mp3
// The "v2" folder holds only the Stories v2 texts. Pure, no imports, so the
// client reader can use it without pulling in the story texts.

export type StoryAudioLocale = "en" | "fr" | "es" | "pt";

/** Page 0 is the title (the cover); pages 1…N are the story pages. */
export const storyAudioPath = (locale: StoryAudioLocale, slug: string, pageNumber: number) =>
  `/audio/stories/v2/${locale}/${slug}/${pageNumber}.mp3`;
