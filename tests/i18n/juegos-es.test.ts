import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getGame } from "@/lib/games-data";
import { getKindergartenTopic } from "@/lib/kindergarten-data";
import { getPreschoolTopic } from "@/lib/preschool-data";
import { FIRST_SYLLABLE_WORDS } from "@/lib/fichas-es";
import {
  ALPHABET,
  CLAP_WORDS,
  FIRST_SYLLABLE_POOL,
  clapWords,
  findLetterRound,
  firstLetter,
  firstSyllableRound,
  letterPictureRound,
  plain,
  quizQuestion,
  soundAlike,
  spanishGames,
  syllableSound,
  syllablesOf,
} from "@/lib/juegos-es";
import { SCHOOL_HUBS_ES, schoolTopicsEs, topicsOfEs } from "@/lib/escuela-es";
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
/** The sound a word starts with: "lla" for yate, "e" for helado. */
const onset = (word: string) => syllableSound(syllablesOf(word)[0]).match(/^(ll|ch|[a-zñ])/)![0];
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

describe("Spanish games data", () => {
  it("has six games: five twins of the English games and «Aplaude las sílabas»", () => {
    expect(spanishGames.map((g) => g.slug)).toEqual([
      "encuentra-la-letra", "letra-y-dibujo", "primera-silaba", "traza-la-letra", "quiz-del-abecedario", "aplaude-las-silabas",
    ]);
    const groups = TRANSLATED_PARAMS["/games/[slug]"]!.groups;
    for (const g of spanishGames.filter((x) => x.en)) {
      expect(getGame(g.en!), g.slug).not.toBeNull();
      expect(groups.find((group) => group.en === g.en)?.es).toBe(g.slug);
    }
    expect(groups.filter((group) => group.es)).toHaveLength(5);
    expect(groups.some((group) => group.es === "aplaude-las-silabas")).toBe(false);
  });

  it("uses the 27 letters, ñ after n", () => {
    expect(ALPHABET.map((l) => l.lower).join("")).toBe("abcdefghijklmnñopqrstuvwxyz");
  });

  it("hears syllables the Latin American way", () => {
    const same = [["ba", "va"], ["ca", "ka"], ["que", "ke"], ["ce", "se"], ["ce", "ze"], ["ge", "je"], ["gi", "ji"], ["ya", "lla"], ["he", "e"]];
    for (const [a, b] of same) expect(syllableSound(a), `${a}/${b}`).toBe(syllableSound(b));
    const different = [["ga", "ja"], ["gue", "ge"], ["ca", "ce"], ["pa", "ba"], ["ma", "na"], ["lo", "lu"]];
    for (const [a, b] of different) expect(syllableSound(a), `${a}/${b}`).not.toBe(syllableSound(b));
    expect(soundAlike("b", "v")).toBe(true);
    expect(soundAlike("h", "e")).toBe(true);
    expect(soundAlike("m", "n")).toBe(false);
  });

  it("Encuentra la letra: the target appears exactly once among distinct letters, look-alikes included", () => {
    let withEnie = 0;
    for (let i = 0; i < RUNS; i++) {
      const { letter, grid } = findLetterRound();
      expect(grid).toHaveLength(16);
      expect(new Set(grid).size).toBe(16);
      expect(grid.filter((s) => s === letter.slug)).toHaveLength(1);
      for (const s of grid) expect(ALPHABET.some((l) => l.slug === s), s).toBe(true);
      if (letter.slug === "n") expect(grid).toContain("enie");
      if (grid.includes("enie")) withEnie++;
    }
    expect(withEnie).toBeGreaterThan(0);
  });

  it("La letra y el dibujo: only the answer starts with the letter, or with a sound it could make", () => {
    for (let i = 0; i < RUNS; i++) {
      const { letter, answer, choices } = letterPictureRound();
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(answer);
      expect(FIRST_SYLLABLE_WORDS[letter.slug]).toContain(answer);
      for (const w of choices) {
        if (w === answer) continue;
        expect(soundAlike(firstLetter(w), letter.lower), `${letter.lower}: ${w.word}`).toBe(false);
        expect(onset(w.word), `${answer.word} / ${w.word}`).not.toBe(onset(answer.word));
      }
    }
  });

  it("¿Con qué sílaba empieza?: four syllables that never sound alike, the answer heard as written", () => {
    expect(FIRST_SYLLABLE_POOL.length).toBeGreaterThan(40);
    for (const w of FIRST_SYLLABLE_POOL) {
      const first = syllablesOf(w.word)[0];
      expect(first, w.word).toMatch(/^[a-zñ]*[aeiou]$/);
      expect(first, w.word).not.toMatch(/^(h|k|q|c[ei]|g[ei])/);
    }
    for (let i = 0; i < RUNS; i++) {
      const { word, answer, choices } = firstSyllableRound();
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(answer);
      expect(answer).toBe(syllablesOf(word.word)[0]);
      expect(new Set(choices.map(syllableSound)).size, choices.join(" ")).toBe(4);
      for (const c of choices) expect(["yi", "ze", "zi"]).not.toContain(c);
      // A wrong choice with the same consonant and another vowel, so the vowel must be heard.
      const consonant = answer.slice(0, -1);
      expect(choices.some((c) => c !== answer && c.slice(0, -1) === consonant), choices.join(" ")).toBe(true);
    }
  });

  it("Aplaude las sílabas: well-split words, every count from 1 to 5", () => {
    for (const w of CLAP_WORDS) {
      for (const syl of syllablesOf(w.word)) expect(syl, w.word).toMatch(/[aeiouáéíóú]/);
      expect(plain(w.word), w.word).not.toMatch(/\s/);
    }
    for (let i = 0; i < 50; i++) {
      const words = clapWords(10);
      expect(words).toHaveLength(10);
      expect(new Set(words).size).toBe(10);
      expect(new Set(words.map((w) => syllablesOf(w.word).length))).toEqual(new Set([1, 2, 3, 4, 5]));
    }
  });

  it("quiz: the answer is one of the choices, and picture questions never offer two letters for one sound", () => {
    const kinds = new Set<string>();
    for (let i = 0; i < RUNS; i++) {
      const q = quizQuestion();
      kinds.add(q.kind);
      expect(q.choices, q.prompt).toContain(q.answer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
      if (q.kind === "picture") {
        expect(strip(q.label!).charAt(0)).toBe(q.answer.toLowerCase());
        const lower = q.choices.map((c) => c.toLowerCase());
        for (const a of lower) for (const b of lower) if (a !== b) expect(soundAlike(a, b), lower.join(" ")).toBe(false);
      }
    }
    expect([...kinds].sort()).toEqual(["after", "heard", "picture", "vowel"]);
  });
});

describe("Spanish school topics", () => {
  it("pairs exactly the topics with an English twin", () => {
    for (const level of ["preescolar", "kinder"] as const) {
      const pathname = SCHOOL_HUBS_ES[level].topicPathname;
      const pairs = TRANSLATED_PARAMS[pathname]!.groups.filter((g) => g.en && g.es).map((g) => [g.en!, g.es!]);
      const twins = topicsOfEs(level).filter((t) => t.en);
      expect(pairs.sort()).toEqual(twins.map((t) => [t.en!, t.slug]).sort());
      const exists = level === "preescolar" ? getPreschoolTopic : getKindergartenTopic;
      for (const t of twins) expect(exists(t.en!), t.en).not.toBeNull();
    }
    expect(topicsOfEs("preescolar").map((t) => t.slug)).toEqual(["trazos", "traza-las-letras", "colorear"]);
    expect(topicsOfEs("kinder").map((t) => t.slug)).toEqual(["silabas", "palabras-frecuentes", "letra-cursiva"]);
  });

  it("links only to Spanish pages that exist", () => {
    const links = [
      ...schoolTopicsEs.flatMap((t) => t.links),
      ...Object.values(SCHOOL_HUBS_ES).flatMap((h) => h.resources),
    ];
    for (const l of links) {
      const path = localizedPath("es", l.pathname, l.params);
      const m = matchPath(path)!;
      expect(m, path).not.toBeNull();
      expect(m.locale).toBe("es");
      expect(paramsExist(m.pathname, m.params, "es"), path).toBe(true);
    }
  });

  it("accepts Spanish slugs only in Spanish", () => {
    expect(paramsExist("/preschool/[topic]", { topic: "trazos" }, "es")).toBe(true);
    expect(paramsExist("/preschool/[topic]", { topic: "trazos" }, "en")).toBe(false);
    expect(paramsExist("/preschool/[topic]", { topic: "trazos" }, "fr")).toBe(false);
    expect(paramsExist("/preschool/[topic]", { topic: "coloring" }, "es")).toBe(false);
    expect(paramsExist("/preschool/[topic]", { topic: "coloriage" }, "es")).toBe(false);
    expect(paramsExist("/kindergarten/[topic]", { topic: "silabas" }, "es")).toBe(true);
    expect(paramsExist("/games/[slug]", { slug: "aplaude-las-silabas" }, "es")).toBe(true);
    expect(paramsExist("/games/[slug]", { slug: "aplaude-las-silabas" }, "en")).toBe(false);
    expect(paramsExist("/games/[slug]", { slug: "find-the-letter" }, "es")).toBe(false);
    expect(paramsExist("/games/[slug]", { slug: "trouve-la-lettre" }, "es")).toBe(false);
  });
});

describe("Spanish games and school pages in routes", () => {
  it("gives twins hreflang in three languages", () => {
    expect(alternatesFor("es", "/games/[slug]", { slug: "primera-silaba" }).languages).toEqual({
      en: "https://alphabes.com/games/beginning-sound",
      fr: "https://alphabes.com/fr/jeux/premier-son",
      es: "https://alphabes.com/es/juegos/primera-silaba",
      "x-default": "https://alphabes.com/games/beginning-sound",
    });
    expect(alternatesFor("fr", "/preschool/[topic]", { topic: "coloriage" }).languages?.es).toBe(
      "https://alphabes.com/es/preescolar/colorear",
    );
    expect(alternatesFor("es", "/activities").languages?.fr).toBe("https://alphabes.com/fr/activites");
  });

  it("keeps Spanish-only pages without hreflang", () => {
    expect(alternatesFor("es", "/games/[slug]", { slug: "aplaude-las-silabas" })).toEqual({
      canonical: "https://alphabes.com/es/juegos/aplaude-las-silabas",
    });
    expect(alternatesFor("es", "/kindergarten/[topic]", { topic: "silabas" })).toEqual({
      canonical: "https://alphabes.com/es/kinder/silabas",
    });
    // French-only topics don't gain a Spanish alternate.
    expect(alternatesFor("fr", "/preschool/[topic]", { topic: "graphisme" })).toEqual({
      canonical: "https://alphabes.com/fr/maternelle/graphisme",
    });
  });

  it("maps pages for the language switcher", () => {
    expect(counterpartPath(matchPath("/games/letter-tracing")!, "es")).toBe("/es/juegos/traza-la-letra");
    expect(counterpartPath(matchPath("/es/kinder/letra-cursiva")!, "fr")).toBe("/fr/grande-section/ecriture-cursive");
    expect(counterpartPath(matchPath("/es/juegos/aplaude-las-silabas")!, "en")).toBeNull();
    expect(sectionFallbackPath(matchPath("/es/juegos/aplaude-las-silabas")!, "en")).toBe("/games");
    expect(sectionFallbackPath(matchPath("/fr/maternelle/graphisme")!, "es")).toBe("/es/preescolar");
    expect(counterpartPath(matchPath("/activities")!, "es")).toBe("/es/actividades");
  });
});

describe("Spanish wording", () => {
  // Words that change from one country to another (docs/spanish-plan.md, D2),
  // checked with their accents ("papá" is fine, "papa" isn't).
  const REGIONAL = [
    "carro", "coche", "plátano", "banana", "fresa", "frutilla", "durazno", "melocotón", "jugo", "zumo", "pastel",
    "torta", "papa", "patata", "piña", "ananá", "computadora", "ordenador", "coger", "camión", "pasto", "césped",
    "gis", "tiza", "plumón", "plumones", "rotulador", "frijol", "frijoles", "poroto", "lotería", "memorama",
    "platicar", "platica", "súper", "calcomanía", "calcomanías", "pegatina", "calcetín", "preparatoria",
    "crayola", "crayolas", "mariquita", "catarina", "celular", "móvil", "vosotros", "podéis",
  ];
  const files = [
    "lib/juegos-es.ts",
    "lib/escuela-es.ts",
    "app/[locale]/games/games-es.tsx",
    "app/[locale]/games/[slug]/game-es.tsx",
    "app/[locale]/activities/activities-es.tsx",
    ...readdirSync("components/juegos-es").map((f) => join("components/juegos-es", f)),
    "components/escuela/SchoolHubEs.tsx",
    "components/escuela/SchoolTopicEs.tsx",
  ];
  // Only the text in string literals and JSX, not the code or comments.
  const textOf = (file: string) =>
    readFileSync(file, "utf8")
      .split("\n")
      .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
      .join("\n");

  it("avoids regional words", () => {
    for (const file of files) {
      const words = textOf(file).toLowerCase().match(/\p{L}+/gu) ?? [];
      for (const w of words) expect(REGIONAL, `${file}: ${w}`).not.toContain(w);
    }
  });

  it("opens every question and exclamation", () => {
    const texts = [
      ...spanishGames.flatMap((g) => [g.title, g.description, g.forParents]),
      ...schoolTopicsEs.flatMap((t) => [t.title, t.summary, ...t.intro, ...t.tips, t.activity.title, t.activity.material, ...t.activity.steps]),
      ...Object.values(SCHOOL_HUBS_ES).flatMap((h) => [h.title, h.intro, ...h.faq.flatMap((f) => [f.question, f.answer])]),
    ];
    for (const t of texts) {
      expect(t.split("?").length, t).toBe(t.split("¿").length);
      expect(t.split("!").length, t).toBe(t.split("¡").length);
      expect(t, "no look-alike Cyrillic letters").not.toMatch(/[Ѐ-ӿ]/);
    }
  });
});
