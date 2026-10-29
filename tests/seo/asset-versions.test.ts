import { describe, expect, it } from "vitest";
// @ts-expect-error plain JS module
import { computeVersions } from "@/scripts/asset-versions.mjs";
import versions from "@/lib/asset-versions.json";
import { versioned } from "@/lib/asset-versions";
import { fiches } from "@/lib/fiches-fr";
import { previewThumb } from "@/lib/preview-thumb";

// Worksheet PDFs and previews get "?v=<content hash>" (lib/asset-versions.ts),
// so browsers fetch a regenerated file at once instead of a day later.
describe("worksheet asset versions", () => {
  it("match the files in public/ (npm run assets:versions)", () => {
    expect(versions).toEqual(computeVersions());
  });

  it("are added to known PDFs and previews", () => {
    const fiche = fiches[0];
    for (const url of [fiche.pdf, fiche.preview, previewThumb(fiche.preview), "/worksheets-pdf/previews/number-3-tracing.jpg"]) {
      expect(versioned(url)).toMatch(new RegExp(`^${url.replace(/\./g, "\\.")}\\?v=[0-9a-f]{8}$`));
    }
  });

  it("leave other URLs alone", () => {
    expect(versioned("/worksheets-pdf/previews/missing.jpg")).toBe("/worksheets-pdf/previews/missing.jpg");
  });
});
