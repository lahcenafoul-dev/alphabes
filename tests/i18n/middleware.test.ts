import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

// Stand-in for the database lookup: only one story exists.
vi.mock("@/lib/story-exists", () => ({
  storyExists: async (slug: string, locale: string) =>
    (locale === "en" && slug === "the-little-apple") || (locale === "fr" && slug === "la-petite-pomme"),
}));

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "test-secret";
});

function request(path: string, cookie?: string) {
  return new NextRequest(`https://alphabes.com${path}`, {
    headers: cookie ? { cookie } : {},
  });
}

function rewrite(res: Response) {
  const target = res.headers.get("x-middleware-rewrite");
  return target ? new URL(target).pathname : null;
}

// The language passed to app/global-not-found.tsx through a request header override.
function notFoundLocale(res: Response) {
  return res.headers.get("x-middleware-request-x-alphabes-locale");
}

function redirect(res: Response) {
  const location = res.headers.get("location");
  if (!location) return null;
  const url = new URL(location, "https://alphabes.com");
  return url.pathname + url.search;
}

describe("middleware routing", () => {
  it("serves English URLs unchanged (internal rewrite, no redirect)", async () => {
    for (const path of ["/", "/pricing", "/alphabet/a", "/worksheets/letter-a-tracing"]) {
      const res = await middleware(request(path));
      expect(res.status, path).toBe(200);
      expect(redirect(res), path).toBeNull();
      expect(rewrite(res), path).toBe(path === "/" ? "/en" : `/en${path}`);
    }
  });

  it("maps French URLs to the internal routes", async () => {
    // "/fr" is already the internal path, so it passes straight through.
    const home = await middleware(request("/fr"));
    expect(home.status).toBe(200);
    expect(redirect(home)).toBeNull();
    expect(rewrite(home) ?? "/fr").toBe("/fr");
    expect(rewrite(await middleware(request("/fr/tarifs")))).toBe("/fr/pricing");
    expect(rewrite(await middleware(request("/fr/a-propos")))).toBe("/fr/about");
  });

  it("serves the 404 page, in the right language, for unknown URLs", async () => {
    for (const [path, locale] of [
      ["/does-not-exist", "en"],
      ["/a/b/c", "en"],
      ["/fr/xyz", "fr"],
      // French URLs use French words, so the English word is unknown there.
      ["/fr/pricing", "fr"],
    ]) {
      const res = await middleware(request(path));
      expect(rewrite(res), path).toBe("/_not-found");
      expect(notFoundLocale(res), path).toBe(locale);
    }
  });

  it("serves the 404 page for unknown letters, games and worksheets", async () => {
    for (const path of ["/alphabet/zzz", "/alphabet/zz/worksheet", "/games/nope", "/blog/nope", "/worksheets/nope", "/worksheets/bundles/nope"]) {
      const res = await middleware(request(path));
      expect(rewrite(res), path).toBe("/_not-found");
      expect(notFoundLocale(res), path).toBe("en");
    }
  });

  it("lets real pages through, including /alphabet/A", async () => {
    for (const path of ["/alphabet/A", "/alphabet/b/worksheet", "/games/find-the-letter", "/worksheets/letter-a-tracing", "/worksheets/sight-words", "/stories/the-little-apple"]) {
      expect(rewrite(await middleware(request(path))), path).toBe(`/en${path}`);
    }
  });

  it("serves the 404 page for unknown stories", async () => {
    const res = await middleware(request("/stories/nope"));
    expect(rewrite(res)).toBe("/_not-found");
    expect(notFoundLocale(res)).toBe("en");
  });

  it("serves the French 404 page for French pages not written yet", async () => {
    const res = await middleware(request("/fr/blog"));
    expect(rewrite(res)).toBe("/_not-found");
    expect(notFoundLocale(res)).toBe("fr");
  });

  it("serves French games and topics only under their French slugs", async () => {
    for (const path of ["/fr/jeux/trouve-la-lettre", "/fr/maternelle/graphisme", "/fr/grande-section/mots-outils", "/fr/activites"]) {
      expect(rewrite(await middleware(request(path))), path).not.toBe("/_not-found");
    }
    for (const path of ["/fr/jeux/find-the-letter", "/games/trouve-la-lettre", "/fr/maternelle/coloring", "/preschool/graphisme"]) {
      expect(rewrite(await middleware(request(path))), path).toBe("/_not-found");
    }
  });

  it("serves the 404 page for letters of the other alphabet", async () => {
    const en = await middleware(request("/alphabet/c-cedille"));
    expect(rewrite(en)).toBe("/_not-found");
    expect(notFoundLocale(en)).toBe("en");
    expect(rewrite(await middleware(request("/fr/alphabet/accents/fiche")))).toBe("/_not-found");
    expect(rewrite(await middleware(request("/fr/alphabet/c-cedille")))).not.toBe("/_not-found");
  });

  it("keeps French sounds and English phonics skills apart", async () => {
    expect(rewrite(await middleware(request("/fr/sons/ou")))).not.toBe("/_not-found");
    expect(rewrite(await middleware(request("/fr/sons")))).not.toBe("/_not-found");
    const fr = await middleware(request("/fr/sons/blending"));
    expect(rewrite(fr)).toBe("/_not-found");
    expect(notFoundLocale(fr)).toBe("fr");
    expect(rewrite(await middleware(request("/phonics/ou")))).toBe("/_not-found");
    expect(redirect(await middleware(request("/phonics", "NEXT_LOCALE=fr")))).toBe("/fr/sons");
    expect(redirect(await middleware(request("/phonics/blending", "NEXT_LOCALE=fr")))).toBeNull();
  });

  it("keeps each story in its own language", async () => {
    expect(rewrite(await middleware(request("/fr/histoires/la-petite-pomme")))).not.toBe("/_not-found");
    expect(rewrite(await middleware(request("/fr/histoires")))).not.toBe("/_not-found");
    const fr = await middleware(request("/fr/histoires/the-little-apple"));
    expect(rewrite(fr)).toBe("/_not-found");
    expect(notFoundLocale(fr)).toBe("fr");
    expect(rewrite(await middleware(request("/stories/la-petite-pomme")))).toBe("/_not-found");
    expect(redirect(await middleware(request("/stories", "NEXT_LOCALE=fr")))).toBe("/fr/histoires");
    expect(redirect(await middleware(request("/stories/the-little-apple", "NEXT_LOCALE=fr")))).toBeNull();
  });

  it("redirects /en URLs to the unprefixed English ones", async () => {
    expect(redirect(await middleware(request("/en/pricing")))).toBe("/pricing");
  });

  it("never sends hreflang Link headers (hreflang lives in the HTML and sitemap)", async () => {
    const res = await middleware(request("/pricing"));
    expect(res.headers.get("link")).toBeNull();
  });

  it("never redirects on Accept-Language alone", async () => {
    const res = await middleware(
      new NextRequest("https://alphabes.com/pricing", { headers: { "accept-language": "fr-FR,fr;q=0.9" } }),
    );
    expect(redirect(res)).toBeNull();
  });
});

