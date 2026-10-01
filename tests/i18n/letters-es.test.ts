import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, isLocaleOnly, localizedPath, matchPath, sectionFallbackPath } from "@/lib/i18n/routes";
import {
  TILDE_SLUG,
  getSpanishLetter,
  letterWithWord,
  spanishLetterParams,
  spanishLetters,
  spanishNeighbors,
  tildeGroups,
} from "@/lib/letters-es";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const contains = (word: string, letter: string) => (letter === "ñ" ? word.toLowerCase().includes("ñ") : strip(word).includes(letter));

describe("Spanish letter data", () => {
  it("has the 27 letters in order, with ñ between n and o", () => {
    expect(spanishLetters.map((l) => l.lower).join("")).toBe("abcdefghijklmnñopqrstuvwxyz");
    expect(new Set(spanishLetters.map((l) => l.slug)).size).toBe(27);
  });

  it("uses the RAE letter names, with the Latin American ones as alternatives", () => {
    const names = Object.fromEntries(spanishLetters.map((l) => [l.lower, l.name]));
    expect(names).toMatchObject({
      b: "be", h: "hache", j: "jota", ñ: "eñe", q: "cu", r: "erre", v: "uve", w: "uve doble", x: "equis", y: "ye", z: "zeta",
    });
    expect(getSpanishLetter("v")!.otherNames).toContain("ve chica");
    expect(getSpanishLetter("w")!.otherNames).toEqual(expect.arrayContaining(["doble ve", "doble u"]));
    expect(getSpanishLetter("y")!.otherNames).toContain("i griega");
  });

  it("marks the five vowels", () => {
    expect(spanishLetters.filter((l) => l.kind === "vocal").map((l) => l.lower).join("")).toBe("aeiou");
  });

  it("gives every letter two pictured words containing it, and parent notes", () => {
    for (const l of spanishLetters) {
      expect(l.upper, l.slug).toBe(l.lower.toUpperCase());
      expect(l.words, l.slug).toHaveLength(2);
      for (const w of [...l.words, ...(l.wordsInside ?? [])]) {
        expect(w.emoji, w.word).not.toBe("");
        expect(contains(w.word, l.lower), `${l.lower} in ${w.word}`).toBe(true);
        expect(w.withArticle, w.word).toMatch(new RegExp(`^(un|una) ${w.word.toLowerCase()}$`));
      }
      expect(l.name && l.sound && l.tip && l.soundSpoken && l.faq.answer, l.slug).toBeTruthy();
    }
  });

  it("keeps the approved sample words", () => {
    const words = Object.fromEntries(spanishLetters.map((l) => [l.lower, l.words.map((w) => w.word).join(" ")]));
    expect(words).toMatchObject({
      a: "Avión Abeja", c: "Conejo Cereza", g: "Gato Girasol", ñ: "Araña Niño", w: "Kiwi Sándwich", z: "Zapato Zorro",
    });
  });

  it("avoids words that change from one country to another", () => {
    const regional = [
      "carro", "coche", "platano", "banana", "fresa", "frutilla", "durazno", "melocoton", "jugo", "zumo",
      "pastel", "torta", "papa", "patata", "pina", "anana", "computadora", "ordenador", "coger",
    ];
    for (const l of spanishLetters) {
      for (const w of [...l.words, ...(l.wordsInside ?? [])]) expect(regional, w.word).not.toContain(strip(w.word));
    }
  });

  it("links related letters that exist", () => {
    for (const l of spanishLetters) {
      for (const slug of l.related ?? []) expect(slug === TILDE_SLUG || !!getSpanishLetter(slug), slug).toBe(true);
    }
  });

  it("finds letters by param, uppercase included, ñ only as enie", () => {
    expect(getSpanishLetter("A")?.slug).toBe("a");
    expect(getSpanishLetter("enie")?.lower).toBe("ñ");
    expect(getSpanishLetter("ñ")).toBeUndefined();
    expect(getSpanishLetter("ENIE")).toBeUndefined();
    expect(spanishLetterParams()).toHaveLength(26 * 2 + 1);
  });

  it("walks through the letters in a loop, with ñ after n", () => {
    expect(spanishNeighbors("n").next.slug).toBe("enie");
    expect(spanishNeighbors("enie").next.slug).toBe("o");
    expect(spanishNeighbors("a").prev.slug).toBe("z");
  });

  it("says «A de avión», or «como en» when the word doesn't start with the letter", () => {
    const a = getSpanishLetter("a")!;
    const enie = getSpanishLetter("enie")!;
    expect(letterWithWord(a, a.words[0])).toBe("A de avión");
    expect(letterWithWord(enie, enie.words[0])).toBe("Ñ, como en araña");
  });

  it("explains the tilde and the diéresis on one page", () => {
    expect(tildeGroups.map((g) => g.id)).toEqual(["tilde", "diacritica", "dieresis"]);
    for (const g of tildeGroups) expect(g.examples.length, g.id).toBeGreaterThan(0);
  });
});

