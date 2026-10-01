import { describe, expect, it } from "vitest";
import { getGame } from "@/lib/games-data";
import { getKindergartenTopic } from "@/lib/kindergarten-data";
import { getPreschoolTopic } from "@/lib/preschool-data";
import { LETTER_IMAGES } from "@/lib/fiches-fr";
import {
  ALPHABET,
  findLetterRound,
  firstSoundRound,
  frenchGames,
  letterPictureRound,
  quizQuestion,
} from "@/lib/games-fr";
import { SCHOOL_HUBS, schoolTopics, topicsOf } from "@/lib/ecole-fr";
import { paramsExist } from "@/lib/i18n/known-params";
import {
  TRANSLATED_PARAMS,
  alternatesFor,
  counterpartPath,
  localizedPath,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";

const RUNS = 300;
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

describe("French games data", () => {
  it("has five games, each paired with an English game", () => {
    expect(frenchGames).toHaveLength(5);
    for (const g of frenchGames) {
      expect(getGame(g.en), g.slug).not.toBeNull();
      expect(TRANSLATED_PARAMS["/games/[slug]"]!.groups.find((group) => group.en === g.en)?.fr).toBe(g.slug);
    }
    expect(TRANSLATED_PARAMS["/games/[slug]"]!.groups.filter((group) => group.fr)).toHaveLength(frenchGames.length);
  });

  it("uses the 26 letters of the alphabet, in order", () => {
    expect(ALPHABET.map((l) => l.lower).join("")).toBe("abcdefghijklmnopqrstuvwxyz");
  });

  it("Trouve la lettre: the target appears exactly once among distinct letters", () => {
    for (let i = 0; i < RUNS; i++) {
      const { letter, grid } = findLetterRound();
      expect(grid).toHaveLength(16);
      expect(new Set(grid).size).toBe(16);
      expect(grid.filter((s) => s === letter.slug)).toHaveLength(1);
    }
  });

  it("Lettre et image: only the answer starts with the letter", () => {
    for (let i = 0; i < RUNS; i++) {
      const { letter, answer, choices } = letterPictureRound();
      expect(choices).toHaveLength(4);
      expect(choices).toContain(answer);
      for (const w of choices) expect(strip(w.word).startsWith(letter.lower), `${letter.lower}: ${w.word}`).toBe(w === answer);
    }
  });

  it("Le premier son: four letters whose sounds can't be confused", () => {
    for (let i = 0; i < RUNS; i++) {
      const { word, answer, choices } = firstSoundRound();
      expect(choices).toHaveLength(4);
      expect(choices).toContain(answer);
      expect(LETTER_IMAGES[answer.slug].yes).toContain(word);
      // Letters whose first sound isn't clear by ear are never asked or offered.
      for (const l of choices) expect(["c", "k", "q", "e", "y", "h", "w", "x"]).not.toContain(l.slug);
      const keys = choices.map((l) => LETTER_IMAGES[l.slug].key);
      expect(new Set(keys).size).toBe(4);
      expect(keys.includes("s") && keys.includes("z")).toBe(false);
      expect(keys.includes("k") && keys.includes("g")).toBe(false);
    }
  });

  it("quiz: the answer is always one of the choices", () => {
    const kinds = new Set<string>();
    for (let i = 0; i < RUNS; i++) {
      const q = quizQuestion();
      kinds.add(q.kind);
      expect(q.choices, q.prompt).toContain(q.answer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
      if (q.kind === "picture") {
        expect(strip(q.label!).charAt(0)).toBe(q.answer.toLowerCase());
        // Never two letters for the same sound (C and K for "koala").
        const keys = q.choices.map((c) => LETTER_IMAGES[c.toLowerCase()].key);
        expect(new Set(keys).size).toBe(4);
      }
    }
    expect([...kinds].sort()).toEqual(["after", "heard", "picture", "vowel"]);
  });
});

describe("French school topics", () => {
  it("pairs exactly the topics with an English twin", () => {
    for (const level of ["maternelle", "grande-section"] as const) {
      const pathname = SCHOOL_HUBS[level].topicPathname;
      const pairs = TRANSLATED_PARAMS[pathname]!.groups.filter((g) => g.en && g.fr).map((g) => [g.en!, g.fr!]);
      const twins = topicsOf(level).filter((t) => t.en);
      expect(pairs.sort()).toEqual(twins.map((t) => [t.en!, t.slug]).sort());
      const exists = level === "maternelle" ? getPreschoolTopic : getKindergartenTopic;
      for (const t of twins) expect(exists(t.en!), t.en).not.toBeNull();
    }
  });

  it("has unique slugs and valid links", () => {
    for (const level of ["maternelle", "grande-section"] as const) {
      const slugs = topicsOf(level).map((t) => t.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    for (const t of schoolTopics) {
      for (const l of t.links) {
        const path = localizedPath("fr", l.pathname, l.params);
        const m = matchPath(path)!;
        expect(m, path).not.toBeNull();
        expect(paramsExist(m.pathname, m.params, "fr"), path).toBe(true);
      }
    }
  });

  it("accepts French topics only in French", () => {
    expect(paramsExist("/preschool/[topic]", { topic: "graphisme" }, "fr")).toBe(true);
    expect(paramsExist("/preschool/[topic]", { topic: "graphisme" }, "en")).toBe(false);
    expect(paramsExist("/preschool/[topic]", { topic: "coloring" }, "fr")).toBe(false);
    expect(paramsExist("/kindergarten/[topic]", { topic: "syllabes" }, "fr")).toBe(true);
    expect(paramsExist("/games/[slug]", { slug: "premier-son" }, "fr")).toBe(true);
    expect(paramsExist("/games/[slug]", { slug: "beginning-sound" }, "fr")).toBe(false);
  });
});

describe("translated params in routes", () => {
  it("gives twins hreflang to each other", () => {
    expect(alternatesFor("en", "/games/[slug]", { slug: "find-the-letter" })).toEqual({
      canonical: "https://alphabes.com/games/find-the-letter",
      languages: {
        en: "https://alphabes.com/games/find-the-letter",
        fr: "https://alphabes.com/fr/jeux/trouve-la-lettre",
        "x-default": "https://alphabes.com/games/find-the-letter",
      },
    });
    expect(alternatesFor("fr", "/kindergarten/[topic]", { topic: "mots-outils" }).languages).toEqual({
      en: "https://alphabes.com/kindergarten/sight-words",
      fr: "https://alphabes.com/fr/grande-section/mots-outils",
      "x-default": "https://alphabes.com/kindergarten/sight-words",
    });
  });

  it("keeps French-only topics without hreflang", () => {
    expect(alternatesFor("fr", "/preschool/[topic]", { topic: "graphisme" })).toEqual({
      canonical: "https://alphabes.com/fr/maternelle/graphisme",
    });
  });

  it("maps pages for the language switcher", () => {
    expect(counterpartPath(matchPath("/fr/jeux/quiz-alphabet")!, "en")).toBe("/games/alphabet-quiz");
    expect(counterpartPath(matchPath("/preschool/letter-tracing")!, "fr")).toBe("/fr/maternelle/tracer-les-lettres");
    expect(counterpartPath(matchPath("/fr/maternelle/graphisme")!, "en")).toBeNull();
    expect(sectionFallbackPath(matchPath("/fr/maternelle/graphisme")!, "en")).toBe("/preschool");
    expect(counterpartPath(matchPath("/activities")!, "fr")).toBe("/fr/activites");
  });
});