describe("remembered language", () => {
  it("sends a visitor who chose French to the French twin of a page", async () => {
    const res = await middleware(request("/pricing", "NEXT_LOCALE=fr"));
    expect(res.status).toBe(307);
    expect(redirect(res)).toBe("/fr/tarifs");
  });

  it("keeps the query string", async () => {
    expect(redirect(await middleware(request("/?ref=abc", "NEXT_LOCALE=fr")))).toBe("/fr?ref=abc");
  });

  it("stays on English pages that have no French twin", async () => {
    const res = await middleware(request("/blog", "NEXT_LOCALE=fr"));
    expect(redirect(res)).toBeNull();
    expect(rewrite(res)).toBe("/en/blog");
  });

  it("maps games and topics to their translated slugs", async () => {
    expect(redirect(await middleware(request("/games/find-the-letter", "NEXT_LOCALE=fr")))).toBe("/fr/jeux/trouve-la-lettre");
    expect(redirect(await middleware(request("/preschool/coloring", "NEXT_LOCALE=fr")))).toBe("/fr/maternelle/coloriage");
    expect(redirect(await middleware(request("/fr/grande-section/ecriture-cursive", "NEXT_LOCALE=en")))).toBe(
      "/kindergarten/handwriting",
    );
    // A French-only topic stays put for a visitor who chose English.
    expect(redirect(await middleware(request("/fr/maternelle/graphisme", "NEXT_LOCALE=en")))).toBeNull();
  });

  it("stays on French-only letters for a visitor who chose English", async () => {
    const res = await middleware(request("/fr/alphabet/c-cedille", "NEXT_LOCALE=en"));
    expect(redirect(res)).toBeNull();
  });

  it("sends a visitor who chose English back from French pages", async () => {
    expect(redirect(await middleware(request("/fr/tarifs", "NEXT_LOCALE=en")))).toBe("/pricing");
  });

  it("ignores unknown cookie values", async () => {
    expect(redirect(await middleware(request("/pricing", "NEXT_LOCALE=de")))).toBeNull();
  });
});

describe("dashboard protection", () => {
  it("sends signed-out visitors to the login page in their language", async () => {
    expect(redirect(await middleware(request("/dashboard")))).toBe("/login?next=%2Fdashboard");
    expect(redirect(await middleware(request("/fr/tableau-de-bord")))).toBe(
      "/fr/connexion?next=%2Ffr%2Ftableau-de-bord",
    );
  });
});

describe("API rate limiting", () => {
  it("passes API calls through untouched", async () => {
    const res = await middleware(request("/api/register"));
    expect(res.status).toBe(200);
    expect(rewrite(res)).toBeNull();
  });
});