describe("Spanish alphabet routes", () => {
  it("accepts every prerendered Spanish letter page, and only those", () => {
    for (const letter of [...spanishLetterParams(), TILDE_SLUG]) {
      expect(paramsExist("/alphabet/[letter]", { letter }, "es"), letter).toBe(true);
    }
    for (const letter of spanishLetterParams()) {
      expect(paramsExist("/alphabet/[letter]/worksheet", { letter }, "es"), letter).toBe(true);
    }
    for (const letter of ["ñ", "c-cedille", "accents", "zz"]) {
      expect(paramsExist("/alphabet/[letter]", { letter }, "es"), letter).toBe(false);
    }
    expect(paramsExist("/alphabet/[letter]/worksheet", { letter: TILDE_SLUG }, "es")).toBe(false);
  });

  it("uses Spanish URLs", () => {
    expect(localizedPath("es", "/alphabet/[letter]", { letter: "enie" })).toBe("/es/abecedario/enie");
    expect(localizedPath("es", "/alphabet/[letter]/worksheet", { letter: "a" })).toBe("/es/abecedario/a/ficha");
    expect(localizedPath("es", "/flashcards")).toBe("/es/tarjetas");
  });

  it("pairs shared letters in three languages, but not ñ or the tilde page", () => {
    expect(alternatesFor("es", "/alphabet/[letter]", { letter: "b" }).languages).toEqual({
      en: "https://alphabes.com/alphabet/b",
      fr: "https://alphabes.com/fr/alphabet/b",
      es: "https://alphabes.com/es/abecedario/b",
      "x-default": "https://alphabes.com/alphabet/b",
    });
    expect(isLocaleOnly("es", "/alphabet/[letter]", { letter: "enie" })).toBe(true);
    expect(alternatesFor("es", "/alphabet/[letter]", { letter: "enie" })).toEqual({
      canonical: "https://alphabes.com/es/abecedario/enie",
    });
    expect(alternatesFor("es", "/alphabet/[letter]", { letter: TILDE_SLUG })).toEqual({
      canonical: "https://alphabes.com/es/abecedario/tilde",
    });
  });

  it("maps letter pages across languages, and sends ñ to the alphabet", () => {
    expect(counterpartPath(matchPath("/alphabet/b")!, "es")).toBe("/es/abecedario/b");
    expect(counterpartPath(matchPath("/es/abecedario/b/ficha")!, "fr")).toBe("/fr/alphabet/b/fiche");
    expect(counterpartPath(matchPath("/fr/imagier")!, "es")).toBe("/es/tarjetas");
    expect(counterpartPath(matchPath("/es/abecedario/enie")!, "en")).toBeNull();
    expect(sectionFallbackPath(matchPath("/es/abecedario/enie")!, "en")).toBe("/alphabet");
    expect(counterpartPath(matchPath("/fr/alphabet/c-cedille")!, "es")).toBeNull();
    expect(sectionFallbackPath(matchPath("/fr/alphabet/c-cedille")!, "es")).toBe("/es/abecedario");
  });
});
