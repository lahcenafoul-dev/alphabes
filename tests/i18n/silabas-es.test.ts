import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import {
  SPANISH_SYLLABLE_SLUGS,
  alternatesFor,
  counterpartPath,
  isLocaleOnly,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";
import { spanishLetters } from "@/lib/letters-es";
import {
  ES_BUILDER_CONSONANTS,
  ES_BUILDER_VOWELS,
  SYLLABLE_GROUPS,
  getSpanishSyllablePage,
  orderedSyllablePages,
  spanishSyllablePages,
  syllablePageNeighbors,
} from "@/lib/silabas-es";
import { plainWord, wordParts } from "@/lib/sons-fr";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const allWords = (p: (typeof spanishSyllablePages)[number]) => [
  ...(p.words ?? []),
  ...(p.clap ?? []),
  ...(p.hunt?.items ?? []),
  ...(p.build ?? []),
];

describe("Spanish syllable pages", () => {
  it("has 20 pages, listed in routes.ts, with unique slugs", () => {
    expect(spanishSyllablePages).toHaveLength(20);
    expect([...SPANISH_SYLLABLE_SLUGS].sort()).toEqual(spanishSyllablePages.map((p) => p.slug).sort());
  });

  it("starts with the vowels and direct syllables, and puts every page in a group", () => {
    expect(orderedSyllablePages().slice(0, 2).map((p) => p.slug)).toEqual(["vocales", "silabas-directas"]);
    const groups = new Set(SYLLABLE_GROUPS.map((g) => g.id));
    for (const p of spanishSyllablePages) expect(groups.has(p.group), p.slug).toBe(true);
    expect(syllablePageNeighbors("vocales").prev).toBeUndefined();
    expect(syllablePageNeighbors("palabras-frecuentes").next).toBeUndefined();
  });

  it("covers the method: vowels, direct, inverse, mixed and blended syllables, and the special cases", () => {
    for (const slug of [
      "vocales", "silabas-directas", "silabas-inversas", "silabas-mixtas", "trabadas-con-l", "trabadas-con-r",
      "ch", "ll-y-y", "r-y-rr", "ca-co-cu-que-qui", "ga-go-gu-gue-gui", "dieresis", "h-muda", "b-y-v", "ce-ci-y-z", "ge-gi-y-j",
    ]) {
      expect(getSpanishSyllablePage(slug), slug).toBeDefined();
    }
  });

  it("gives every page an intro, something to hear, a tip, FAQs and related pages that exist", () => {
    for (const p of spanishSyllablePages) {
      expect(p.title && p.metaTitle && p.summary && p.intro && p.spoken && p.tip, p.slug).toBeTruthy();
      expect(p.faq.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.words || p.tiles, p.slug).toBeTruthy();
      for (const r of p.related) expect(getSpanishSyllablePage(r), `${p.slug} → ${r}`).toBeDefined();
    }
  });

  it("uses valid word markup, with each word read with its article", () => {
    for (const p of spanishSyllablePages) {
      for (const w of p.words ?? []) {
        expect(w.word, p.slug).toMatch(/^[^[\]|]*(\[[^[\]|]+\][^[\]|]*)*$|^[^[\]]+(\|[^[\]|]+)*$/);
        expect(wordParts(w.word).map((x) => x.text).join(""), w.word).toBe(plainWord(w.word));
        if (plainWord(w.word) !== "México") expect(w.withArticle.toLowerCase(), w.word).toContain(plainWord(w.word).toLowerCase());
      }
    }
  });

  it("highlights only letters the page is about", () => {
    const marked = (slug: string) => (getSpanishSyllablePage(slug)!.words ?? []).flatMap((w) => wordParts(w.word).filter((x) => x.mark).map((x) => x.text.toLowerCase()));
    expect(new Set(marked("ch"))).toEqual(new Set(["ch"]));
    expect(new Set(marked("h-muda"))).toEqual(new Set(["h"]));
    expect(new Set(marked("dieresis"))).toEqual(new Set(["gü", "gu"]));
    expect(new Set(marked("enie"))).toEqual(new Set(["ñ"]));
    expect(new Set(marked("trabadas-con-l"))).toEqual(new Set(["bl", "cl", "fl", "gl", "pl"]));
  });

  it("builds words exactly from their syllables, with distinct decoys", () => {
    for (const p of spanishSyllablePages) {
      for (const b of p.build ?? []) {
        expect(b.syllables.join(""), `${p.slug}: ${b.word}`).toBe(b.word);
        expect(b.extra.some((e) => b.syllables.includes(e)), `${b.word} decoys`).toBe(false);
        expect(new Set([...b.syllables, ...b.extra]).size, `${b.word} tiles`).toBe(b.syllables.length + b.extra.length);
      }
    }
  });

  it("asks to clap words of one to five syllables", () => {
    const clap = getSpanishSyllablePage("contar-silabas")!.clap!;
    const counts = clap.map((w) => w.word.split("|").length);
    expect(Math.min(...counts)).toBe(1);
    expect(Math.max(...counts)).toBe(5);
  });

  it("has hunts with at least two right and two wrong pictures", () => {
    for (const p of spanishSyllablePages.filter((x) => x.hunt)) {
      const items = p.hunt!.items;
      expect(items.filter((i) => i.answer).length, p.slug).toBeGreaterThanOrEqual(2);
      expect(items.filter((i) => !i.answer).length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.hunt!.yes, p.slug).toContain("{mot}");
    }
  });

  it("gets the hunt answers right", () => {
    const hunt = (slug: string) => getSpanishSyllablePage(slug)!.hunt!.items;
    for (const i of hunt("ch")) expect(i.word.includes("ch"), i.word).toBe(i.answer);
    for (const i of hunt("enie")) expect(i.word.includes("ñ"), i.word).toBe(i.answer);
    for (const i of hunt("dieresis")) expect(i.word.includes("ü"), i.word).toBe(i.answer);
    for (const i of hunt("vocales")) expect("aeiou".includes(strip(i.word)[0]), i.word).toBe(i.answer);
    for (const i of hunt("trabadas-con-l")) expect(/[bcfgp]l/.test(i.word), i.word).toBe(i.answer);
    for (const i of hunt("trabadas-con-r")) expect(/[bcdfgpt]r/.test(i.word), i.word).toBe(i.answer);
  });

  it("avoids words that change from one country to another", () => {
    const regional = [
      "carro", "coche", "platano", "banana", "fresa", "frutilla", "durazno", "melocoton", "jugo", "zumo",
      "pastel", "torta", "papa", "patata", "pina", "anana", "computadora", "ordenador", "coger", "camion", "chile",
    ];
    for (const p of spanishSyllablePages) {
      for (const w of allWords(p)) expect(regional, `${p.slug}: ${w.word}`).not.toContain(strip(plainWord(w.word)));
    }
  });

  it("contains no look-alike letters from other alphabets", () => {
    // Greek θ is allowed: it is the IPA symbol for the z of Spain.
    const text = JSON.stringify([spanishSyllablePages, spanishLetters]);
    expect(text).not.toMatch(/[Ѐ-ӿ]|[Ͱ-ηι-Ͽ]/);
  });

  it("offers Spanish consonants and the five vowels in the builder", () => {
    expect(ES_BUILDER_VOWELS).toEqual(["a", "e", "i", "o", "u"]);
    expect(ES_BUILDER_CONSONANTS).toEqual(expect.arrayContaining(["m", "p", "s", "l", "ñ", "ch", "ll"]));
  });
});

describe("Spanish syllable routes", () => {
  it("accepts the Spanish pages, and only them, under /es/silabas", () => {
    for (const p of spanishSyllablePages) expect(paramsExist("/phonics/[skill]", { skill: p.slug }, "es"), p.slug).toBe(true);
    for (const skill of ["ou", "voyelles", "blending", "nope"]) expect(paramsExist("/phonics/[skill]", { skill }, "es"), skill).toBe(false);
    expect(paramsExist("/phonics/[skill]", { skill: "vocales" }, "fr")).toBe(false);
    expect(paramsExist("/phonics/[skill]", { skill: "vocales" }, "en")).toBe(false);
  });

  it("gives Spanish pages a canonical only, and pairs the index in three languages", () => {
    expect(isLocaleOnly("es", "/phonics/[skill]", { skill: "ch" })).toBe(true);
    expect(alternatesFor("es", "/phonics/[skill]", { skill: "silabas-directas" })).toEqual({
      canonical: "https://alphabes.com/es/silabas/silabas-directas",
    });
    expect(alternatesFor("es", "/phonics").languages).toEqual({
      en: "https://alphabes.com/phonics",
      fr: "https://alphabes.com/fr/sons",
      es: "https://alphabes.com/es/silabas",
      "x-default": "https://alphabes.com/phonics",
    });
  });

  it("sends the switcher to the other language's index from a syllable page", () => {
    expect(counterpartPath(matchPath("/phonics")!, "es")).toBe("/es/silabas");
    expect(counterpartPath(matchPath("/es/silabas/ch")!, "fr")).toBeNull();
    expect(sectionFallbackPath(matchPath("/es/silabas/ch")!, "fr")).toBe("/fr/sons");
    expect(sectionFallbackPath(matchPath("/fr/sons/ch")!, "es")).toBe("/es/silabas");
    expect(sectionFallbackPath(matchPath("/phonics/blending")!, "es")).toBe("/es/silabas");
  });
});
