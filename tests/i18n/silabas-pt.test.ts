import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import {
  PORTUGUESE_SYLLABLE_SLUGS,
  alternatesFor,
  counterpartPath,
  isLocaleOnly,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";
import { portugueseLetters } from "@/lib/letters-pt";
import {
  PT_BUILDER_CONSONANTS,
  PT_BUILDER_VOWELS,
  SILABA_GROUPS,
  getPortugueseSyllablePage,
  orderedPortuguesePages,
  portuguesePageNeighbors,
  portugueseSyllablePages,
  ptSyllableSpoken,
} from "@/lib/silabas-pt";
import { plainWord, wordParts } from "@/lib/sons-fr";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const allWords = (p: (typeof portugueseSyllablePages)[number]) => [
  ...(p.words ?? []),
  ...(p.clap ?? []),
  ...(p.hunt?.items ?? []),
  ...(p.build ?? []),
];
const allText = (p: (typeof portugueseSyllablePages)[number]) => [
  p.title, p.summary, p.intro, p.tip, p.sentence ?? "", ...(p.rules ?? []), ...p.faq.flatMap((f) => [f.question, f.answer]),
  ...allWords(p).flatMap((w) => [w.word, w.withArticle]),
];

// Portugal-only words (docs/portuguese-plan.md, P2).
const PORTUGAL_ONLY = [
  "autocarro", "comboio", "frigorifico", "chavena", "ananas", "telemovel", "rebucado", "sumo", "gelado", "rapariga",
  "miudo", "pequeno-almoco", "casa de banho", "camiao", "talho",
];

describe("Portuguese syllable pages", () => {
  it("has 24 pages, listed in routes.ts, with unique slugs", () => {
    expect(portugueseSyllablePages).toHaveLength(24);
    expect([...PORTUGUESE_SYLLABLE_SLUGS].sort()).toEqual(portugueseSyllablePages.map((p) => p.slug).sort());
  });

  it("follows the Brazilian order: vowels, families, digraphs, nasal sounds, complex syllables", () => {
    expect(orderedPortuguesePages().map((p) => p.group)).toEqual([
      ...Array(4).fill("base"), ...Array(7).fill("digrafos"), ...Array(3).fill("nasais"), ...Array(9).fill("complexas"), "palavras",
    ]);
    expect(orderedPortuguesePages().slice(0, 3).map((p) => p.slug)).toEqual(["vogais", "encontros-vocalicos", "familias-silabicas"]);
    const groups = new Set(SILABA_GROUPS.map((g) => g.id));
    for (const p of portugueseSyllablePages) expect(groups.has(p.group), p.slug).toBe(true);
    expect(portuguesePageNeighbors("vogais").prev).toBeUndefined();
    expect(portuguesePageNeighbors("palavras-frequentes").next).toBeUndefined();
  });

  it("covers the seven digraphs and the nasal sounds", () => {
    for (const slug of ["ch", "lh", "nh", "rr", "ss", "qu", "gu", "til", "an-en-in-on-un", "am-em-im-om-um"]) {
      expect(getPortugueseSyllablePage(slug), slug).toBeDefined();
    }
  });

  it("gives every page an intro, something to hear, a tip, FAQs and related pages that exist", () => {
    for (const p of portugueseSyllablePages) {
      expect(p.title && p.metaTitle && p.summary && p.intro && p.spoken && p.tip, p.slug).toBeTruthy();
      expect(p.faq.length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.words || p.tiles, p.slug).toBeTruthy();
      for (const r of p.related) expect(getPortugueseSyllablePage(r), `${p.slug} → ${r}`).toBeDefined();
    }
  });

  it("uses valid word markup, with each word read with its article", () => {
    for (const p of portugueseSyllablePages) {
      for (const w of p.words ?? []) {
        expect(w.word, p.slug).toMatch(/^[^[\]|]*(\[[^[\]|]+\][^[\]|]*)*$|^[^[\]]+(\|[^[\]|]+)*$/);
        expect(wordParts(w.word).map((x) => x.text).join(""), w.word).toBe(plainWord(w.word));
        expect(w.withArticle.toLowerCase(), w.word).toContain(plainWord(w.word).toLowerCase());
      }
    }
  });

  it("highlights only letters the page is about", () => {
    const marked = (slug: string) =>
      new Set((getPortugueseSyllablePage(slug)!.words ?? []).flatMap((w) => wordParts(w.word).filter((x) => x.mark).map((x) => x.text.toLowerCase())));
    expect(marked("ch")).toEqual(new Set(["ch"]));
    expect(marked("lh")).toEqual(new Set(["lh"]));
    expect(marked("nh")).toEqual(new Set(["nh"]));
    expect(marked("h-inicial")).toEqual(new Set(["h"]));
    expect(marked("encontros-com-l")).toEqual(new Set(["bl", "cl", "fl", "gl", "pl"]));
    expect(marked("encontros-com-r")).toEqual(new Set(["br", "dr", "fr", "pr", "tr", "vr"]));
    expect(marked("c-e-cedilha")).toEqual(new Set(["c", "ç"]));
    expect(marked("til")).toEqual(new Set(["ã", "ão", "õe"]));
  });

  it("builds words exactly from their syllables, with distinct decoys", () => {
    for (const p of portugueseSyllablePages) {
      for (const b of p.build ?? []) {
        expect(b.syllables.join(""), `${p.slug}: ${b.word}`).toBe(b.word);
        expect(b.extra.some((e) => b.syllables.includes(e)), `${b.word} decoys`).toBe(false);
        expect(new Set([...b.syllables, ...b.extra]).size, `${b.word} tiles`).toBe(b.syllables.length + b.extra.length);
      }
    }
  });

  it("asks to clap words of one to five syllables", () => {
    const clap = getPortugueseSyllablePage("contar-silabas")!.clap!;
    const counts = clap.map((w) => w.word.split("|").length);
    expect(Math.min(...counts)).toBe(1);
    expect(Math.max(...counts)).toBe(5);
  });

  it("has hunts with at least two right and two wrong pictures", () => {
    for (const p of portugueseSyllablePages.filter((x) => x.hunt)) {
      const items = p.hunt!.items;
      expect(items.filter((i) => i.answer).length, p.slug).toBeGreaterThanOrEqual(2);
      expect(items.filter((i) => !i.answer).length, p.slug).toBeGreaterThanOrEqual(2);
      expect(p.hunt!.yes, p.slug).toContain("{mot}");
    }
    expect(portugueseSyllablePages.filter((x) => x.hunt).length).toBeGreaterThanOrEqual(10);
  });

  it("gets the hunt answers right", () => {
    const hunt = (slug: string) => getPortugueseSyllablePage(slug)!.hunt!.items;
    const check = (slug: string, rule: (word: string) => boolean) => {
      for (const i of hunt(slug)) expect(rule(i.word), `${slug}: ${i.word}`).toBe(i.answer);
    };
    check("vogais", (x) => "aeiou".includes(strip(x)[0]));
    check("ch", (x) => /ch|x/.test(x)); // peixe: the x sounds like ch
    check("lh", (x) => x.includes("lh"));
    check("nh", (x) => x.includes("nh"));
    check("rr", (x) => /^r|rr/.test(x));
    check("ss", (x) => /[aeiouáéíóú]s[aeiou]/.test(x) && !x.includes("ss"));
    check("qu", (x) => /qu[ei]/.test(x));
    check("gu", (x) => /gu[ei]/.test(x) && x !== "pinguim"); // pinguim: the u is heard
    check("til", (x) => x.includes("ão"));
    check("encontros-com-r", (x) => /[bcdfgptv]r/.test(x));
    check("encontros-com-l", (x) => /[bcfgp]l/.test(x));
    check("al-el-il-ol-ul", (x) => /l($|[^aeiouh])/.test(x));
    check("c-e-cedilha", (x) => /c[ei]|ç/.test(x));
    check("g-e-j", (x) => /g[ei]|j/.test(x));
    check("x", (x) => ["xícara", "peixe", "caixa", "abacaxi"].includes(x));
  });

  it("uses Brazilian words, never Portugal-only ones", () => {
    for (const p of portugueseSyllablePages) {
      for (const text of allText(p)) {
        for (const word of PORTUGAL_ONLY) expect(strip(plainWord(text)).split(/[^a-z-]+/), `${p.slug}: ${word}`).not.toContain(word);
      }
    }
  });

  it("uses Brazilian spellings (bebê, not bebé)", () => {
    for (const p of portugueseSyllablePages) for (const text of allText(p)) expect(text, p.slug).not.toMatch(/bebé|ténis|António|facto/);
  });

  it("is written in Portuguese, not Spanish", () => {
    const spanish = /(?<!\p{L})(sílabas directas|consonante|también|niño|niña|oración|escuchar|mamá y papá|palabras|trabadas)(?!\p{L})/iu;
    for (const p of portugueseSyllablePages) for (const text of allText(p)) expect(text, p.slug).not.toMatch(spanish);
  });

  it("contains no look-alike letters from other alphabets", () => {
    const text = JSON.stringify([portugueseSyllablePages, portugueseLetters]);
    expect(text).not.toMatch(/[Ѐ-ӿ]|[Ͱ-Ͽ]/);
  });

  it("offers Portuguese consonants, digraphs and the five vowels in the builder", () => {
    expect(PT_BUILDER_VOWELS).toEqual(["a", "e", "i", "o", "u"]);
    expect(PT_BUILDER_CONSONANTS).toEqual(expect.arrayContaining(["p", "b", "m", "ch", "lh", "nh"]));
    expect(PT_BUILDER_CONSONANTS).not.toContain("ñ");
  });

  it("says family syllables with open vowels, as in class", () => {
    expect(["ba", "be", "bi", "bo", "bu"].map(ptSyllableSpoken)).toEqual(["ba", "bé", "bi", "bó", "bu"]);
    expect(ptSyllableSpoken("lhe")).toBe("lhé");
    expect(ptSyllableSpoken("ar")).toBe("ar");
  });
});

describe("Portuguese syllable routes", () => {
  it("accepts the Portuguese pages, and only them, under /pt/silabas", () => {
    for (const p of portugueseSyllablePages) expect(paramsExist("/phonics/[skill]", { skill: p.slug }, "pt"), p.slug).toBe(true);
    for (const skill of ["ou", "vocales", "silabas-directas", "blending", "nope"]) {
      expect(paramsExist("/phonics/[skill]", { skill }, "pt"), skill).toBe(false);
    }
    expect(paramsExist("/phonics/[skill]", { skill: "familias-silabicas" }, "es")).toBe(false);
    expect(paramsExist("/phonics/[skill]", { skill: "familias-silabicas" }, "en")).toBe(false);
  });

  it("gives Portuguese pages a canonical only, and pairs the index in four languages", () => {
    expect(isLocaleOnly("pt", "/phonics/[skill]", { skill: "lh" })).toBe(true);
    expect(alternatesFor("pt", "/phonics/[skill]", { skill: "ch" })).toEqual({ canonical: "https://alphabes.com/pt/silabas/ch" });
    expect(alternatesFor("pt", "/phonics").languages).toEqual({
      en: "https://alphabes.com/phonics",
      fr: "https://alphabes.com/fr/sons",
      es: "https://alphabes.com/es/silabas",
      pt: "https://alphabes.com/pt/silabas",
      "x-default": "https://alphabes.com/phonics",
    });
  });

  it("sends the switcher to the other language's index from a syllable page", () => {
    expect(counterpartPath(matchPath("/es/silabas")!, "pt")).toBe("/pt/silabas");
    // "ch" exists in Spanish and Portuguese, but the pages are not twins.
    expect(counterpartPath(matchPath("/pt/silabas/ch")!, "es")).toBeNull();
    expect(sectionFallbackPath(matchPath("/pt/silabas/ch")!, "es")).toBe("/es/silabas");
    expect(sectionFallbackPath(matchPath("/fr/sons/ou")!, "pt")).toBe("/pt/silabas");
  });
});
