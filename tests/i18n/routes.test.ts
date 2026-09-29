import { describe, expect, it } from "vitest";
import { routing, type AppPathname } from "@/i18n/routing";
import {
  FRENCH_PATHNAMES,
  absoluteUrl,
  alternatesFor,
  counterpartPath,
  localizedPath,
  matchPath,
  safeNextPath,
} from "@/lib/i18n/routes";

const sampleParams = { letter: "a", slug: "x", id: "c1", topic: "t", skill: "s", category: "c", bundleSlug: "b" };

describe("localizedPath / absoluteUrl", () => {
  it("keeps English URLs unprefixed and exactly as before", () => {
    expect(localizedPath("en", "/")).toBe("/");
    expect(localizedPath("en", "/pricing")).toBe("/pricing");
    expect(localizedPath("en", "/games/[slug]", { slug: "find-the-letter" })).toBe("/games/find-the-letter");
    expect(localizedPath("en", "/worksheets/bundles/[bundleSlug]", { bundleSlug: "letter-a-bundle" })).toBe(
      "/worksheets/bundles/letter-a-bundle",
    );
  });

  it("puts French under /fr with French path words", () => {
    expect(localizedPath("fr", "/")).toBe("/fr");
    expect(localizedPath("fr", "/pricing")).toBe("/fr/tarifs");
    expect(localizedPath("fr", "/games/[slug]", { slug: "trouve-la-lettre" })).toBe("/fr/jeux/trouve-la-lettre");
    expect(localizedPath("fr", "/stories")).toBe("/fr/histoires");
    expect(localizedPath("fr", "/phonics")).toBe("/fr/sons");
    expect(localizedPath("fr", "/worksheets")).toBe("/fr/fiches");
    expect(localizedPath("fr", "/login")).toBe("/fr/connexion");
    expect(localizedPath("fr", "/preschool")).toBe("/fr/maternelle");
    expect(localizedPath("fr", "/kindergarten")).toBe("/fr/grande-section");
  });

  it("builds absolute URLs, with no trailing slash on the English home page", () => {
    expect(absoluteUrl("en", "/")).toBe("https://alphabes.com");
    expect(absoluteUrl("en", "/about")).toBe("https://alphabes.com/about");
    expect(absoluteUrl("fr", "/about")).toBe("https://alphabes.com/fr/a-propos");
  });

  it("throws on a missing param", () => {
    expect(() => localizedPath("en", "/games/[slug]")).toThrow(/slug/);
  });
});

describe("matchPath", () => {
  it("round-trips every pathname in both languages", () => {
    for (const locale of routing.locales) {
      for (const pathname of Object.keys(routing.pathnames) as AppPathname[]) {
        const path = localizedPath(locale, pathname, sampleParams);
        const match = matchPath(path);
        expect(match, path).not.toBeNull();
        expect(match!.locale).toBe(locale);
        expect(match!.pathname).toBe(pathname);
      }
    }
  });

  it("prefers static segments over dynamic ones", () => {
    expect(matchPath("/worksheets/bundles")?.pathname).toBe("/worksheets/bundles");
    expect(matchPath("/fr/fiches/packs")?.pathname).toBe("/worksheets/bundles");
    expect(matchPath("/worksheets/tracing")?.pathname).toBe("/worksheets/[category]");
  });

  it("extracts params and tolerates a trailing slash", () => {
    expect(matchPath("/fr/jeux/trouve-la-lettre/")).toEqual({
      locale: "fr",
      pathname: "/games/[slug]",
      params: { slug: "trouve-la-lettre" },
    });
  });

  it("returns null for unknown or wrongly localized paths", () => {
    expect(matchPath("/does-not-exist")).toBeNull();
    expect(matchPath("/en/pricing")).toBeNull();
    expect(matchPath("/fr/pricing")).toBeNull();
    expect(matchPath("/tarifs")).toBeNull();
  });
});

describe("alternatesFor", () => {
  it("adds hreflang only for pages that exist in French", () => {
    expect(alternatesFor("en", "/about")).toEqual({
      canonical: "https://alphabes.com/about",
      languages: {
        en: "https://alphabes.com/about",
        fr: "https://alphabes.com/fr/a-propos",
        "x-default": "https://alphabes.com/about",
      },
    });
    expect(alternatesFor("fr", "/")).toMatchObject({ canonical: "https://alphabes.com/fr" });
  });

  it("keeps a plain canonical for English-only pages", () => {
    if (FRENCH_PATHNAMES.has("/blog")) return;
    expect(alternatesFor("en", "/blog")).toEqual({ canonical: "https://alphabes.com/blog" });
  });

  it("uses per-language params for pages whose slugs differ", () => {
    const alt = alternatesFor("en", "/stories/[slug]", { slug: "the-little-apple" });
    // Stories aren't in French yet in phase 1; once they are, otherParams maps the slug.
    expect(alt.canonical).toBe("https://alphabes.com/stories/the-little-apple");
  });
});

describe("counterpartPath", () => {
  it("maps a page to its twin when both exist", () => {
    expect(counterpartPath(matchPath("/pricing")!, "fr")).toBe("/fr/tarifs");
    expect(counterpartPath(matchPath("/fr/a-propos")!, "en")).toBe("/about");
    expect(counterpartPath(matchPath("/fr")!, "en")).toBe("/");
  });

  it("returns null without a twin, for the same language, or when slugs differ", () => {
    expect(counterpartPath(matchPath("/pricing")!, "en")).toBeNull();
    expect(counterpartPath(matchPath("/stories/the-little-apple")!, "fr")).toBeNull();
    if (!FRENCH_PATHNAMES.has("/blog")) expect(counterpartPath(matchPath("/blog")!, "fr")).toBeNull();
  });
});

describe("safeNextPath", () => {
  it("only accepts same-site paths", () => {
    expect(safeNextPath("/fr/tableau-de-bord")).toBe("/fr/tableau-de-bord");
    expect(safeNextPath("//evil.example")).toBeNull();
    expect(safeNextPath("/\\evil.example")).toBeNull();
    expect(safeNextPath("https://evil.example")).toBeNull();
    expect(safeNextPath(null)).toBeNull();
  });
});
