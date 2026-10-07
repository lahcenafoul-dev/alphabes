import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { fiches } from "@/lib/fiches-fr";
import { fichas } from "@/lib/fichas-es";
import { atividades } from "@/lib/atividades-pt";
import { previewThumb } from "@/lib/preview-thumb";

// Worksheet cards offer a 320 px copy of each preview (docs/seo-audit.md, I11).
describe("worksheet preview thumbnails", () => {
  it("exist for every French, Spanish and Portuguese worksheet", () => {
    for (const { preview } of [...fiches, ...fichas, ...atividades]) {
      expect(existsSync(join("public", previewThumb(preview))), preview).toBe(true);
    }
  });

  it("are at least as new as their preview (npm run previews:thumbs)", () => {
    for (const dir of ["public/fiches-pdf/apercus", "public/fichas-pdf/vistas-previas", "public/atividades-pdf/previas"]) {
      for (const name of readdirSync(dir).filter((n) => n.endsWith(".jpg") && !n.endsWith(".320.jpg"))) {
        const thumb = join(dir, name.replace(/\.jpg$/, ".320.jpg"));
        expect(existsSync(thumb), thumb).toBe(true);
        // Git checkouts reset times, so allow the two to be written in either order within a minute.
        expect(statSync(thumb).mtimeMs, thumb).toBeGreaterThanOrEqual(statSync(join(dir, name)).mtimeMs - 60_000);
      }
    }
  });

  it("are named after the preview", () => {
    expect(previewThumb("/fiches-pdf/apercus/lettre-a-trace.jpg")).toBe("/fiches-pdf/apercus/lettre-a-trace.320.jpg");
  });
});
