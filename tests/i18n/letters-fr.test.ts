import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, isLocaleOnly, localizedPath, matchPath } from "@/lib/i18n/routes";
import {
  ACCENTS_SLUG,
  frenchLetterParams,
  frenchLetters,
  frenchNeighbors,
  getFrenchLetter,
  isAccentLetter,
} from "@/lib/letters-fr";
import { pickVoice } from "@/lib/speech";

describe("French letter data", () => {
  it("has the 26 letters in order, then é, è, ê, ç", () => {
    expect(frenchLetters.map((l) => l.lower).join("")).toBe("abcdefghijklmnopqrstuvwxyzéèêç");
    expect(new Set(frenchLetters.map((l) => l.slug)).size).toBe(frenchLetters.length);
  });

  it("gives every letter a name, two words with a picture, and parent notes", () => {
    for (const l of frenchLetters) {
      expect(l.upper, l.slug).toBe(l.lower.toUpperCase());
      expect(l.words, l.slug).toHaveLength(2);
      for (const w of [...l.words, ...(l.wordsInside ?? [])]) {
        expect(w.emoji, w.word).not.toBe("");
        expect(w.withArticle.toLowerCase(), w.word).toContain(w.word.toLowerCase());
      }
      expect(l.name && l.sound && l.tip && l.soundSpoken && l.faq.answer, l.slug).toBeTruthy();
    }
  });

  it("links related letters that exist", () => {
    for (const l of frenchLetters) {
      for (const slug of l.related ?? []) expect(slug === ACCENTS_SLUG || !!getFrenchLetter(slug), slug).toBe(true);
    }
  });

  it("explains on the E page that escargot and elfe start with è", () => {
    const e = getFrenchLetter("e")!;
    expect(e.words.map((w) => w.word)).toEqual(["Escargot", "Elfe"]);
    expect(e.tip).toContain("[ɛ]");
  });

  it("finds letters by param, uppercase included for the 26", () => {
    expect(getFrenchLetter("A")?.slug).toBe("a");
    expect(getFrenchLetter("c-cedille")?.lower).toBe("ç");
    expect(getFrenchLetter("C-CEDILLE")).toBeUndefined();
    expect(getFrenchLetter("é")).toBeUndefined();
  });

  it("walks through the letters in a loop", () => {
    expect(frenchNeighbors("a").prev.slug).toBe("c-cedille");
    expect(frenchNeighbors("z").next.slug).toBe("e-accent-aigu");
  });
});

describe("French alphabet routes", () => {
  const letterParams = [...frenchLetterParams(), ACCENTS_SLUG];

  it("accepts every prerendered French letter page, and only those", () => {
    for (const letter of letterParams) expect(paramsExist("/alphabet/[letter]", { letter }, "fr"), letter).toBe(true);
    for (const letter of frenchLetterParams())
      expect(paramsExist("/alphabet/[letter]/worksheet", { letter }, "fr"), letter).toBe(true);
    expect(paramsExist("/alphabet/[letter]/worksheet", { letter: ACCENTS_SLUG }, "fr")).toBe(false);
    expect(paramsExist("/alphabet/[letter]", { letter: "does-not-exist" }, "fr")).toBe(false);
  });

  it("keeps French-only letters out of English", () => {
    for (const l of frenchLetters.filter(isAccentLetter)) {
      expect(paramsExist("/alphabet/[letter]", { letter: l.slug }, "en")).toBe(false);
      expect(paramsExist("/alphabet/[letter]/worksheet", { letter: l.slug }, "en")).toBe(false);
    }
    expect(paramsExist("/alphabet/[letter]", { letter: ACCENTS_SLUG }, "en")).toBe(false);
  });

  it("lists exactly the French-only letters in routes.ts", () => {
    const accentSlugs = frenchLetters.filter(isAccentLetter).map((l) => l.slug);
    for (const slug of [...accentSlugs, ACCENTS_SLUG]) expect(isLocaleOnly("fr", "/alphabet/[letter]", { letter: slug })).toBe(true);
    for (const slug of accentSlugs) expect(isLocaleOnly("fr", "/alphabet/[letter]/worksheet", { letter: slug })).toBe(true);
    for (const l of frenchLetters.filter((l) => !isAccentLetter(l)))
      expect(isLocaleOnly("fr", "/alphabet/[letter]", { letter: l.slug })).toBe(false);
  });

  it("pairs shared letters with hreflang, but not French-only ones", () => {
    expect(alternatesFor("fr", "/alphabet/[letter]", { letter: "b" }).languages).toEqual({
      en: "https://alphabes.com/alphabet/b",
      fr: "https://alphabes.com/fr/alphabet/b",
      "x-default": "https://alphabes.com/alphabet/b",
    });
    expect(alternatesFor("fr", "/alphabet/[letter]", { letter: "c-cedille" })).toEqual({
      canonical: "https://alphabes.com/fr/alphabet/c-cedille",
    });
    expect(localizedPath("fr", "/alphabet/[letter]/worksheet", { letter: "a" })).toBe("/fr/alphabet/a/fiche");
    expect(localizedPath("fr", "/flashcards")).toBe("/fr/imagier");
  });

  it("maps letter pages across languages, except French-only ones", () => {
    expect(counterpartPath(matchPath("/alphabet/b")!, "fr")).toBe("/fr/alphabet/b");
    expect(counterpartPath(matchPath("/fr/alphabet/b/fiche")!, "en")).toBe("/alphabet/b/worksheet");
    expect(counterpartPath(matchPath("/fr/alphabet/e-accent-aigu")!, "en")).toBeNull();
    expect(counterpartPath(matchPath("/fr/alphabet/accents")!, "en")).toBeNull();
  });
});

describe("pickVoice", () => {
  const voice = (lang: string, name = lang) => ({ lang, name }) as SpeechSynthesisVoice;

  it("prefers fr-FR, then any French voice, never another language", () => {
    expect(pickVoice([voice("en-US"), voice("fr-CA"), voice("fr-FR")], "fr")?.lang).toBe("fr-FR");
    expect(pickVoice([voice("en-US"), voice("fr_BE")], "fr")?.lang).toBe("fr_BE");
    expect(pickVoice([voice("en-US"), voice("en-GB")], "fr")).toBeNull();
  });

  it("picks the better voice of a language when there are several", () => {
    expect(pickVoice([voice("fr-FR", "Thomas"), voice("fr-FR", "Google français")], "fr")?.name).toBe("Google français");
  });
});
