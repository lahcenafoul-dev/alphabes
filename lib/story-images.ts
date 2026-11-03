// Story picture URLs (scripts/stories/images.ts makes the files). No story
// data here, so client components can use it.

/** A real picture file, as opposed to a drawn scene name ("apple-1"). */
export const isStoryPicture = (url: string | null | undefined): url is string => !!url && url.startsWith("/stories/") && url.endsWith("-1200.webp");

/** The 640 and 1200 px versions of a story picture. */
export const storyImageSrcSet = (url: string) => `${url.replace(/-1200\.webp$/, "-640.webp")} 640w, ${url} 1200w`;

/** The 1200×630 social image made from the cover. */
export const storyOgImage = (group: string) => `/stories/${group}/og.jpg`;
