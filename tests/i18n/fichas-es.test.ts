import { existsSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, localizedPath, matchPath, sectionFallbackPath } from "@/lib/i18n/routes";
import {
  FICHA_CATEGORIES,
  FIRST_SYLLABLE_WORDS,
  SYLLABLE_SHEETS,
  fichaCategoryParams,
  fichaPacks,
  fichas,
  fichasForLetter,
  fichasForSyllablePage,
  getFicha,
} from "@/lib/fichas-es";
import { ficheCategoryParams } from "@/lib/fiches-fr";
import { spanishLetters } from "@/lib/letters-es";
import { getSpanishSyllablePage, spanishSyllablePages } from "@/lib/silabas-es";
import { fichaBody, letterWords, pageHtml } from "../../scripts/fichas-es/templates";

const publicFile = (path: string) => join(process.cwd(), "public", path);
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

describe("Spanish worksheet catalogue", () => {
  it("has 239 worksheets and 40 packs, with unique slugs that never collide with a category", () => {
    expect(fichas).toHaveLength(239);
    expect(fichaPacks).toHaveLength(40);
    const params = fichaCategoryParams();
    expect(new Set(params).size).toBe(params.length);
    expect(new Set(fichaPacks.map((p) => p.slug)).size).toBe(fichaPacks.length);
  });

  it("gives every category some worksheets, and every letter at least five", () => {
    for (const c of FICHA_CATEGORIES) expect(fichas.some((f) => f.category === c.slug), c.slug).toBe(true);
    for (const l of spanishLetters) expect(fichasForLetter(l.slug).length, l.slug).toBeGreaterThanOrEqual(5);
  });

  it("stores its PDFs apart from the French ones", () => {
    for (const f of fichas) expect(f.pdf.startsWith("/fichas-pdf/"), f.slug).toBe(true);
    const french = new Set(ficheCategoryParams());
    for (const slug of fichaCategoryParams()) expect(french.has(slug), slug).toBe(false);
  });

  it("builds packs from worksheets that exist", () => {
    for (const p of fichaPacks) {
      expect(p.fichas.length, p.slug).toBeGreaterThan(0);
      for (const slug of p.fichas) expect(getFicha(slug), `${p.slug} → ${slug}`).toBeDefined();
    }
  });

  it("has a rendered PDF and preview for every worksheet and pack (run npm run fichas:es)", () => {
    for (const f of fichas) {
      expect(existsSync(publicFile(f.pdf)), f.pdf).toBe(true);
      expect(statSync(publicFile(f.pdf)).size, f.pdf).toBeGreaterThan(10_000);
      expect(existsSync(publicFile(f.preview)), f.preview).toBe(true);
    }
    for (const p of fichaPacks) expect(existsSync(publicFile(p.pdf)), p.pdf).toBe(true);
  });

  it("splits first-syllable words correctly, all starting with their letter", () => {
    for (const [letter, words] of Object.entries(FIRST_SYLLABLE_WORDS)) {
      expect(words.length, letter).toBeGreaterThanOrEqual(2);
      for (const w of words) {
        expect(w.word.split("|").length, w.word).toBeGreaterThanOrEqual(2);
        expect(strip(w.word).startsWith(letter), `${letter}: ${w.word}`).toBe(true);
        expect(w.withArticle, w.word).toContain(w.word.replace(/\|/g, ""));
      }
    }
    for (const letter of ["enie", "q", "w", "x"]) expect(FIRST_SYLLABLE_WORDS[letter], letter).toBeUndefined();
  });
});

