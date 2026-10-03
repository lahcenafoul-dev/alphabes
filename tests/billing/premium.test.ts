import { describe, expect, it } from "vitest";
import { games } from "@/lib/games-data";
import { frenchGames } from "@/lib/games-fr";
import { spanishGames } from "@/lib/juegos-es";
import { portugueseGames } from "@/lib/jogos-pt";
import { PREMIUM_GAME_KEYS, isPremiumGame } from "@/lib/billing/premium";
import { paramsExist } from "@/lib/i18n/known-params";
import { NOINDEX_PATHNAMES, counterpartPath, isAvailable, localizedPath, matchPath } from "@/lib/i18n/routes";

const ALL = [
  ["en", games],
  ["fr", frenchGames],
  ["es", spanishGames],
  ["pt", portugueseGames],
] as const;

describe("premium games", () => {
  it("PREMIUM_GAME_KEYS lists exactly the games flagged isPremium", () => {
    const flagged = ALL.flatMap(([l, list]) => list.filter((g) => g.isPremium).map((g) => `${l}:${g.slug}`));
    expect([...PREMIUM_GAME_KEYS].sort()).toEqual(flagged.sort());
    expect(flagged).toHaveLength(12);
  });

  it("isPremiumGame follows the flags, per language", () => {
    expect(isPremiumGame("en", "alphabet-quiz")).toBe(true);
    expect(isPremiumGame("en", "find-the-letter")).toBe(false);
    expect(isPremiumGame("fr", "trace-la-lettre")).toBe(true);
    expect(isPremiumGame("fr", "letter-tracing")).toBe(false); // English slug on the French site
    expect(isPremiumGame("es", "aplaude-las-silabas")).toBe(false);
    expect(isPremiumGame("pt", "quiz-do-alfabeto")).toBe(true);
    expect(isPremiumGame("en", "nope")).toBe(false);
  });
});

describe("play page routing", () => {
  it("has a URL in each language", () => {
    expect(localizedPath("en", "/games/[slug]/play", { slug: "alphabet-quiz" })).toBe("/games/alphabet-quiz/play");
    expect(localizedPath("fr", "/games/[slug]/play", { slug: "quiz-alphabet" })).toBe("/fr/jeux/quiz-alphabet/jouer");
    expect(localizedPath("es", "/games/[slug]/play", { slug: "quiz-del-abecedario" })).toBe(
      "/es/juegos/quiz-del-abecedario/jugar",
    );
    expect(localizedPath("pt", "/games/[slug]/play", { slug: "quiz-do-alfabeto" })).toBe("/pt/jogos/quiz-do-alfabeto/jogar");
  });

  it("exists only for premium games (others 404 in the middleware)", () => {
    for (const [l, list] of ALL) {
      expect(isAvailable(l, "/games/[slug]/play"), l).toBe(true);
      for (const g of list) expect(paramsExist("/games/[slug]/play", { slug: g.slug }, l), `${l}:${g.slug}`).toBe(g.isPremium);
    }
  });

  it("is noindex and switches language to the same game's play page", () => {
    expect(NOINDEX_PATHNAMES.has("/games/[slug]/play")).toBe(true);
    const match = matchPath("/fr/jeux/trace-la-lettre/jouer")!;
    expect(match).toMatchObject({ locale: "fr", pathname: "/games/[slug]/play", params: { slug: "trace-la-lettre" } });
    expect(counterpartPath(match, "en")).toBe("/games/letter-tracing/play");
    expect(counterpartPath(match, "pt")).toBe("/pt/jogos/trace-a-letra/jogar");
  });
});
