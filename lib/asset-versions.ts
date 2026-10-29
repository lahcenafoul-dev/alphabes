import versions from "./asset-versions.json";

// Worksheet PDFs and previews keep their URL when they are regenerated, and
// browsers may keep them for a day (public/_headers). versioned() adds a hash
// of the file's content (npm run assets:versions), so a regenerated file gets
// a new URL. Server code only: the list has every worksheet file in it.
const VERSIONS: Record<string, string> = versions;

/** "/worksheets-pdf/previews/x.jpg" → "/worksheets-pdf/previews/x.jpg?v=1a2b3c4d" (unchanged if unknown). */
export function versioned(url: string): string {
  const v = VERSIONS[url];
  return v ? `${url}?v=${v}` : url;
}