describe("Spanish syllable worksheets", () => {
  it("has one sheet per consonant group, and the blends", () => {
    const slugs = SYLLABLE_SHEETS.map((s) => s.slug);
    for (const c of ["m", "p", "s", "l", "t", "d", "n", "f", "b", "v", "r", "rr", "j", "enie", "ll", "y", "ch", "h", "z"]) {
      expect(slugs, c).toContain(`silabas-${c}`);
    }
    for (const g of ["ca-co-cu", "que-qui", "ce-ci", "ga-go-gu", "gue-gui", "ge-gi"]) expect(slugs, g).toContain(`silabas-${g}`);
    for (const b of ["bl", "cl", "fl", "gl", "pl", "br", "cr", "dr", "fr", "gr", "pr", "tr"]) expect(slugs, b).toContain(`trabadas-${b}`);
  });

  it("uses syllables and words that belong on the sheet", () => {
    for (const s of SYLLABLE_SHEETS) {
      expect(s.syllables.length, s.slug).toBeGreaterThanOrEqual(2);
      for (const w of s.words) {
        const parts = w.word.split("|").map(strip);
        expect(parts.some((p) => s.syllables.some((syl) => p.includes(strip(syl)))), `${s.slug}: ${w.word}`).toBe(true);
      }
    }
  });

  it("is linked from syllable pages that exist, and every consonant page has a sheet", () => {
    for (const s of SYLLABLE_SHEETS) {
      expect(s.pages.length, s.slug).toBeGreaterThan(0);
      for (const p of s.pages) expect(getSpanishSyllablePage(p), `${s.slug} → ${p}`).toBeDefined();
    }
    const withSheets = spanishSyllablePages.filter((p) => fichasForSyllablePage(p.slug).length > 0).map((p) => p.slug);
    for (const page of ["silabas-directas", "trabadas-con-l", "trabadas-con-r", "ch", "ll-y-y", "r-y-rr", "ca-co-cu-que-qui", "ce-ci-y-z", "ga-go-gu-gue-gui", "ge-gi-y-j", "h-muda", "b-y-v", "enie"]) {
      expect(withSheets, page).toContain(page);
    }
  });
});

describe("Spanish worksheet templates", () => {
  it("render every worksheet without throwing, in Spanish", () => {
    for (const f of fichas) {
      const html = pageHtml(f, fichaBody(f));
      expect(html, f.slug).toContain('class="page"');
      expect(html, f.slug).toContain("Nombre:");
      expect(html, f.slug).not.toContain("Prénom");
    }
  });

  it("write cursive with the Spanish font", () => {
    const html = fichaBody(getFicha("letra-a-cursiva")!);
    expect(html).toContain('data-font="cur-es"');
    expect(html).not.toContain('data-font="cur"');
  });

  it("give every letter two or three words to write", () => {
    for (const l of spanishLetters) expect(letterWords(l).length, l.slug).toBeGreaterThanOrEqual(2);
  });
});

describe("Spanish worksheet routes", () => {
  it("accept Spanish worksheets only in Spanish", () => {
    for (const slug of fichaCategoryParams()) {
      expect(paramsExist("/worksheets/[category]", { category: slug }, "es"), slug).toBe(true);
      expect(paramsExist("/worksheets/[category]", { category: slug }, "fr"), slug).toBe(false);
      expect(paramsExist("/worksheets/[category]", { category: slug }, "en"), slug).toBe(false);
    }
    for (const slug of ["lettre-a-cursive", "letter-a-tracing", "nombres"]) {
      expect(paramsExist("/worksheets/[category]", { category: slug }, "es"), slug).toBe(false);
    }
    for (const p of fichaPacks) expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }, "es")).toBe(true);
    expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: "pack-lettre-a" }, "es")).toBe(false);
  });

  it("pair the index pages in every language, but no worksheet or pack page", () => {
    expect(localizedPath("es", "/worksheets/[category]", { category: "silabas-m" })).toBe("/es/fichas/silabas-m");
    expect(localizedPath("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: "paquete-letra-a" })).toBe("/es/fichas/paquetes/paquete-letra-a");
    expect(alternatesFor("es", "/worksheets").languages).toEqual({
      en: "https://alphabes.com/worksheets",
      fr: "https://alphabes.com/fr/fiches",
      es: "https://alphabes.com/es/fichas",
      pt: "https://alphabes.com/pt/atividades",
      "x-default": "https://alphabes.com/worksheets",
    });
    expect(alternatesFor("es", "/worksheets/[category]", { category: "silabas-m" })).toEqual({
      canonical: "https://alphabes.com/es/fichas/silabas-m",
    });
    expect(counterpartPath(matchPath("/fr/fiches/packs")!, "es")).toBe("/es/fichas/paquetes");
    expect(counterpartPath(matchPath("/es/fichas/silabas-m")!, "fr")).toBeNull();
  });

  it("send the switcher to the worksheet index of the other language", () => {
    expect(sectionFallbackPath(matchPath("/es/fichas/letra-a-cursiva")!, "en")).toBe("/worksheets");
    expect(sectionFallbackPath(matchPath("/fr/fiches/lettre-a-cursive")!, "es")).toBe("/es/fichas");
    expect(sectionFallbackPath(matchPath("/es/fichas/paquetes/paquete-letra-a")!, "fr")).toBe("/fr/fiches/packs");
  });
});
