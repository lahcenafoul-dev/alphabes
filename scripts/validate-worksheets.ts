// npm run validate:worksheets
//
// Offline, DB-free validation of the worksheet data table -- intentionally
// NOT wired into `prebuild` (kept manual/CI-only) so it can never become a
// new way for the Netlify build to fail. Run this by hand or in CI whenever
// worksheet data or the type/template registries change.
import { z } from "zod";
import { worksheets, type WorksheetRecord } from "../lib/worksheets-data";
import { WORKSHEET_TYPES } from "../lib/worksheet-types";
import { worksheetCategories } from "../lib/worksheet-categories";
import { bundles } from "../lib/worksheet-bundles";
import { getAllLetterSlugs } from "../lib/letters-data";
import { PDF_TEMPLATES } from "../lib/pdf";
import { ICONS } from "../lib/pdf/icons";

let hardFailures = 0;
let warnings = 0;

function fail(message: string) {
  console.error(`FAIL: ${message}`);
  hardFailures++;
}

function warn(message: string) {
  console.warn(`WARN: ${message}`);
  warnings++;
}

const recordSchema = z.object({
  slug: z.string().regex(/^letter-[a-z]-[a-z-]+$/),
  title: z.string().min(1),
  description: z.string().min(50).max(160),
  ageRangeMin: z.number(),
  ageRangeMax: z.number(),
  skills: z.array(z.string()).min(1),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  exampleWords: z.array(z.object({ word: z.string(), imageAlt: z.string() })).min(1),
  instructions: z.string().min(1),
});

function validateRecordShape(w: WorksheetRecord) {
  const result = recordSchema.safeParse(w);
  if (!result.success) {
    result.error.issues.forEach((issue) => fail(`${w.slug}: ${issue.path.join(".")} - ${issue.message}`));
    return;
  }
  if (w.ageRangeMin >= w.ageRangeMax) fail(`${w.slug}: ageRangeMin must be < ageRangeMax`);
  if (w.title.length > 60) warn(`${w.slug}: title longer than 60 chars ("${w.title}")`);
}

function main() {
  const letters = getAllLetterSlugs();

  // 1. Exact count and full (letter x type) coverage.
  const expectedTotal = letters.length * WORKSHEET_TYPES.length;
  if (worksheets.length !== expectedTotal) {
    fail(`Expected ${expectedTotal} worksheets (${letters.length} letters x ${WORKSHEET_TYPES.length} types), found ${worksheets.length}`);
  }
  const pairSeen = new Set<string>();
  worksheets.forEach((w) => {
    const key = `${w.letter}:${w.worksheetType}`;
    if (pairSeen.has(key)) fail(`Duplicate (letter, type) pair: ${key}`);
    pairSeen.add(key);
  });
  letters.forEach((letter) => {
    WORKSHEET_TYPES.forEach((t) => {
      if (!pairSeen.has(`${letter}:${t.id}`)) fail(`Missing worksheet for letter=${letter} type=${t.id}`);
    });
  });

  // 2 & 3. Slug uniqueness/shape + per-record schema.
  const slugSeen = new Set<string>();
  worksheets.forEach((w) => {
    if (slugSeen.has(w.slug)) fail(`Duplicate worksheet slug: ${w.slug}`);
    slugSeen.add(w.slug);
    validateRecordShape(w);
  });

  // 4. Cross-reference integrity.
  const letterSet = new Set(letters);
  const typeIds = new Set(WORKSHEET_TYPES.map((t) => t.id));
  worksheets.forEach((w) => {
    if (!letterSet.has(w.letter)) fail(`${w.slug}: unknown letter "${w.letter}"`);
    if (!typeIds.has(w.worksheetType)) fail(`${w.slug}: unknown worksheetType "${w.worksheetType}"`);
  });

  // 5. PDF template coverage.
  WORKSHEET_TYPES.forEach((t) => {
    if (!PDF_TEMPLATES[t.id]) fail(`No PDF_TEMPLATES entry for worksheet type "${t.id}"`);
  });

  // 6. Icon coverage (soft warning).
  worksheets
    .filter((w) => ["coloring", "matching", "beginning-sounds"].includes(w.worksheetType))
    .forEach((w) => {
      if (!ICONS[w.primaryWord.toLowerCase()]) {
        warn(`${w.slug}: no icon for primary word "${w.primaryWord}" (falls back to letter-in-a-box)`);
      }
    });

  // 8. Route-collision guard: pillar slugs, type-category slugs, worksheet
  // slugs, and bundle slugs must be pairwise disjoint.
  const pillarSlugs = worksheetCategories.map((c) => c.slug);
  const typeCategorySlugs = WORKSHEET_TYPES.map((t) => t.categorySlug);
  const worksheetSlugs = worksheets.map((w) => w.slug);
  const bundleSlugs = bundles.map((b) => b.slug);
  const groups: [string, string[]][] = [
    ["pillar categories", pillarSlugs],
    ["type categories", typeCategorySlugs],
    ["worksheets", worksheetSlugs],
    ["bundles", bundleSlugs],
  ];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const [nameA, slugsA] = groups[i];
      const [nameB, slugsB] = groups[j];
      const setB = new Set(slugsB);
      slugsA.forEach((slug) => {
        if (setB.has(slug)) fail(`Slug collision between ${nameA} and ${nameB}: "${slug}"`);
      });
    }
  }

  // 9. Bundle integrity.
  const expectedBundleCount = 1 + letters.length + WORKSHEET_TYPES.length;
  if (bundles.length !== expectedBundleCount) {
    fail(`Expected ${expectedBundleCount} bundles (1 complete + ${letters.length} letter + ${WORKSHEET_TYPES.length} type), found ${bundles.length}`);
  }
  const worksheetSlugSet = new Set(worksheetSlugs);
  bundles.forEach((b) => {
    b.worksheetSlugs.forEach((slug) => {
      if (!worksheetSlugSet.has(slug)) fail(`Bundle "${b.slug}" references unknown worksheet slug "${slug}"`);
    });
    if (b.kind === "letter" && b.worksheetSlugs.length !== WORKSHEET_TYPES.length) {
      fail(`Letter bundle "${b.slug}" has ${b.worksheetSlugs.length} worksheets, expected ${WORKSHEET_TYPES.length}`);
    }
    if (b.kind === "type" && b.worksheetSlugs.length !== letters.length) {
      fail(`Type bundle "${b.slug}" has ${b.worksheetSlugs.length} worksheets, expected ${letters.length}`);
    }
    if (b.kind === "complete" && b.worksheetSlugs.length !== worksheets.length) {
      fail(`Complete bundle has ${b.worksheetSlugs.length} worksheets, expected ${worksheets.length}`);
    }
  });

  console.log(`\n${worksheets.length} worksheets, ${bundles.length} bundles checked.`);
  console.log(`${hardFailures} failure(s), ${warnings} warning(s).`);

  if (hardFailures > 0) {
    process.exitCode = 1;
  }
}

main();
