// The Pro packs on the site: their pages exist in every language (and only
// there), each file of every pack is built and tracked in the manifest under
// 15 MB, each page's pictures are in public/, and the downloads point at the
// protected route.
import { existsSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { PACKS, PACK_PAPERS, packFiles, packKey, packPreview } from "@/lib/sheets/packs";
import { PACK_UI } from "@/lib/sheets/pack-ui";
import { SHEET_LOCALES } from "@/lib/sheets/types";
import { paramsExist } from "@/lib/i18n/known-params";
import { downloadFile, packDownloadUrl } from "@/lib/billing/bundles";
import manifest from "@/lib/sheets/pack-manifest.json";

const FILES = manifest as Record<string, { pages: number; bytes: number; sha256: string }>;
const PATH = "/worksheets/bundles/[bundleSlug]" as const;

describe("Pro pack pages", () => {
  it("exist in each language under that language's slug only", () => {
    for (const l of SHEET_LOCALES) {
      for (const p of PACKS) {
        expect(paramsExist(PATH, { bundleSlug: p.slug[l] }, l), `${l} ${p.slug[l]}`).toBe(true);
      }
    }
    expect(paramsExist(PATH, { bundleSlug: "missing-numbers-complete-pack" }, "fr")).toBe(false);
    expect(paramsExist(PATH, { bundleSlug: "pack-mega" }, "es")).toBe(false);
  });

  it("have every file built, tracked in the manifest and under 15 MB", () => {
    for (const l of SHEET_LOCALES) {
      for (const p of PACKS) {
        for (const paper of PACK_PAPERS) {
          for (const { part } of packFiles(p)) {
            const file = FILES[packKey(l, p, paper, part)];
            expect(file, packKey(l, p, paper, part)).toBeDefined();
            expect(file.bytes).toBeLessThan(15 * 1024 * 1024);
            expect(file.pages).toBeGreaterThan(4);
          }
        }
      }
    }
    expect(Object.keys(FILES)).toHaveLength(SHEET_LOCALES.length * PACK_PAPERS.length * PACKS.reduce((n, p) => n + packFiles(p).length, 0));
  });

  it("have their cover and preview pictures in public/", () => {
    for (const l of SHEET_LOCALES) {
      for (const p of PACKS) {
        const names = [...packFiles(p).map(({ part }) => (part ? `cover-part-${part}` : "cover")), "sheet", "key"];
        for (const name of names) expect(existsSync(join("public", packPreview(l, p, name))), packPreview(l, p, name)).toBe(true);
      }
    }
  });

  it("download through the protected route, never from public/", () => {
    const mega = PACKS.find((p) => p.scope === "mega")!;
    expect(packDownloadUrl("pt", mega.slug.pt, "letter", 2)).toBe("/api/bundles/pt/pacote-mega?paper=letter&part=2");
    expect(downloadFile("pt", mega.slug.pt, new URLSearchParams("paper=letter&part=2"))?.key).toBe("pt/packs/pacote-mega-part-2-letter.pdf");
    expect(existsSync(join("public", "pro-packs", "en", "packs"))).toBe(false);
    for (const l of SHEET_LOCALES) expect(existsSync(join("public", l, "packs"))).toBe(false);
  });

  it("have their page words in every language", () => {
    for (const l of SHEET_LOCALES) {
      const t = PACK_UI[l];
      expect(t.upsell(80, "X", true).length).toBeGreaterThan(20);
      expect(t.notPro).toBeTruthy();
      for (const p of PACKS) expect(t.title("X", p, p.name[l])).not.toMatch(/undefined/);
    }
  });
});
