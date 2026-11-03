import { existsSync } from "fs";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { routing, type Locale } from "@/i18n/routing";
import { paramsExist } from "@/lib/i18n/known-params";
import { TRANSLATED_PARAMS, alternatesFor, counterpartPath, isAvailable, localizedPath, matchPath } from "@/lib/i18n/routes";
import { isPremiumGame } from "@/lib/billing/premium";
import {
  BALLOON_COUNT,
  COUNT_PICTURES,
  SEQUENCE_LENGTH,
  balloonRound,
  compareAnswer,
  compareRound,
  countRound,
  dotLayout,
  fillsGap,
  matchRound,
  missingRound,
  nearDistractors,
  nextBalloon,
} from "@/lib/number-games-logic";
import { NUMBER_GAME_KEYS, NUMBER_GAME_SLUGS, getNumberGame, numberGames } from "@/lib/number-games";
import { getGame } from "@/lib/games-data";
import { getFrenchGame } from "@/lib/games-fr";
import { getSpanishGame } from "@/lib/juegos-es";
import { getPortugueseGame } from "@/lib/jogos-pt";
import { siteNav } from "@/lib/site-nav";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import es from "@/messages/es.json";
import pt from "@/messages/pt.json";

// The sitemap reads stories from the database: none here.
vi.stubEnv("RELEASE_DATE", "2026-11-03T12:00:00.000Z");
vi.mock("next/cache", () => ({ unstable_cache: (fn: () => unknown) => fn }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ story: { findMany: async () => [] } }) }));

const RUNS = 500;

