import { beforeAll, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

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

  it("serves the 404 page for unknown URLs", async () => {
    // "/fr/pricing": French URLs use French words, so the English word is unknown there.
    for (const path of ["/does-not-exist", "/a/b/c", "/fr/xyz", "/fr/pricing"]) {
      expect(rewrite(await middleware(request(path))), path).toBe("/_not-found");
    }
  });

  it("serves the 404 page for French pages not written yet", async () => {
    expect(rewrite(await middleware(request("/fr/alphabet")))).toBe("/_not-found");
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
    const res = await middleware(request("/alphabet", "NEXT_LOCALE=fr"));
    expect(redirect(res)).toBeNull();
    expect(rewrite(res)).toBe("/en/alphabet");
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
