import { existsSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { staticWorksheets } from "@/lib/static-worksheets-data";
import { STATIC_PDF_OVERRIDES } from "@/lib/static-pdf-overrides";
import { letterHowTo, staticHowTo } from "@/lib/worksheet-howto";
import { pdfPreview, previewThumb } from "@/lib/preview-thumb";

// docs/seo-batch2-proposals.md, I7.
describe("English worksheet pages", () => {
  it("have a 'How to use this worksheet' text for every letter and every static worksheet", () => {
    for (const l of getAllLetterSlugs()) expect(letterHowTo(l), l).toBeTruthy();
    for (const w of staticWorksheets) expect(staticHowTo(w.slug), w.slug).toBeTruthy();
    expect(letterHowTo("b")).toContain('"B, /b/, like ball."');
    expect(letterHowTo("x")).toContain("like box");
    expect(staticHowTo("number-0-tracing")).toContain("zero means none");
    expect(staticHowTo("number-1-tracing")).toContain("Count out 1 small object before");
    expect(staticHowTo("cvc-word-cat")).toContain("c… a… t…");
  });

  it("have a preview and a thumbnail for every PDF (npm run previews:en)", () => {
    const pdfs = [...Object.values(STATIC_PDF_OVERRIDES), ...staticWorksheets.map((w) => w.pdfPath)];
    expect(pdfs).toHaveLength(242);
    for (const pdf of pdfs) {
      expect(existsSync(join("public", pdf)), pdf).toBe(true);
      expect(existsSync(join("public", pdfPreview(pdf))), pdfPreview(pdf)).toBe(true);
      expect(existsSync(join("public", previewThumb(pdfPreview(pdf)))), pdf).toBe(true);
    }
  });
});
