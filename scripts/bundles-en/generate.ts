// npm run bundles:en
//
// Renders every English worksheet bundle (lib/worksheet-bundles.ts) as one
// PDF into pro-files/en/<bundle-slug>.pdf, with the same jsPDF templates the
// single worksheets use. Bundles are a Pro download (docs/paypal-plan.md): the
// files are uploaded to the private R2 bucket, never served from public/.
// Re-run after changing a template or the bundle list, then upload again.
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import sharp from "sharp";
import { bundles } from "../../lib/worksheet-bundles";
import { worksheets } from "../../lib/worksheets-data";
import { renderWorksheetPdf, worksheetPictureWords } from "../../lib/pdf";
import type { WordPhotos } from "../../lib/pdf/icons";
import { pictureKey } from "../../lib/picture-key";

const photoCache: WordPhotos = {};

/** The word photos (public/words/) a worksheet shows, as JPEG data URLs. */
async function loadWordPhotos(words: string[]): Promise<WordPhotos> {
  for (const key of words.map(pictureKey)) {
    const file = join("public", "words", `${key}.webp`);
    if (key in photoCache || !existsSync(file)) continue;
    const jpeg = await sharp(file).flatten({ background: "#ffffff" }).jpeg({ quality: 85 }).toBuffer();
    photoCache[key] = `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  }
  return photoCache;
}

const OUT = join("pro-files", "en");

(async () => {
  const { jsPDF } = await import("jspdf");
  mkdirSync(OUT, { recursive: true });
  let total = 0;
  for (const bundle of bundles) {
    const records = bundle.worksheetSlugs
      .map((slug) => worksheets.find((w) => w.slug === slug))
      .filter((w): w is (typeof worksheets)[number] => Boolean(w));
    if (records.length !== bundle.worksheetSlugs.length) {
      throw new Error(`${bundle.slug}: ${bundle.worksheetSlugs.length - records.length} worksheet(s) not found`);
    }
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    for (const [i, worksheet] of records.entries()) {
      if (i > 0) doc.addPage();
      renderWorksheetPdf(doc, worksheet, await loadWordPhotos(worksheetPictureWords(worksheet)));
    }
    const bytes = Buffer.from(doc.output("arraybuffer"));
    writeFileSync(join(OUT, `${bundle.slug}.pdf`), bytes);
    total += bytes.length;
  }
  console.log(`${bundles.length} bundles written to ${OUT} (${(total / 1024 / 1024).toFixed(1)} MB)`);
})();
