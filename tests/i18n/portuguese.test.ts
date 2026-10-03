import { beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { routing, type AppPathname } from "@/i18n/routing";
import { fromDbLocale, toDbLocale } from "@/lib/i18n/db-locale";
import {
  PORTUGUESE_PATHNAMES,
  alternatesFor,
  byLocale,
  counterpartPath,
  isAvailable,
  localizedPath,
  matchPath,
  sectionFallbackPath,
} from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { pickVoice } from "@/lib/speech";
import { middleware } from "@/middleware";

// No Portuguese story exists yet (phase 5).
vi.mock("@/lib/story-exists", () => ({
  storyExists: async (slug: string, locale: string) => locale === "en" && slug === "the-little-apple",
}));

beforeAll(() => {
  process.env.NEXTAUTH_SECRET = "test-secret";
});

const voice = (lang: string, name = `Voice ${lang}`) => ({ lang, name }) as SpeechSynthesisVoice;

function request(path: string, cookie?: string) {
  return new NextRequest(`https://alphabes.com${path}`, { headers: cookie ? { cookie } : {} });
}
const rewrite = (res: Response) => {
  const target = res.headers.get("x-middleware-rewrite");
  return target ? new URL(target).pathname : null;
};
const notFoundLocale = (res: Response) => res.headers.get("x-middleware-request-x-alphabes-locale");
const redirect = (res: Response) => {
  const location = res.headers.get("location");
  if (!location) return null;
  const url = new URL(location, "https://alphabes.com");
  return url.pathname + url.search;
};

describe("Portuguese URLs (docs/portuguese-plan.md)", () => {
  it("puts Portuguese under /pt with the approved path words", () => {
    const expected: Partial<Record<AppPathname, string>> = {
      "/": "/pt",
      "/about": "/pt/quem-somos",
      "/activities": "/pt/brincadeiras",
      "/alphabet": "/pt/alfabeto",
      "/contact": "/pt/contato",
      "/cookies": "/pt/cookies",
      "/dashboard": "/pt/minha-conta",
      "/flashcards": "/pt/cartoes",
      "/games": "/pt/jogos",
      "/kindergarten": "/pt/primeiro-ano",
      "/login": "/pt/entrar",
      "/phonics": "/pt/silabas",
      "/preschool": "/pt/educacao-infantil",
      "/pricing": "/pt/precos",
      "/privacy-policy": "/pt/politica-de-privacidade",
      "/register": "/pt/cadastro",
      "/stories": "/pt/historias",
      "/terms": "/pt/termos-de-uso",
      "/worksheets": "/pt/atividades",
      "/worksheets/bundles": "/pt/atividades/pacotes",
    };
    for (const [pathname, path] of Object.entries(expected)) {
      expect(localizedPath("pt", pathname as AppPathname), pathname).toBe(path);
    }
    expect(localizedPath("pt", "/alphabet/[letter]/worksheet", { letter: "a" })).toBe("/pt/alfabeto/a/atividade");
    expect(localizedPath("pt", "/alphabet/[letter]", { letter: "c-cedilha" })).toBe("/pt/alfabeto/c-cedilha");
  });

  it("doesn't match other languages' words under /pt", () => {
    for (const path of ["/pt/pricing", "/pt/precios", "/pt/tarifs", "/pt/abecedario", "/pt/fichas", "/precos", "/alfabeto"]) {
      expect(matchPath(path), path).toBeNull();
    }
    expect(matchPath("/pt/silabas")).toMatchObject({ locale: "pt", pathname: "/phonics" });
    expect(matchPath("/es/silabas")).toMatchObject({ locale: "es", pathname: "/phonics" });
  });

  it("lists only the pages written so far", () => {
    expect(isAvailable("pt", "/pricing")).toBe(true);
    expect(isAvailable("pt", "/blog")).toBe(false);
    expect(isAvailable("pt", "/privacy")).toBe(false);
    for (const pathname of PORTUGUESE_PATHNAMES) expect(isAvailable("pt", pathname)).toBe(true);
  });

  it("gives hreflang pt to Portuguese pages and their twins", () => {
    const languages = {
      en: "https://alphabes.com/pricing",
      fr: "https://alphabes.com/fr/tarifs",
      es: "https://alphabes.com/es/precios",
      pt: "https://alphabes.com/pt/precos",
      "x-default": "https://alphabes.com/pricing",
    };
    expect(alternatesFor("pt", "/pricing")).toEqual({ canonical: "https://alphabes.com/pt/precos", languages });
    expect(alternatesFor("en", "/pricing")).toEqual({ canonical: "https://alphabes.com/pricing", languages });
    // Pages not written in Portuguese get no pt alternate.
    if (!isAvailable("pt", "/alphabet")) expect(alternatesFor("en", "/alphabet").languages).not.toHaveProperty("pt");
  });

  it("maps pages between Portuguese and the other languages", () => {
    expect(counterpartPath(matchPath("/pt/precos")!, "en")).toBe("/pricing");
    expect(counterpartPath(matchPath("/pt/quem-somos")!, "fr")).toBe("/fr/a-propos");
    expect(counterpartPath(matchPath("/es/terminos-de-uso")!, "pt")).toBe("/pt/termos-de-uso");
    expect(counterpartPath(matchPath("/pt")!, "es")).toBe("/es");
    if (!isAvailable("pt", "/games")) {
      expect(counterpartPath(matchPath("/games")!, "pt")).toBeNull();
      expect(sectionFallbackPath(matchPath("/games/find-the-letter")!, "pt")).toBeNull();
    }
  });

  it("404s every Portuguese param until its validator exists", () => {
    if (!isAvailable("pt", "/alphabet/[letter]")) expect(paramsExist("/alphabet/[letter]", { letter: "a" }, "pt")).toBe(false);
  });
});

describe("Portuguese routing in the middleware", () => {
  it("serves written Portuguese pages", async () => {
    expect(rewrite(await middleware(request("/pt/precos")))).toBe("/pt/pricing");
    expect(rewrite(await middleware(request("/pt/quem-somos")))).toBe("/pt/about");
    const home = await middleware(request("/pt"));
    expect(home.status).toBe(200);
    expect(rewrite(home) ?? "/pt").toBe("/pt");
  });

  it("serves the Portuguese 404 page for unknown and unwritten pages", async () => {
    for (const path of ["/pt/xyz", "/pt/pricing", "/pt/precios", "/pt/blog", "/pt/privacidade", "/pt/historias/the-little-apple"]) {
      const res = await middleware(request(path));
      expect(rewrite(res), path).toBe("/_not-found");
      expect(notFoundLocale(res), path).toBe("pt");
    }
    if (!isAvailable("pt", "/alphabet")) expect(notFoundLocale(await middleware(request("/pt/alfabeto")))).toBe("pt");
  });

  it("sends a signed-out visitor to the Portuguese login page", async () => {
    expect(redirect(await middleware(request("/pt/minha-conta")))).toBe("/pt/entrar?next=%2Fpt%2Fminha-conta");
  });

  it("follows the remembered language, both ways", async () => {
    expect(redirect(await middleware(request("/pricing", "NEXT_LOCALE=pt")))).toBe("/pt/precos");
    expect(redirect(await middleware(request("/es/quienes-somos", "NEXT_LOCALE=pt")))).toBe("/pt/quem-somos");
    expect(redirect(await middleware(request("/pt/precos", "NEXT_LOCALE=fr")))).toBe("/fr/tarifs");
    // No Portuguese twin yet: stay.
    expect(redirect(await middleware(request("/blog", "NEXT_LOCALE=pt")))).toBeNull();
  });

  it("never redirects on Accept-Language", async () => {
    const res = await middleware(new NextRequest("https://alphabes.com/pricing", { headers: { "accept-language": "pt-BR,pt;q=0.9" } }));
    expect(redirect(res)).toBeNull();
  });
});

describe("pickVoice for Portuguese", () => {
  it("prefers Brazil, then any Portuguese voice", () => {
    expect(pickVoice([voice("pt-PT"), voice("es-MX"), voice("pt-BR")], "pt")?.lang).toBe("pt-BR");
    expect(pickVoice([voice("pt_BR")], "pt")?.lang).toBe("pt_BR");
    expect(pickVoice([voice("es-ES"), voice("pt-PT")], "pt")?.lang).toBe("pt-PT");
  });

  it("never lets another language read Portuguese", () => {
    expect(pickVoice([voice("es-MX"), voice("en-US"), voice("fr-FR")], "pt")).toBeNull();
  });

  it("keeps the Spanish choice away from Portuguese voices", () => {
    expect(pickVoice([voice("pt-BR"), voice("es-ES")], "es")?.lang).toBe("es-ES");
  });
});

describe("Portuguese in the database and page choice", () => {
  it("stores Portuguese as PT", () => {
    expect(toDbLocale("pt")).toBe("PT");
    expect(fromDbLocale("PT")).toBe("pt");
    for (const locale of routing.locales) expect(fromDbLocale(toDbLocale(locale))).toBe(locale);
  });

  it("byLocale falls back to English only for a missing language", () => {
    expect(byLocale("pt", { en: "en", fr: "fr", es: "es" })).toBe("en");
    expect(byLocale("pt", { en: "en", fr: "fr", es: "es", pt: "pt" })).toBe("pt");
    expect(byLocale("es", { en: "en", fr: "fr", es: "es" })).toBe("es");
  });
});