/** A repeatable random source (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const distinct = (xs: number[]) => new Set(xs).size === xs.length;

describe("number game rounds", () => {
  it("count and tap: 1 to 10 pictures, three different numbers, the answer among them", () => {
    const rng = seeded(1);
    const seen = new Set<number>();
    let prev: number | undefined;
    for (let i = 0; i < RUNS; i++) {
      const r = countRound(rng, prev);
      expect(r.answer).toBeGreaterThanOrEqual(1);
      expect(r.answer).toBeLessThanOrEqual(10);
      expect(r.answer).not.toBe(prev);
      expect(r.choices).toHaveLength(3);
      expect(distinct(r.choices)).toBe(true);
      expect(r.choices).toContain(r.answer);
      for (const c of r.choices) expect(c >= 1 && c <= 10).toBe(true);
      expect(COUNT_PICTURES).toContain(r.picture);
      seen.add(r.answer);
      prev = r.answer;
    }
    expect(seen.size).toBe(10);
  });

  it("uses pictures that exist in public/", () => {
    for (const p of COUNT_PICTURES) expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
  });

  it("missing number: five numbers in order within 1 to 20, one gap, distractors never on show", () => {
    const rng = seeded(2);
    const gaps = new Set<number>();
    for (let i = 0; i < RUNS; i++) {
      const r = missingRound(rng);
      expect(r.sequence).toHaveLength(SEQUENCE_LENGTH);
      const gap = r.sequence.indexOf(null);
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(r.sequence.filter((n) => n === null)).toHaveLength(1);
      gaps.add(gap);
      const full = r.sequence.map((n) => n ?? r.answer);
      for (let k = 1; k < full.length; k++) expect(full[k]).toBe(full[k - 1] + 1);
      expect(full[0]).toBeGreaterThanOrEqual(1);
      expect(full[full.length - 1]).toBeLessThanOrEqual(20);
      expect(r.choices).toHaveLength(3);
      expect(distinct(r.choices)).toBe(true);
      expect(r.choices).toContain(r.answer);
      for (const c of r.choices) {
        expect(c >= 1 && c <= 20).toBe(true);
        expect(fillsGap(r.sequence, c)).toBe(c === r.answer);
        if (c !== r.answer) expect(r.sequence).not.toContain(c);
      }
    }
    expect(gaps.size).toBe(SEQUENCE_LENGTH);
  });

  it("checks a gap answer", () => {
    expect(fillsGap([3, 4, null, 6, 7], 5)).toBe(true);
    expect(fillsGap([3, 4, null, 6, 7], 8)).toBe(false);
    expect(fillsGap([null, 2, 3, 4, 5], 1)).toBe(true);
    expect(fillsGap([16, 17, 18, 19, null], 20)).toBe(true);
  });

  it("number match: dots or fingers, 1 to 10, three different groups", () => {
    const rng = seeded(3);
    const styles = new Set<string>();
    for (let i = 0; i < RUNS; i++) {
      const r = matchRound(rng);
      styles.add(r.style);
      expect(r.choices).toHaveLength(3);
      expect(distinct(r.choices)).toBe(true);
      expect(r.choices).toContain(r.answer);
      for (const c of r.choices) expect(c >= 1 && c <= 10).toBe(true);
    }
    expect([...styles].sort()).toEqual(["dots", "fingers"]);
  });

  it("bigger or smaller: two different numbers and the right one for the question", () => {
    const rng = seeded(4);
    const asks = new Set<string>();
    for (let i = 0; i < RUNS; i++) {
      const r = compareRound(rng);
      asks.add(r.ask);
      expect(r.left).not.toBe(r.right);
      for (const n of [r.left, r.right]) expect(n >= 1 && n <= 10).toBe(true);
      expect(r.pictures[0]).not.toBe(r.pictures[1]);
      const a = compareAnswer(r);
      expect(a).toBe(r.ask === "bigger" ? Math.max(r.left, r.right) : Math.min(r.left, r.right));
    }
    expect([...asks].sort()).toEqual(["bigger", "smaller"]);
    expect(compareAnswer({ left: 3, right: 7, ask: "bigger" })).toBe(7);
    expect(compareAnswer({ left: 3, right: 7, ask: "smaller" })).toBe(3);
  });

  it("balloons: 1 to 10 once each, popped in order", () => {
    const r = balloonRound(seeded(5));
    expect(r.map((b) => b.n).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(nextBalloon([])).toBe(1);
    expect(nextBalloon([1, 2, 3])).toBe(4);
    expect(nextBalloon(Array.from({ length: BALLOON_COUNT }, (_, i) => i + 1))).toBeNull();
  });

  it("picks distractors close to the answer, never the answer itself", () => {
    const rng = seeded(6);
    for (let i = 0; i < RUNS; i++) {
      const d = nearDistractors(1, 2, 1, 10, rng);
      expect(d).not.toContain(1);
      for (const x of d) expect(x).toBeLessThanOrEqual(5);
    }
  });

  it("lays out 1 to 10 dots in a five-wide frame", () => {
    for (let n = 1; n <= 10; n++) {
      const cells = dotLayout(n);
      expect(cells).toHaveLength(n);
      expect(new Set(cells.map((c) => c.join(","))).size).toBe(n);
      for (const [col] of cells) expect(col >= 0 && col <= 4).toBe(true);
    }
  });
});

describe.each(routing.locales)("number games in %s", (locale: Locale) => {
  const games = numberGames(locale);

  it("has the five games, free, with every text written", () => {
    expect(games.map((g) => g.key)).toEqual([...NUMBER_GAME_KEYS]);
    for (const g of games) {
      for (const text of [g.title, g.seoTitle, g.description, g.card, g.howToPlay, g.forParents]) expect(text.trim(), g.slug).not.toBe("");
      // Google shows about 160 characters of a description.
      expect(g.description.length, g.slug).toBeLessThanOrEqual(160);
      expect(isPremiumGame(locale, g.slug)).toBe(false);
      expect(getNumberGame(locale, g.slug)).toEqual(g);
    }
  });

  it("has a real page for each game, and unknown slugs 404", () => {
    expect(isAvailable(locale, "/games/[slug]")).toBe(true);
    for (const g of games) {
      const path = localizedPath(locale, "/games/[slug]", { slug: g.slug });
      const match = matchPath(path)!;
      expect(match, path).not.toBeNull();
      expect(match.pathname).toBe("/games/[slug]");
      expect(match.locale).toBe(locale);
      expect(paramsExist("/games/[slug]", { slug: g.slug }, locale), path).toBe(true);
      // No play page: the games are free.
      expect(paramsExist("/games/[slug]/play", { slug: g.slug }, locale)).toBe(false);
    }
    expect(paramsExist("/games/[slug]", { slug: "not-a-game" }, locale)).toBe(false);
    // Another language's slug is not a page here (pt and es share "numero-que-falta").
    for (const other of routing.locales) {
      if (other === locale) continue;
      for (const key of NUMBER_GAME_KEYS) {
        const slug = NUMBER_GAME_SLUGS[key][other];
        if (slug === NUMBER_GAME_SLUGS[key][locale]) continue;
        expect(paramsExist("/games/[slug]", { slug }, locale), `${other} ${slug}`).toBe(false);
      }
    }
  });

  it("doesn't reuse a letter game's slug", () => {
    const letterGame = { en: getGame, fr: getFrenchGame, es: getSpanishGame, pt: getPortugueseGame }[locale];
    for (const g of games) expect(letterGame(g.slug), g.slug).toBeFalsy();
  });

  it("pairs each game with its twins in the other languages (hreflang, switcher)", () => {
    for (const g of games) {
      const alt = alternatesFor(locale, "/games/[slug]", { slug: g.slug });
      expect(alt.canonical).toBe(`https://alphabes.com${localizedPath(locale, "/games/[slug]", { slug: g.slug })}`);
      const languages = alt.languages as Record<string, string>;
      for (const l of routing.locales) {
        expect(languages[l]).toBe(`https://alphabes.com${localizedPath(l, "/games/[slug]", { slug: NUMBER_GAME_SLUGS[g.key][l] })}`);
        if (l !== locale) {
          expect(counterpartPath(matchPath(localizedPath(locale, "/games/[slug]", { slug: g.slug }))!, l)).toBe(
            localizedPath(l, "/games/[slug]", { slug: NUMBER_GAME_SLUGS[g.key][l] }),
          );
        }
      }
      expect(languages["x-default"]).toBe(languages.en);
    }
  });

  it("lists every game in the header's Numbers menu", () => {
    const messages = { en, fr, es, pt }[locale].Header as Record<string, string>;
    const nav = siteNav(locale, (key) => messages[key]);
    const numbers = nav.find((i) => i.key === "numbers")!;
    const hrefs = numbers.children!.map((c) => c.href);
    for (const g of games) expect(hrefs).toContain(localizedPath(locale, "/games/[slug]", { slug: g.slug }));
    for (const c of numbers.children!) expect(c.label, c.href).toBeTruthy();
  });
});

describe("number games in the sitemap and messages", () => {
  it("has every game in every language in the sitemap", async () => {
    const { sitemapEntries } = await import("@/lib/sitemap");
    const urls = new Set((await sitemapEntries()).map((e) => e.url));
    for (const locale of routing.locales)
      for (const g of numberGames(locale)) expect(urls.has(`https://alphabes.com${localizedPath(locale, "/games/[slug]", { slug: g.slug })}`), g.slug).toBe(true);
  });

  it("has one translated-params group per game", () => {
    const groups = TRANSLATED_PARAMS["/games/[slug]"]!.groups;
    for (const key of NUMBER_GAME_KEYS) expect(groups).toContainEqual(NUMBER_GAME_SLUGS[key]);
  });

  it("has the games' words in every language", () => {
    const keys = (o: object, prefix = ""): string[] =>
      Object.entries(o).flatMap(([k, v]) => (typeof v === "string" ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`)));
    const enKeys = keys(en.NumberGames).sort();
    expect(enKeys.length).toBeGreaterThan(30);
    for (const m of [fr, es, pt]) expect(keys(m.NumberGames).sort()).toEqual(enKeys);
    for (const m of [en, fr, es, pt]) for (const value of Object.values(m.NumberGames)) expect(value).toBeTruthy();
  });
});

describe("number games wording", () => {
  const texts = (locale: Locale) => {
    const flat = (o: object): string[] => Object.values(o).flatMap((v) => (typeof v === "string" ? [v] : flat(v)));
    const messages = { en, fr, es, pt }[locale];
    return [
      ...numberGames(locale).flatMap((g) => [g.title, g.seoTitle, g.description, g.card, g.howToPlay, g.forParents]),
      ...flat(messages.NumberGames),
    ];
  };
  const words = (t: string) => t.toLowerCase().match(/\p{L}+(?:-\p{L}+)*/gu) ?? [];

  it("Spanish: no regional words, every ¿ and ¡ opened (docs/spanish-plan.md, D2)", () => {
    const REGIONAL = ["carro", "coche", "plátano", "banana", "fresa", "frutilla", "jugo", "pastel", "torta", "papa", "coger", "celular", "vosotros", "mariquita", "catarina"];
    for (const t of texts("es")) {
      for (const w of words(t)) expect(REGIONAL, t).not.toContain(w);
      expect(t.split("?").length, t).toBe(t.split("¿").length);
      expect(t.split("!").length, t).toBe(t.split("¡").length);
    }
  });

  it("Portuguese: Brazilian words only (docs/portuguese-plan.md, P2)", () => {
    const NOT_BRAZILIAN = ["ecrã", "equipa", "miúdo", "miúdos", "rapariga", "vós", "juego", "dibujo", "niño", "muy"];
    for (const t of texts("pt")) {
      for (const w of words(t)) expect(NOT_BRAZILIAN, t).not.toContain(w);
      expect(t, t).not.toMatch(/\best(á|ão) a \p{L}+r\b/u);
    }
  });
});
