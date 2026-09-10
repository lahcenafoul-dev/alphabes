// Maps existing worksheet slugs (from lib/worksheets-data.ts) to a real,
// professionally-made static PDF in public/worksheets-pdf/, used instead of
// generating one client-side via jsPDF. Any worksheet slug NOT in this map
// keeps using the existing jsPDF generation completely unchanged -- this is
// purely an additive upgrade to what backs a subset of already-existing
// pages, not a new page/route/slug.
import { getAllLetterSlugs } from "./letters-data";

const letters = getAllLetterSlugs();

function buildOverrides(folder: string, fragment: string): Record<string, string> {
  const map: Record<string, string> = {};
  letters.forEach((l) => {
    map[`letter-${l}-${fragment}`] = `/worksheets-pdf/${folder}/letter-${l}-${fragment}.pdf`;
  });
  return map;
}

export const STATIC_PDF_OVERRIDES: Record<string, string> = {
  ...buildOverrides("tracing", "tracing"),
  ...buildOverrides("beginning-sounds", "beginning-sounds"),
  ...buildOverrides("matching", "matching"),
  ...buildOverrides("recognition", "recognition"),
  ...buildOverrides("writing-practice", "writing-practice"),
  ...buildOverrides("missing-letter", "missing-letter"),
};

export function getStaticPdfOverride(slug: string): string | null {
  return STATIC_PDF_OVERRIDES[slug] ?? null;
}
