// Downloadable worksheet bundles: 1 complete bundle, 26 per-letter bundles,
// and 10 per-type bundles. Each bundle is a real multi-page PDF assembled
// client-side (see components/worksheets/BundleDownloadButton.tsx) from the
// exact same per-type templates used for individual worksheets.

import { getAllLetterSlugs, getLetterContent } from "./letters-data";
import { WORKSHEET_TYPES } from "./worksheet-types";
import { getAllWorksheetSlugs, getWorksheetsByLetter, getWorksheetsByType } from "./worksheets-data";

export type BundleKind = "complete" | "letter" | "type";

export type BundleRecord = {
  slug: string;
  title: string;
  description: string;
  kind: BundleKind;
  worksheetSlugs: string[];
};

function buildBundles(): BundleRecord[] {
  const bundles: BundleRecord[] = [];

  bundles.push({
    slug: "complete-bundle",
    title: "Complete Alphabet Worksheet Bundle",
    description: "Every worksheet on Alphabes.com in one download: all 26 letters across all 10 worksheet types.",
    kind: "complete",
    worksheetSlugs: getAllWorksheetSlugs(),
  });

  getAllLetterSlugs().forEach((letter) => {
    const content = getLetterContent(letter);
    const uppercase = content?.uppercase ?? letter.toUpperCase();
    bundles.push({
      slug: `letter-${letter}-bundle`,
      title: `Letter ${uppercase} Worksheets Bundle`,
      description: `All 10 worksheet types for the letter ${uppercase}${letter}: tracing, uppercase, lowercase, recognition, beginning sounds, coloring, matching, missing letter, writing practice, and review.`,
      kind: "letter",
      worksheetSlugs: getWorksheetsByLetter(letter).map((w) => w.slug),
    });
  });

  WORKSHEET_TYPES.forEach((type) => {
    bundles.push({
      slug: `${type.categorySlug}-bundle`,
      title: `${type.label} Worksheets Bundle (A-Z)`,
      description: `${type.label} worksheets for every letter, A through Z, in one download. ${type.shortDescription}`,
      kind: "type",
      worksheetSlugs: getWorksheetsByType(type.id).map((w) => w.slug),
    });
  });

  return bundles;
}

export const bundles: BundleRecord[] = buildBundles();

export function getBundleBySlug(slug: string): BundleRecord | null {
  return bundles.find((b) => b.slug === slug) ?? null;
}

export function getAllBundleSlugs(): string[] {
  return bundles.map((b) => b.slug);
}
