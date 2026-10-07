import { describe, expect, it, vi } from "vitest";
import { routing } from "@/i18n/routing";
import { NOINDEX_PATHNAMES, absoluteUrl, alternatesFor, isAvailable, matchPath } from "@/lib/i18n/routes";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { frenchLetters } from "@/lib/letters-fr";
import { spanishLetters } from "@/lib/letters-es";
import { portugueseLetters } from "@/lib/letters-pt";
import { games } from "@/lib/games-data";
import { frenchGames } from "@/lib/games-fr";
import { spanishGames } from "@/lib/juegos-es";
import { portugueseGames } from "@/lib/jogos-pt";

vi.stubEnv("RELEASE_DATE", "2026-10-07T12:00:00.000Z");
vi.mock("next/cache", () => ({ unstable_cache: (fn: () => unknown) => fn }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ story: { findMany: async () => [] } }) }));

const { sitemapEntries } = await import("@/lib/sitemap");
const entries = await sitemapEntries();
const urls = new Set(entries.map((e) => e.url));

// docs/seo-audit.md: I2 (indexable pages missing), I3 (noindex pages listed), I4 (/privacy).
describe("sitemap coverage", () => {
  it("lists every letter worksheet page in every language", () => {
    for (const letter of getAllLetterSlugs()) expect(urls.has(absoluteUrl("en", "/alphabet/[letter]/worksheet", { letter })), letter).toBe(true);
    for (const [locale, letters] of [
      ["fr", frenchLetters],
      ["es", spanishLetters],
      ["pt", portugueseLetters],
    ] as const) {
      for (const { slug } of letters) {
        expect(urls.has(absoluteUrl(locale, "/alphabet/[letter]/worksheet", { letter: slug })), `${locale} ${slug}`).toBe(true);
      }
    }
  });

  it("lists every game in every language, so each hreflang target is in the sitemap", () => {
    const all = { en: games, fr: frenchGames, es: spanishGames, pt: portugueseGames };
    for (const [locale, list] of Object.entries(all) as [keyof typeof all, { slug: string }[]][]) {
      for (const { slug } of list) expect(urls.has(absoluteUrl(locale, "/games/[slug]", { slug })), `${locale} ${slug}`).toBe(true);
    }
  });

  it("lists each URL once", () => {
    expect(urls.size).toBe(entries.length);
  });

  it("never lists noindex, private or removed pages", () => {
    for (const url of urls) {
      const match = matchPath(url.slice("https://alphabes.com".length) || "/");
      expect(match, url).not.toBeNull();
      expect(NOINDEX_PATHNAMES.has(match!.pathname), url).toBe(false);
      expect(isAvailable(match!.locale, match!.pathname), url).toBe(true);
    }
    expect(urls.has("https://alphabes.com/privacy")).toBe(false);
  });

  it("gives every hreflang alternate its own sitemap entry", () => {
    for (const e of entries) {
      for (const [lang, href] of Object.entries(e.alternates?.languages ?? {})) {
        if (lang !== "x-default") expect(urls.has(href as string), `${e.url} → ${href}`).toBe(true);
      }
    }
  });

  it("matches each page's own hreflang for the games", () => {
    for (const locale of routing.locales) {
      const list = { en: games, fr: frenchGames, es: spanishGames, pt: portugueseGames }[locale];
      for (const { slug } of list) {
        const url = absoluteUrl(locale, "/games/[slug]", { slug });
        const entry = entries.find((e) => e.url === url)!;
        expect(entry.alternates?.languages ?? undefined, url).toEqual(alternatesFor(locale, "/games/[slug]", { slug }).languages);
      }
    }
  });
});
