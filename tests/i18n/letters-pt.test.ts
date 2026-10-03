import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, isLocaleOnly, localizedPath, matchPath, sectionFallbackPath } from "@/lib/i18n/routes";
import {
  ACENTOS_SLUG,
  CEDILHA_SLUG,
  acentoGroups,
  alphabetLetters,
  getPortugueseLetter,
  letterWithWord,
  portugueseLetterParams,
  portugueseLetters,
  portugueseNeighbors,
} from "@/lib/letters-pt";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const contains = (word: string, letter: string) => (letter === "ç" ? word.toLowerCase().includes("ç") : strip(word).includes(letter));

// Words used in Portugal but not in Brazil, or the other way round with a
// Portuguese spelling (docs/portuguese-plan.md, P2).
const PORTUGAL_ONLY = [
  "autocarro", "comboio", "frigorifico", "chavena", "ananas", "pequeno-almoco", "telemovel", "rebucado", "sumo",
  "gelado", "casa de banho", "bebe", "camiao", "rapariga", "miudo", "pastilha", "talho", "elastico",
];

describe("Portuguese letter data", () => {
  it("has the 26 letters in order, with Ç right after C", () => {
    expect(portugueseLetters.map((l) => l.lower).join("")).toBe("abcçdefghijklmnopqrstuvwxyz");
    expect(alphabetLetters).toHaveLength(26);
    expect(new Set(portugueseLetters.map((l) => l.slug)).size).toBe(27);
  });

  it("uses the Brazilian letter names", () => {
    const names = Object.fromEntries(portugueseLetters.map((l) => [l.lower, l.name]));
    expect(names).toEqual({
      a: "a", b: "bê", c: "cê", ç: "cê-cedilha", d: "dê", e: "é", f: "efe", g: "gê", h: "agá", i: "i", j: "jota", k: "cá",
      l: "ele", m: "eme", n: "ene", o: "ó", p: "pê", q: "quê", r: "erre", s: "esse", t: "tê", u: "u", v: "vê",
      w: "dáblio", x: "xis", y: "ípsilon", z: "zê",
    });
    expect(getPortugueseLetter("y")!.otherNames).toContain("i grego");
  });

  it("marks the five vowels", () => {
    expect(portugueseLetters.filter((l) => l.kind === "vogal").map((l) => l.lower).join("")).toBe("aeiou");
  });

  it("gives every letter two pictured words containing it, and parent notes", () => {
    for (const l of portugueseLetters) {
      expect(l.upper, l.slug).toBe(l.lower.toUpperCase());
      expect(l.words, l.slug).toHaveLength(2);
      for (const w of [...l.words, ...(l.wordsInside ?? [])]) {
        expect(w.emoji, w.word).not.toBe("");
        expect(contains(w.word, l.lower), `${l.lower} in ${w.word}`).toBe(true);
        expect(w.withArticle.toLowerCase(), w.word).toContain(w.word.toLowerCase());
      }
      expect(l.name && l.sound && l.tip && l.soundSpoken && l.faq.answer, l.slug).toBeTruthy();
    }
  });

  it("keeps the approved sample words", () => {
    const words = Object.fromEntries(portugueseLetters.map((l) => [l.lower, l.words.map((w) => w.word).join(" ")]));
    expect(words).toEqual({
      a: "Abelha Avião", b: "Bola Baleia", c: "Casa Cebola", ç: "Maçã Palhaço", d: "Dado Dente", e: "Elefante Estrela",
      f: "Foca Flor", g: "Gato Girafa", h: "Helicóptero Hipopótamo", i: "Iguana Ilha", j: "Jacaré Janela",
      k: "Kiwi Karaokê", l: "Leão Lua", m: "Macaco Mala", n: "Navio Nuvem", o: "Ovo Ovelha", p: "Pato Peixe",
      q: "Queijo Quatro", r: "Rato Relógio", s: "Sapo Sol", t: "Tartaruga Tomate", u: "Uva Urso", v: "Vaca Vulcão",
      w: "Kiwi Waffle", x: "Xícara Abacaxi", y: "Yakisoba Yoga", z: "Zebra Zero",
    });
  });

  it("uses Brazilian words, never Portugal-only ones", () => {
    const texts = portugueseLetters.flatMap((l) => [
      ...[...l.words, ...(l.wordsInside ?? [])].flatMap((w) => [w.word, w.withArticle]),
      l.sound, l.tip, l.faq.question, l.faq.answer,
    ]);
    for (const text of texts) {
      for (const word of PORTUGAL_ONLY) expect(strip(text).split(/[^a-z-]+/), `${word} in "${text}"`).not.toContain(word);
    }
  });

  it("is written in Portuguese, not Spanish", () => {
    const spanish = /\b(como en|consonante|letra de molde|niño|también|sílabas directas|mamá y papá)\b/i;
    for (const l of portugueseLetters) {
      for (const text of [l.sound, l.tip, l.faq.question, l.faq.answer, l.soundSpoken]) expect(text, l.slug).not.toMatch(spanish);
    }
  });

  it("links related letters that exist", () => {
    for (const l of portugueseLetters) {
      for (const slug of l.related ?? []) expect(slug === ACENTOS_SLUG || !!getPortugueseLetter(slug), slug).toBe(true);
    }
  });

  it("finds letters by param, uppercase included, ç only as c-cedilha", () => {
    expect(getPortugueseLetter("A")?.slug).toBe("a");
    expect(getPortugueseLetter(CEDILHA_SLUG)?.lower).toBe("ç");
    expect(getPortugueseLetter("ç")).toBeUndefined();
    expect(getPortugueseLetter("Ç")).toBeUndefined();
    expect(portugueseLetterParams()).toHaveLength(26 * 2 + 1);
  });

  it("walks through the letters in a loop, with Ç between C and D", () => {
    expect(portugueseNeighbors("c").next.slug).toBe(CEDILHA_SLUG);
    expect(portugueseNeighbors(CEDILHA_SLUG).next.slug).toBe("d");
    expect(portugueseNeighbors("a").prev.slug).toBe("z");
  });

  it("says “A de abelha”, or “como em” when the word doesn't start with the letter", () => {
    const a = getPortugueseLetter("a")!;
    const c = getPortugueseLetter(CEDILHA_SLUG)!;
    const x = getPortugueseLetter("x")!;
    expect(letterWithWord(a, a.words[0])).toBe("A de abelha");
    expect(letterWithWord(c, c.words[0])).toBe("Ç, como em maçã");
    expect(letterWithWord(x, x.words[1])).toBe("X, como em abacaxi");
  });

  it("explains the accents and the til on one page", () => {
    expect(acentoGroups.map((g) => g.id)).toEqual(["agudo", "circunflexo", "til", "grave"]);
    for (const g of acentoGroups) {
      expect(g.examples.length, g.id).toBeGreaterThan(0);
      // Each example shows one of its group's marks.
      for (const ex of g.examples) expect([...g.marks].some((m) => m.trim() && ex.text.includes(m)), ex.text).toBe(true);
    }
  });
});

