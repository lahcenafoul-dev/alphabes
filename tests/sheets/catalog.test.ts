// The worksheet types of lib/sheets/catalog.ts (missing numbers, patterns,
// sticker sheets): unique slugs and titles in every language, every cartoon
// exists, every PDF and preview is generated, and the routes know every page.
import { existsSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { SHEETS, SHEET_KINDS, sheetCategoryParams, sheetPdf, sheetPreview, sheetsOfKind } from "@/lib/sheets/catalog";
import { SHEET_LOCALES } from "@/lib/sheets/types";
import { alternatesFor, counterpartPath, localizedPath, matchPath } from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { ficheCategoryParams } from "@/lib/fiches-fr";
import { fichaCategoryParams } from "@/lib/fichas-es";
import { atividadeCategoryParams } from "@/lib/atividades-pt";
import { englishCategoryParams } from "@/app/[locale]/worksheets/[category]/category-en";

const PUBLIC = path.resolve(__dirname, "../../public");

/** Every cartoon a sheet draws: "picture" fields (one key, or one per language) and "pic:" pattern items. */
function pictures(value: unknown, key = ""): string[] {
  if (typeof value === "string") return value.startsWith("pic:") ? [value.slice(4)] : key === "picture" ? [value] : [];
  if (Array.isArray(value)) return value.flatMap((v) => pictures(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      key === "picture" && typeof v === "string" ? [v] : pictures(v, k === "picture" || key !== "picture" ? k : key),
    );
  }
  return [];
}

describe("worksheet types catalogue", () => {
  it("has the phase 1 sheets", () => {
    expect(sheetsOfKind("missing-numbers")).toHaveLength(80);
    expect(sheetsOfKind("patterns")).toHaveLength(80);
    expect(sheetsOfKind("stickers")).toHaveLength(25);
  });

  it("has unique ids, slugs and titles in every language", () => {
    expect(new Set(SHEETS.map((s) => s.id)).size).toBe(SHEETS.length);
    for (const l of SHEET_LOCALES) {
      const slugs = sheetCategoryParams(l);
      expect(new Set(slugs).size, l).toBe(slugs.length);
      for (const s of slugs) expect(s, l).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      const titles = SHEETS.map((s) => s.title[l]);
      expect(new Set(titles).size, l).toBe(titles.length);
      for (const s of SHEETS) {
        expect(s.description[l].length, `${l} ${s.id}`).toBeGreaterThan(50);
        expect(s.instruction[l], `${l} ${s.id}`).not.toBe("");
      }
    }
  });

  it("doesn't reuse a slug of the other worksheet pages", () => {
    const others = { en: englishCategoryParams(), fr: ficheCategoryParams(), es: fichaCategoryParams(), pt: atividadeCategoryParams() };
    for (const l of SHEET_LOCALES) {
      const taken = new Set(others[l]);
      expect(sheetCategoryParams(l).filter((s) => taken.has(s)), l).toEqual([]);
    }
  });

  it("uses filter values that the type lists", () => {
    for (const kind of SHEET_KINDS) {
      for (const s of sheetsOfKind(kind.id)) {
        for (const f of kind.filters) expect(f.options.map((o) => o.value), `${s.id} ${f.key}`).toContain(s.filters[f.key]);
      }
    }
  });

  it("only draws cartoons that exist", () => {
    const keys = new Set(SHEETS.flatMap((s) => pictures(s.params)));
    expect(keys.size).toBeGreaterThan(100);
    const missing = [...keys].filter((k) => !existsSync(path.join(PUBLIC, "words", `${k}.webp`)) && !existsSync(path.join(PUBLIC, "counting", `${k}.webp`)));
    expect(missing).toEqual([]);
  });

  it("has a PDF and both preview sizes for every sheet in every language", () => {
    const missing: string[] = [];
    for (const l of SHEET_LOCALES) {
      for (const s of SHEETS) {
        const pdf = path.join(PUBLIC, sheetPdf(l, s));
        const preview = path.join(PUBLIC, sheetPreview(l, s));
        for (const file of [pdf, preview, preview.replace(/\.jpg$/, ".320.jpg")]) {
          if (!existsSync(file) || statSync(file).size < 5000) missing.push(path.relative(PUBLIC, file));
        }
      }
    }
    expect(missing).toEqual([]);
  });
});

describe("worksheet types routes", () => {
  it("lets every page through the middleware and maps it to its twins", () => {
    for (const l of SHEET_LOCALES) {
      for (const slug of sheetCategoryParams(l)) {
        expect(paramsExist("/worksheets/[category]", { category: slug }, l), `${l} ${slug}`).toBe(true);
        const match = matchPath(localizedPath(l, "/worksheets/[category]", { category: slug }));
        expect(match?.pathname).toBe("/worksheets/[category]");
        for (const other of SHEET_LOCALES) if (other !== l) expect(counterpartPath(match!, other), `${l} ${slug} → ${other}`).not.toBeNull();
      }
    }
  });

  it("lists hreflang for the four languages", () => {
    const sheet = SHEETS[0];
    const { languages } = alternatesFor("fr", "/worksheets/[category]", { category: sheet.slug.fr });
    expect(Object.keys(languages ?? {}).sort()).toEqual(["en", "es", "fr", "pt", "x-default"]);
    expect((languages as Record<string, string>).pt).toBe(`https://alphabes.com/pt/atividades/${sheet.slug.pt}`);
  });

  it("still gives the other worksheet pages no twin", () => {
    const slug = ficheCategoryParams()[0];
    expect(alternatesFor("fr", "/worksheets/[category]", { category: slug }).languages).toBeUndefined();
  });
});
