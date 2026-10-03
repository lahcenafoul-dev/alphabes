import { existsSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, localizedPath, matchPath, sectionFallbackPath } from "@/lib/i18n/routes";
import {
  ATIVIDADE_CATEGORIES,
  FIRST_SYLLABLE_WORDS,
  SYLLABLE_SHEETS,
  atividadeCategoryParams,
  atividadePacks,
  atividades,
  atividadesForLetter,
  atividadesForSyllablePage,
  getAtividade,
} from "@/lib/atividades-pt";
import { fichaCategoryParams } from "@/lib/fichas-es";
import { ficheCategoryParams } from "@/lib/fiches-fr";
import { CEDILHA_SLUG, portugueseLetters } from "@/lib/letters-pt";
import { getPortugueseSyllablePage, portugueseSyllablePages } from "@/lib/silabas-pt";
import { atividadeBody, letterWords, pageHtml } from "../../scripts/atividades-pt/templates";

const publicFile = (path: string) => join(process.cwd(), "public", path);
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const PORTUGAL_ONLY = ["autocarro", "comboio", "frigorifico", "chavena", "ananas", "castanho", "cinzento", "sumo", "gelado", "camisola"];

describe("Portuguese worksheet catalogue", () => {
  it("has 272 worksheets and 43 packs, with unique slugs that never collide with a category", () => {
    expect(atividades).toHaveLength(272);
    expect(atividadePacks).toHaveLength(43);
    const params = atividadeCategoryParams();
    expect(new Set(params).size).toBe(params.length);
    expect(new Set(atividadePacks.map((p) => p.slug)).size).toBe(atividadePacks.length);
  });

  it("gives every category some worksheets, and every letter (and Ç) at least six", () => {
    for (const c of ATIVIDADE_CATEGORIES) expect(atividades.some((a) => a.category === c.slug), c.slug).toBe(true);
    for (const l of portugueseLetters) expect(atividadesForLetter(l.slug).length, l.slug).toBeGreaterThanOrEqual(6);
  });

  it("has the four kinds of letter: bastão, forma and cursive sheets for all 27", () => {
    for (const l of portugueseLetters) {
      for (const type of ["bastao", "forma", "cursiva", "reconhecer", "colorir", "palavras"]) {
        expect(getAtividade(`letra-${l.slug}-${type}`), `${l.slug} ${type}`).toBeDefined();
      }
    }
  });

  it("stores its PDFs apart from the French and Spanish ones", () => {
    for (const a of atividades) expect(a.pdf.startsWith("/atividades-pdf/"), a.slug).toBe(true);
    // Some slugs are the same words in Spanish (letra-a-cursiva, numero-3):
    // harmless, the pages live under different prefixes and are never paired,
    // and their PDFs are in different folders.
    const spanishPdfs = new Set(fichaCategoryParams());
    expect(spanishPdfs.has("numero-3")).toBe(true);
    for (const slug of ficheCategoryParams()) expect(getAtividade(slug), slug).toBeUndefined();
  });

  it("builds packs from worksheets that exist", () => {
    for (const p of atividadePacks) {
      expect(p.atividades.length, p.slug).toBeGreaterThan(0);
      for (const slug of p.atividades) expect(getAtividade(slug), `${p.slug} → ${slug}`).toBeDefined();
    }
  });

  it("has a rendered PDF and preview for every worksheet and pack (run npm run atividades:pt)", () => {
    for (const a of atividades) {
      expect(existsSync(publicFile(a.pdf)), a.pdf).toBe(true);
      expect(statSync(publicFile(a.pdf)).size, a.pdf).toBeGreaterThan(10_000);
      expect(existsSync(publicFile(a.preview)), a.preview).toBe(true);
    }
    for (const p of atividadePacks) expect(existsSync(publicFile(p.pdf)), p.pdf).toBe(true);
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
    for (const letter of [CEDILHA_SLUG, "k", "q", "w", "y"]) expect(FIRST_SYLLABLE_WORDS[letter], letter).toBeUndefined();
  });

  it("uses Brazilian words (marrom, cinza, abacaxi), never Portugal-only ones", () => {
    const text = JSON.stringify([atividades, SYLLABLE_SHEETS, FIRST_SYLLABLE_WORDS]);
    for (const word of PORTUGAL_ONLY) expect(strip(text).split(/[^a-z-]+/), word).not.toContain(word);
  });
});