describe("Portuguese alphabet routes", () => {
  it("accepts every prerendered Portuguese letter page, and only those", () => {
    for (const letter of [...portugueseLetterParams(), ACENTOS_SLUG]) {
      expect(paramsExist("/alphabet/[letter]", { letter }, "pt"), letter).toBe(true);
    }
    for (const letter of portugueseLetterParams()) {
      expect(paramsExist("/alphabet/[letter]/worksheet", { letter }, "pt"), letter).toBe(true);
    }
    for (const letter of ["ç", "c-cedille", "enie", "tilde", "accents", "zz"]) {
      expect(paramsExist("/alphabet/[letter]", { letter }, "pt"), letter).toBe(false);
    }
    expect(paramsExist("/alphabet/[letter]/worksheet", { letter: ACENTOS_SLUG }, "pt")).toBe(false);
    // The Portuguese-only pages don't leak into the other languages.
    expect(paramsExist("/alphabet/[letter]", { letter: CEDILHA_SLUG }, "es")).toBe(false);
    expect(paramsExist("/alphabet/[letter]", { letter: ACENTOS_SLUG }, "es")).toBe(false);
  });

  it("uses Portuguese URLs", () => {
    expect(localizedPath("pt", "/alphabet/[letter]", { letter: CEDILHA_SLUG })).toBe("/pt/alfabeto/c-cedilha");
    expect(localizedPath("pt", "/alphabet/[letter]/worksheet", { letter: "a" })).toBe("/pt/alfabeto/a/atividade");
    expect(localizedPath("pt", "/flashcards")).toBe("/pt/cartoes");
  });

  it("pairs shared letters in four languages, but not Ç or the accents page", () => {
    expect(alternatesFor("pt", "/alphabet/[letter]", { letter: "b" }).languages).toEqual({
      en: "https://alphabes.com/alphabet/b",
      fr: "https://alphabes.com/fr/alphabet/b",
      es: "https://alphabes.com/es/abecedario/b",
      pt: "https://alphabes.com/pt/alfabeto/b",
      "x-default": "https://alphabes.com/alphabet/b",
    });
    expect(isLocaleOnly("pt", "/alphabet/[letter]", { letter: CEDILHA_SLUG })).toBe(true);
    expect(alternatesFor("pt", "/alphabet/[letter]", { letter: CEDILHA_SLUG })).toEqual({
      canonical: "https://alphabes.com/pt/alfabeto/c-cedilha",
    });
    expect(alternatesFor("pt", "/alphabet/[letter]", { letter: ACENTOS_SLUG })).toEqual({
      canonical: "https://alphabes.com/pt/alfabeto/acentos",
    });
  });

  it("maps letter pages across languages, and sends Ç to the alphabet", () => {
    expect(counterpartPath(matchPath("/alphabet/b")!, "pt")).toBe("/pt/alfabeto/b");
    expect(counterpartPath(matchPath("/pt/alfabeto/b/atividade")!, "es")).toBe("/es/abecedario/b/ficha");
    expect(counterpartPath(matchPath("/es/tarjetas")!, "pt")).toBe("/pt/cartoes");
    expect(counterpartPath(matchPath("/pt/alfabeto/c-cedilha")!, "fr")).toBeNull();
    expect(sectionFallbackPath(matchPath("/pt/alfabeto/c-cedilha")!, "fr")).toBe("/fr/alphabet");
    expect(counterpartPath(matchPath("/es/abecedario/enie")!, "pt")).toBeNull();
    expect(sectionFallbackPath(matchPath("/es/abecedario/enie")!, "pt")).toBe("/pt/alfabeto");
  });
});
