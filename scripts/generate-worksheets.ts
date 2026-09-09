// npm run generate:worksheets
//
// Computes the full worksheet + bundle tables (the same pure functions the
// app itself imports at runtime -- no duplicated logic) and writes an
// inspectable manifest to data/worksheets-manifest.json. The app never reads
// this file; it exists purely as a diffable, human/CI-auditable artifact.
// Deterministic: re-running against unchanged source data produces a
// byte-identical file.
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { worksheets } from "../lib/worksheets-data";
import { WORKSHEET_TYPES } from "../lib/worksheet-types";
import { bundles } from "../lib/worksheet-bundles";
import { getAllLetterSlugs } from "../lib/letters-data";

function main() {
  const manifest = {
    total: worksheets.length,
    letters: getAllLetterSlugs().length,
    types: WORKSHEET_TYPES.length,
    bundles: bundles.length,
    worksheets,
  };

  const outDir = join(process.cwd(), "data");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "worksheets-manifest.json");
  writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n", "utf-8");

  console.log(`Generated ${manifest.total} worksheets (${manifest.letters} letters x ${manifest.types} types).`);
  console.log(`Generated ${manifest.bundles} bundles.`);

  console.log("\nWorksheets per type:");
  WORKSHEET_TYPES.forEach((t) => {
    const count = worksheets.filter((w) => w.worksheetType === t.id).length;
    console.log(`  ${t.label}: ${count}`);
  });

  console.log("\nWorksheets per letter:");
  getAllLetterSlugs().forEach((letter) => {
    const count = worksheets.filter((w) => w.letter === letter).length;
    if (count !== WORKSHEET_TYPES.length) {
      console.log(`  ${letter.toUpperCase()}: ${count} (expected ${WORKSHEET_TYPES.length})`);
    }
  });

  console.log(`\nManifest written to ${outPath}`);
}

main();
