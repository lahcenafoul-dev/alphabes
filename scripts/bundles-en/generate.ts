// npm run bundles:en
//
// Renders every English worksheet bundle (lib/worksheet-bundles.ts) as one
// PDF into pro-files/en/<bundle-slug>.pdf, with the same jsPDF templates the
// single worksheets use. Bundles are a Pro download (docs/paypal-plan.md): the
// files are uploaded to the private R2 bucket, never served from public/.
// Re-run after changing a template or the bundle list, then upload again.
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { bundles } from "../../lib/worksheet-bundles";
import { worksheets } from "../../lib/worksheets-data";
import { renderWorksheetPdf } from "../../lib/pdf";

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
    records.forEach((worksheet, i) => {
      if (i > 0) doc.addPage();
      renderWorksheetPdf(doc, worksheet);
    });
    const bytes = Buffer.from(doc.output("arraybuffer"));
    writeFileSync(join(OUT, `${bundle.slug}.pdf`), bytes);
    total += bytes.length;
  }
  console.log(`${bundles.length} bundles written to ${OUT} (${(total / 1024 / 1024).toFixed(1)} MB)`);
})();