describe("Portuguese syllable worksheets", () => {
  it("has a sheet for each família silábica, dígrafo, nasal sound and encontro", () => {
    const slugs = SYLLABLE_SHEETS.map((s) => s.slug);
    for (const c of ["b", "d", "f", "j", "l", "m", "n", "p", "r", "s", "t", "v", "x", "z", "ca-co-cu", "ce-ci", "c-cedilha", "ga-go-gu", "ge-gi"]) {
      expect(slugs, c).toContain(`familia-${c}`);
    }
    for (const d of ["ch", "lh", "nh", "rr", "ss", "qu", "gu"]) expect(slugs, d).toContain(`digrafo-${d}`);
    for (const n of ["til", "an-en-in-on-un", "am-em-im-om-um"]) expect(slugs, n).toContain(`nasal-${n}`);
    for (const e of ["br", "cr", "dr", "fr", "gr", "pr", "tr", "bl", "cl", "fl", "gl", "pl"]) expect(slugs, e).toContain(`encontro-${e}`);
  });

  it("uses syllables and words that belong on the sheet", () => {
    for (const s of SYLLABLE_SHEETS) {
      expect(s.syllables.length, s.slug).toBeGreaterThanOrEqual(2);
      for (const w of s.words) {
        const word = strip(w.word.replace(/\|/g, ""));
        expect(s.syllables.some((syl) => word.includes(strip(syl))), `${s.slug}: ${w.word}`).toBe(true);
        expect(w.withArticle.toLowerCase(), w.word).toContain(w.word.replace(/\|/g, "").toLowerCase());
      }
    }
  });

  it("splits rr and ss across syllables, as Brazilian schools do", () => {
    for (const s of SYLLABLE_SHEETS) {
      for (const w of s.words) {
        for (const part of w.word.split("|")) expect(/rr|ss/.test(part), `${s.slug}: ${w.word}`).toBe(false);
      }
    }
  });

  it("is linked from syllable pages that exist, and the main syllable pages have sheets", () => {
    for (const s of SYLLABLE_SHEETS) {
      expect(s.pages.length, s.slug).toBeGreaterThan(0);
      for (const p of s.pages) expect(getPortugueseSyllablePage(p), `${s.slug} → ${p}`).toBeDefined();
    }
    const withSheets = portugueseSyllablePages.filter((p) => atividadesForSyllablePage(p.slug).length > 0).map((p) => p.slug);
    for (const page of [
      "familias-silabicas", "ch", "lh", "nh", "rr", "ss", "qu", "gu", "til", "an-en-in-on-un", "am-em-im-om-um",
      "encontros-com-r", "encontros-com-l", "ar-er-ir-or-ur", "as-es-is-os-us", "al-el-il-ol-ul", "c-e-cedilha", "g-e-j", "x",
    ]) {
      expect(withSheets, page).toContain(page);
    }
  });
});

describe("Portuguese worksheet templates", () => {
  it("render every worksheet without throwing, in Portuguese", () => {
    for (const a of atividades) {
      const html = pageHtml(a, atividadeBody(a));
      expect(html, a.slug).toContain('class="page"');
      expect(html, a.slug).toContain("Nome:");
      expect(html, a.slug).not.toMatch(/Prénom|Nombre:|Fecha:/);
    }
  });

  it("write cursive with the Brazilian font", () => {
    const html = atividadeBody(getAtividade("letra-a-cursiva")!);
    expect(html).toContain('data-font="cur-pt"');
    expect(html).not.toMatch(/data-font="cur(-es)?"/);
  });

  it("write the bastão sheet in capitals and the forma sheet in lowercase", () => {
    expect(atividadeBody(getAtividade("letra-b-bastao")!)).toContain('data-text="BOLA"');
    expect(atividadeBody(getAtividade("letra-b-forma")!)).toContain('data-text="bola"');
  });

  it("give every letter two or three words to write", () => {
    for (const l of portugueseLetters) expect(letterWords(l).length, l.slug).toBeGreaterThanOrEqual(2);
  });

  it("never repeat the letter in an instruction", () => {
    for (const a of atividades) expect(a.instrucao, a.slug).not.toMatch(/\b([A-ZÇ]) \1\b/);
  });
});

describe("Portuguese worksheet routes", () => {
  it("accept Portuguese worksheets only in Portuguese", () => {
    for (const slug of atividadeCategoryParams()) {
      expect(paramsExist("/worksheets/[category]", { category: slug }, "pt"), slug).toBe(true);
      expect(paramsExist("/worksheets/[category]", { category: slug }, "en"), slug).toBe(false);
    }
    for (const slug of ["lettre-a-cursive", "letter-a-tracing", "silabas-m", "letra-a-trazo"]) {
      expect(paramsExist("/worksheets/[category]", { category: slug }, "pt"), slug).toBe(false);
    }
    for (const p of atividadePacks) expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }, "pt")).toBe(true);
    expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: "paquete-letra-a" }, "pt")).toBe(false);
  });

  it("pair the index pages in four languages, but no worksheet or pack page", () => {
    expect(localizedPath("pt", "/worksheets/[category]", { category: "familia-b" })).toBe("/pt/atividades/familia-b");
    expect(localizedPath("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: "pacote-letra-a" })).toBe("/pt/atividades/pacotes/pacote-letra-a");
    expect(alternatesFor("pt", "/worksheets").languages).toEqual({
      en: "https://alphabes.com/worksheets",
      fr: "https://alphabes.com/fr/fiches",
      es: "https://alphabes.com/es/fichas",
      pt: "https://alphabes.com/pt/atividades",
      "x-default": "https://alphabes.com/worksheets",
    });
    expect(alternatesFor("pt", "/worksheets/[category]", { category: "familia-b" })).toEqual({
      canonical: "https://alphabes.com/pt/atividades/familia-b",
    });
    expect(counterpartPath(matchPath("/es/fichas/paquetes")!, "pt")).toBe("/pt/atividades/pacotes");
    expect(counterpartPath(matchPath("/pt/atividades/familia-b")!, "es")).toBeNull();
  });

  it("send the switcher to the worksheet index of the other language", () => {
    expect(sectionFallbackPath(matchPath("/pt/atividades/letra-a-cursiva")!, "en")).toBe("/worksheets");
    expect(sectionFallbackPath(matchPath("/es/fichas/letra-a-cursiva")!, "pt")).toBe("/pt/atividades");
    expect(sectionFallbackPath(matchPath("/pt/atividades/pacotes/pacote-letra-a")!, "fr")).toBe("/fr/fiches/packs");
  });
});
