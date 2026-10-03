import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getGame } from "@/lib/games-data";
import { getKindergartenTopic } from "@/lib/kindergarten-data";
import { getPreschoolTopic } from "@/lib/preschool-data";
import { FIRST_SYLLABLE_WORDS } from "@/lib/atividades-pt";
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
  portugueseGames,
  quizQuestion,
  soundAlike,
  syllableSound,
  syllablesOf,
} from "@/lib/jogos-pt";
import { SCHOOL_HUBS_PT, schoolTopicsPt, topicsOfPt } from "@/lib/escola-pt";
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
/** The sound a word starts with: "s" for cebola, "o" for hotel, "ch" for xícara. */
const onset = (word: string) => syllableSound(syllablesOf(word)[0]).match(/^(ch|lh|nh|[a-z])/)![0];
const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

describe("Portuguese games data", () => {
  it("has six games: five twins of the English games and «Bata palmas», twin of the Spanish clapping game", () => {
    expect(portugueseGames.map((g) => g.slug)).toEqual([
      "encontre-a-letra", "letra-e-figura", "silaba-inicial", "trace-a-letra", "quiz-do-alfabeto", "bata-palmas",
    ]);
    const groups = TRANSLATED_PARAMS["/games/[slug]"]!.groups;
    for (const g of portugueseGames.filter((x) => x.en)) {
      expect(getGame(g.en!), g.slug).not.toBeNull();
      expect(groups.find((group) => group.en === g.en)?.pt).toBe(g.slug);
    }
    expect(groups.find((group) => group.pt === "bata-palmas")).toEqual({ es: "aplaude-las-silabas", pt: "bata-palmas" });
  });

  it("uses the 26 letters of the alphabet (Ç is not one of them)", () => {
    expect(ALPHABET.map((l) => l.lower).join("")).toBe("abcdefghijklmnopqrstuvwxyz");
  });

  it("hears syllables the Brazilian way", () => {
    const same = [["ce", "se"], ["ci", "si"], ["ça", "sa"], ["ca", "ka"], ["que", "ke"], ["ge", "je"], ["gi", "ji"], ["xa", "cha"], ["ho", "o"]];
    for (const [a, b] of same) expect(syllableSound(a), `${a}/${b}`).toBe(syllableSound(b));
    // Unlike Spanish: z and s, b and v are different sounds.
    const different = [["za", "sa"], ["ba", "va"], ["ga", "ja"], ["ca", "ce"], ["pa", "ba"], ["ma", "na"], ["cha", "ca"], ["lo", "lu"]];
    for (const [a, b] of different) expect(syllableSound(a), `${a}/${b}`).not.toBe(syllableSound(b));
    expect(soundAlike("c", "s")).toBe(true);
    expect(soundAlike("g", "j")).toBe(true);
    expect(soundAlike("h", "o")).toBe(true);
    expect(soundAlike("e", "i")).toBe(true);
    expect(soundAlike("b", "v")).toBe(false);
    expect(soundAlike("s", "z")).toBe(false);
  });

  it("Encontre a letra: the target appears exactly once among distinct letters, look-alikes included", () => {
    for (let i = 0; i < RUNS; i++) {
      const { letter, grid } = findLetterRound();
      expect(grid).toHaveLength(16);
      expect(new Set(grid).size).toBe(16);
      expect(grid.filter((s) => s === letter.slug)).toHaveLength(1);
      for (const s of grid) expect(ALPHABET.some((l) => l.slug === s), s).toBe(true);
      if (letter.slug === "b") expect(grid).toEqual(expect.arrayContaining(["d", "p", "q"]));
    }
  });

  it("A letra e a figura: only the answer starts with the letter, or with a sound it could make", () => {
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

  it("Com que sílaba começa?: four syllables that never sound alike, the answer heard as written", () => {
    expect(FIRST_SYLLABLE_POOL.length).toBeGreaterThan(40);
    for (const w of FIRST_SYLLABLE_POOL) {
      const first = syllablesOf(w.word)[0];
      expect(first, w.word).toMatch(/^[a-z]*[aeiou]$/);
      expect(first, w.word).not.toMatch(/^(h|k|q|x|c[ei]|g[ei])/);
    }
    for (let i = 0; i < RUNS; i++) {
      const { word, answer, choices } = firstSyllableRound();
      expect(choices).toHaveLength(4);
      expect(new Set(choices).size).toBe(4);
      expect(choices).toContain(answer);
      expect(answer).toBe(syllablesOf(word.word)[0]);
      expect(new Set(choices.map(syllableSound)).size, choices.join(" ")).toBe(4);
      const consonant = answer.slice(0, -1);
      expect(choices.some((c) => c !== answer && c.slice(0, -1) === consonant), choices.join(" ")).toBe(true);
    }
  });

  it("Bata palmas: well-split words, every count from 1 to 5", () => {
    for (const w of CLAP_WORDS) {
      for (const syl of syllablesOf(w.word)) expect(syl, w.word).toMatch(/[aeiouáéíóúâêôãõ]/);
      expect(plain(w.word), w.word).not.toMatch(/\s/);
      for (const syl of syllablesOf(w.word)) expect(syl, `${w.word}: rr and ss are split`).not.toMatch(/rr|ss/);
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
      if (q.kind === "after") expect(q.prompt).toMatch(/^Que letra vem depois do [A-Y]\?$/);
      if (q.kind === "picture") {
        expect(strip(q.label!).charAt(0)).toBe(q.answer.toLowerCase());
        const lower = q.choices.map((c) => c.toLowerCase());
        for (const a of lower) for (const b of lower) if (a !== b) expect(soundAlike(a, b), lower.join(" ")).toBe(false);
      }
    }
    expect([...kinds].sort()).toEqual(["after", "heard", "picture", "vowel"]);
  });
});

describe("Portuguese school topics", () => {
  it("pairs exactly the topics with an English twin", () => {
    for (const level of ["educacao-infantil", "primeiro-ano"] as const) {
      const pathname = SCHOOL_HUBS_PT[level].topicPathname;
      const pairs = TRANSLATED_PARAMS[pathname]!.groups.filter((g) => g.en && g.pt).map((g) => [g.en!, g.pt!]);
      const twins = topicsOfPt(level).filter((t) => t.en);
      expect(pairs.sort()).toEqual(twins.map((t) => [t.en!, t.slug]).sort());
      const exists = level === "educacao-infantil" ? getPreschoolTopic : getKindergartenTopic;
      for (const t of twins) expect(exists(t.en!), t.en).not.toBeNull();
    }
    expect(topicsOfPt("educacao-infantil").map((t) => t.slug)).toEqual(["coordenacao-motora", "tracar-as-letras", "colorir"]);
    expect(topicsOfPt("primeiro-ano").map((t) => t.slug)).toEqual(["familias-silabicas", "palavras-frequentes", "letra-cursiva"]);
  });

  it("links only to Portuguese pages that exist", () => {
    const links = [...schoolTopicsPt.flatMap((t) => t.links), ...Object.values(SCHOOL_HUBS_PT).flatMap((h) => h.resources)];
    for (const l of links) {
      const path = localizedPath("pt", l.pathname, l.params);
      const m = matchPath(path)!;
      expect(m, path).not.toBeNull();
      expect(m.locale).toBe("pt");
      expect(paramsExist(m.pathname, m.params, "pt"), path).toBe(true);
    }
  });

  it("accepts Portuguese slugs only in Portuguese", () => {
    expect(paramsExist("/preschool/[topic]", { topic: "coordenacao-motora" }, "pt")).toBe(true);
    expect(paramsExist("/preschool/[topic]", { topic: "coordenacao-motora" }, "es")).toBe(false);
    expect(paramsExist("/preschool/[topic]", { topic: "trazos" }, "pt")).toBe(false);
    expect(paramsExist("/kindergarten/[topic]", { topic: "familias-silabicas" }, "pt")).toBe(true);
    expect(paramsExist("/kindergarten/[topic]", { topic: "silabas" }, "pt")).toBe(false);
    expect(paramsExist("/games/[slug]", { slug: "bata-palmas" }, "pt")).toBe(true);
    expect(paramsExist("/games/[slug]", { slug: "bata-palmas" }, "es")).toBe(false);
    expect(paramsExist("/games/[slug]", { slug: "aplaude-las-silabas" }, "pt")).toBe(false);
    expect(paramsExist("/games/[slug]", { slug: "find-the-letter" }, "pt")).toBe(false);
  });
});

describe("Portuguese games and school pages in routes", () => {
  it("uses the approved URLs", () => {
    expect(localizedPath("pt", "/games/[slug]", { slug: "bata-palmas" })).toBe("/pt/jogos/bata-palmas");
    expect(localizedPath("pt", "/preschool/[topic]", { topic: "colorir" })).toBe("/pt/educacao-infantil/colorir");
    expect(localizedPath("pt", "/kindergarten/[topic]", { topic: "letra-cursiva" })).toBe("/pt/primeiro-ano/letra-cursiva");
    expect(localizedPath("pt", "/activities")).toBe("/pt/brincadeiras");
  });

  it("gives twins hreflang in four languages", () => {
    expect(alternatesFor("pt", "/games/[slug]", { slug: "silaba-inicial" }).languages).toEqual({
      en: "https://alphabes.com/games/beginning-sound",
      fr: "https://alphabes.com/fr/jeux/premier-son",
      es: "https://alphabes.com/es/juegos/primera-silaba",
      pt: "https://alphabes.com/pt/jogos/silaba-inicial",
      "x-default": "https://alphabes.com/games/beginning-sound",
    });
    expect(alternatesFor("pt", "/games/[slug]", { slug: "bata-palmas" }).languages).toEqual({
      es: "https://alphabes.com/es/juegos/aplaude-las-silabas",
      pt: "https://alphabes.com/pt/jogos/bata-palmas",
    });
    expect(alternatesFor("es", "/kindergarten/[topic]", { topic: "letra-cursiva" }).languages?.pt).toBe(
      "https://alphabes.com/pt/primeiro-ano/letra-cursiva",
    );
    expect(alternatesFor("pt", "/activities").languages?.fr).toBe("https://alphabes.com/fr/activites");
  });

  it("keeps Portuguese-only topics without hreflang", () => {
    expect(alternatesFor("pt", "/preschool/[topic]", { topic: "coordenacao-motora" })).toEqual({
      canonical: "https://alphabes.com/pt/educacao-infantil/coordenacao-motora",
    });
    expect(alternatesFor("pt", "/kindergarten/[topic]", { topic: "familias-silabicas" })).toEqual({
      canonical: "https://alphabes.com/pt/primeiro-ano/familias-silabicas",
    });
  });

  it("maps pages for the language switcher", () => {
    expect(counterpartPath(matchPath("/games/letter-tracing")!, "pt")).toBe("/pt/jogos/trace-a-letra");
    expect(counterpartPath(matchPath("/es/juegos/aplaude-las-silabas")!, "pt")).toBe("/pt/jogos/bata-palmas");
    expect(counterpartPath(matchPath("/pt/jogos/bata-palmas")!, "en")).toBeNull();
    expect(sectionFallbackPath(matchPath("/pt/jogos/bata-palmas")!, "en")).toBe("/games");
    expect(counterpartPath(matchPath("/fr/grande-section/ecriture-cursive")!, "pt")).toBe("/pt/primeiro-ano/letra-cursiva");
    expect(sectionFallbackPath(matchPath("/pt/educacao-infantil/coordenacao-motora")!, "fr")).toBe("/fr/maternelle");
    expect(counterpartPath(matchPath("/activities")!, "pt")).toBe("/pt/brincadeiras");
  });
});

describe("Portuguese wording", () => {
  // Portugal-only words (docs/portuguese-plan.md, P2) and Spanish ones.
  const NOT_BRAZILIAN = [
    "autocarro", "comboio", "frigorífico", "telemóvel", "pequeno-almoço", "rebuçado", "sumo", "gelado", "rapariga",
    "miúdo", "miúdos", "casa-de-banho", "plasticina", "lápis-de-cor", "lápis de cera", "ecrã", "ecrãs", "equipa",
    "vós", "vosso", "vossa", "jogar à", "brincar à", "estão a", "está a",
  ];
  const SPANISH = ["juego", "juegos", "palabra", "sílabas directas", "niño", "niña", "también", "dibujo", "escuchar", "muy"];
  const files = [
    "lib/jogos-pt.ts",
    "lib/escola-pt.ts",
    "app/[locale]/games/games-pt.tsx",
    "app/[locale]/games/[slug]/game-pt.tsx",
    "app/[locale]/activities/activities-pt.tsx",
    ...readdirSync("components/jogos-pt").map((f) => join("components/jogos-pt", f)),
    "components/escola/SchoolHubPt.tsx",
    "components/escola/SchoolTopicPt.tsx",
  ];
  const textOf = (file: string) =>
    readFileSync(file, "utf8")
      .split("\n")
      .filter((line) => !line.trim().startsWith("//") && !line.trim().startsWith("*"))
      .join("\n")
      .toLowerCase();

  it("uses Brazilian words, never Portugal-only or Spanish ones", () => {
    for (const file of files) {
      const text = textOf(file);
      const words = text.match(/\p{L}+(?:-\p{L}+)*/gu) ?? [];
      for (const w of words) {
        expect(NOT_BRAZILIAN, `${file}: ${w}`).not.toContain(w);
        expect(SPANISH, `${file}: ${w}`).not.toContain(w);
      }
      for (const phrase of [...NOT_BRAZILIAN, ...SPANISH].filter((x) => x.includes(" "))) expect(text, `${file}: ${phrase}`).not.toContain(phrase);
      expect(text, file).not.toMatch(/[¿¡]/);
    }
  });

  it("closes every quotation it opens", () => {
    const texts = [
      ...portugueseGames.flatMap((g) => [g.title, g.description, g.forParents]),
      ...schoolTopicsPt.flatMap((t) => [t.title, t.summary, ...t.intro, ...t.tips, t.activity.title, t.activity.material, ...t.activity.steps]),
      ...Object.values(SCHOOL_HUBS_PT).flatMap((h) => [h.title, h.intro, ...h.faq.flatMap((f) => [f.question, f.answer])]),
    ];
    for (const t of texts) {
      expect(t.split("“").length, t).toBe(t.split("”").length);
      expect(t, "no look-alike Cyrillic letters").not.toMatch(/[Ѐ-ӿ]/);
    }
  });
});
