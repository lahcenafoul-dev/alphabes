// <lastmod> for the pages that live in the code, one fixed date per content
// area (the first URL segment of the route, in every language): the last time
// that area's pages really changed. It used to be the build time, which moved
// on every deploy, so search engines learn to ignore it.
//
// Update an area's date when its pages change (text, data, structured data),
// not for unrelated deploys. Stories use their own date (lib/stories.ts).
import { SITE_URL, matchPath } from "@/lib/i18n/routes";

export const AREA_LASTMOD: Record<string, string> = {
  "": "2026-11-03", // home
  alphabet: "2026-10-28",
  numbers: "2026-11-03",
  phonics: "2026-10-28",
  preschool: "2026-10-31",
  kindergarten: "2026-10-07",
  worksheets: "2026-11-18",
  games: "2026-11-18",
  stories: "2026-11-18",
  flashcards: "2026-11-18",
  activities: "2026-11-18",
  pricing: "2026-11-18",
  blog: "2026-11-18",
  about: "2026-11-18",
  contact: "2026-11-18",
  "privacy-policy": "2026-10-07",
  refunds: "2026-10-07",
  terms: "2026-10-07",
  cookies: "2026-10-07",
};

/** The content area of a site URL ("alphabet" for /fr/alphabet/a), or null if it isn't a known page. */
export function areaOf(url: string): string | null {
  const match = matchPath(url.slice(SITE_URL.length) || "/");
  return match ? match.pathname.split("/")[1] ?? "" : null;
}

/** The fixed lastmod of a page in the code; throws for an area with no date (tests catch it). */
export function lastmodFor(url: string): string {
  const area = areaOf(url);
  const date = area === null ? undefined : AREA_LASTMOD[area];
  if (!date) throw new Error(`sitemap: no lastmod for ${url} (area ${area})`);
  return date;
}
