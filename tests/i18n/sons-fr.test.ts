import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import {
  FRENCH_SOUND_SLUGS,
  alternatesFor,
  counterpartPath,
  isLocaleOnly,
  localizedPath,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";
import { phonicsSkills } from "@/lib/phonics-data";
import {
  SOUND_GROUPS,
  frenchSounds,
  getFrenchSound,
  orderedSounds,
  plainWord,
  soundNeighbors,
  wordParts,
} from "@/lib/sons-fr";

const allWords = (s: (typeof frenchSounds)[number]) => [...(s.words ?? []), ...(s.hunt?.items ?? [])];

describe("French sound data", () => {
  it("has unique slugs in a known group, each with parent notes and FAQ", () => {
    expect(new Set(frenchSounds.map((s) => s.slug)).size).toBe(frenchSounds.length);
    const groups = new Set(SOUND_GROUPS.map((g) => g.id));
    for (const s of frenchSounds) {
      expect(groups.has(s.group), s.slug).toBe(true);
      expect(s.title && s.metaTitle && s.summary && s.intro && s.tip && s.soundSpoken, s.slug).toBeTruthy();
      expect(s.faq.length, s.slug).toBeGreaterThanOrEqual(2);
      expect(s.words || s.tiles, `${s.slug} has something to listen to`).toBeTruthy();
    }
  });

  it("covers the planned CP sounds", () => {
    for (const slug of ["voyelles", "syllabes", "premier-son", "ou", "on", "an", "in", "oi", "ch", "gn", "eu", "ill", "mots-outils"])
      expect(getFrenchSound(slug), slug).toBeDefined();
  });

  it("gives every word a picture and an article form that says the word", () => {
    for (const s of frenchSounds) {
      for (const w of allWords(s)) {
        expect(w.emoji, w.word).not.toBe("");
        expect(w.withArticle.toLowerCase(), `${s.slug}: ${w.word}`).toContain(plainWord(w.word).toLowerCase());
      }
    }
  });

  it("marks the sound in every word (except on the syllable page, which splits them)", () => {
    for (const s of frenchSounds) {
      for (const w of s.words ?? []) {
        const marked = s.builder ? w.word.includes("|") : /\[[^\]]+\]/.test(w.word);
        expect(marked, `${s.slug}: ${w.word}`).toBe(true);
        expect(w.word.split("[").length, `${s.slug}: ${w.word} balanced`).toBe(w.word.split("]").length);
      }
    }
  });

  it("keeps markup out of the hunt words (the child must listen)", () => {
    for (const s of frenchSounds) for (const w of s.hunt?.items ?? []) expect(w.word, s.slug).toBe(plainWord(w.word));
  });

  it("has hunts with right and wrong cards and feedback that names the word", () => {
    for (const s of frenchSounds) {
      if (!s.hunt) continue;
      expect(s.hunt.items.some((i) => i.answer) && s.hunt.items.some((i) => !i.answer), s.slug).toBe(true);
      expect(s.hunt.yes.includes("{mot}") && s.hunt.no.includes("{mot}"), s.slug).toBe(true);
      expect(new Set(s.hunt.items.map((i) => i.word)).size, s.slug).toBe(s.hunt.items.length);
    }
  });

  it("never asks the speech engine for a lone letter pair it would spell out", () => {
    // "gn", "ch", "oi", "in"... read on their own come out as letter names.
    for (const s of frenchSounds) expect(s.soundSpoken, s.slug).not.toMatch(/^(gn|ch|oi|in|ill)\b/i);
  });

  it("links related pages that exist, never itself", () => {
    for (const s of frenchSounds) {
      for (const r of s.related) {
        expect(getFrenchSound(r), `${s.slug} → ${r}`).toBeDefined();
        expect(r).not.toBe(s.slug);
      }
    }
  });

  it("splits markup into parts", () => {
    expect(wordParts("l[ou]p")).toEqual([
      { text: "l", mark: false },
      { text: "ou", mark: true },
      { text: "p", mark: false },
    ]);
    expect(wordParts("to|ma|te").map((p) => p.mark)).toEqual([false, true, false]);
    expect(plainWord("c[on]c[om]bre")).toBe("concombre");
  });

  it("walks through the pages in index order, without wrapping", () => {
    const order = orderedSounds().map((s) => s.slug);
    expect(order[0]).toBe("voyelles");
    expect(soundNeighbors(order[0]).prev).toBeUndefined();
    expect(soundNeighbors(order.at(-1)!).next).toBeUndefined();
    expect(soundNeighbors("premier-son").prev?.slug).toBe("voyelles");
  });
});

describe("French sound routes", () => {
  it("lists exactly the sound pages in routes.ts", () => {
    expect([...FRENCH_SOUND_SLUGS].sort()).toEqual(frenchSounds.map((s) => s.slug).sort());
    for (const slug of FRENCH_SOUND_SLUGS) expect(isLocaleOnly("fr", "/phonics/[skill]", { skill: slug })).toBe(true);
  });

  it("accepts French sounds only in French, English skills only in English", () => {
    for (const s of frenchSounds) {
      expect(paramsExist("/phonics/[skill]", { skill: s.slug }, "fr"), s.slug).toBe(true);
      if (!phonicsSkills.some((p) => p.slug === s.slug))
        expect(paramsExist("/phonics/[skill]", { skill: s.slug }, "en"), s.slug).toBe(false);
    }
    for (const p of phonicsSkills) expect(paramsExist("/phonics/[skill]", { skill: p.slug }, "fr"), p.slug).toBe(false);
  });

  it("pairs the index pages, but no skill page", () => {
    expect(localizedPath("fr", "/phonics/[skill]", { skill: "ou" })).toBe("/fr/sons/ou");
    expect(alternatesFor("fr", "/phonics").languages).toEqual({
      en: "https://alphabes.com/phonics",
      fr: "https://alphabes.com/fr/sons",
      "x-default": "https://alphabes.com/phonics",
    });
    expect(alternatesFor("fr", "/phonics/[skill]", { skill: "ou" })).toEqual({ canonical: "https://alphabes.com/fr/sons/ou" });
    expect(alternatesFor("en", "/phonics/[skill]", { skill: "blending" })).toEqual({
      canonical: "https://alphabes.com/phonics/blending",
    });
    expect(counterpartPath(matchPath("/phonics")!, "fr")).toBe("/fr/sons");
    expect(counterpartPath(matchPath("/fr/sons/ou")!, "en")).toBeNull();
    expect(counterpartPath(matchPath("/phonics/blending")!, "fr")).toBeNull();
  });

  it("sends the switcher to the other language's section index", () => {
    expect(sectionFallbackPath(matchPath("/fr/sons/ou")!, "en")).toBe("/phonics");
    expect(sectionFallbackPath(matchPath("/phonics/blending")!, "fr")).toBe("/fr/sons");
    expect(sectionFallbackPath(matchPath("/fr/alphabet/c-cedille")!, "en")).toBe("/alphabet");
    expect(sectionFallbackPath(matchPath("/blog/some-post")!, "fr")).toBeNull();
  });
});
