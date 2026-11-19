// SEO phase 4, B2a (2026-11-19): the English online tracer /alphabet/x/worksheet
// gave the same PDF as /worksheets/letter-x-tracing, so it 301s there. The
// French, Spanish and Portuguese tracers stay, as twins of each other only.
import { describe, expect, it } from "vitest";
import { alternatesFor, counterpartPath, matchPath } from "@/lib/i18n/routes";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { getWorksheetBySlug } from "@/lib/worksheets-data";
import { sitemapEntries } from "@/lib/sitemap";
const nextConfig = require("../../next.config.js");

describe("the English tracer redirects", () => {
  it("301s /alphabet/x/worksheet (and /alphabet/X/worksheet) to that letter's tracing worksheet", async () => {
    const rules: { source: string; destination: string; statusCode?: number }[] = await nextConfig.redirects();
    for (const letter of getAllLetterSlugs()) {
      for (const p of [letter, letter.toUpperCase()]) {
        const rule = rules.find((r) => r.source === `/alphabet/${p}/worksheet`);
        expect(rule, p).toEqual({ source: `/alphabet/${p}/worksheet`, destination: `/worksheets/letter-${letter}-tracing`, statusCode: 301 });
        expect(getWorksheetBySlug(`letter-${letter}-tracing`), letter).not.toBeNull();
      }
    }
  });
});

describe("hreflang of the French, Spanish and Portuguese tracers", () => {
  it("lists the three of them, never the English redirect", () => {
    expect(alternatesFor("fr", "/alphabet/[letter]/worksheet", { letter: "b" })).toEqual({
      canonical: "https://alphabes.com/fr/alphabet/b/fiche",
      languages: {
        fr: "https://alphabes.com/fr/alphabet/b/fiche",
        es: "https://alphabes.com/es/abecedario/b/ficha",
        pt: "https://alphabes.com/pt/alfabeto/b/atividade",
      },
    });
  });

  it("sends the language switcher to the tracing worksheet in English", () => {
    expect(counterpartPath(matchPath("/es/abecedario/q/ficha")!, "en")).toBe("/worksheets/letter-q-tracing");
    expect(counterpartPath(matchPath("/pt/alfabeto/c-cedilha/atividade")!, "en")).toBeNull();
  });

  it("has no sitemap entry or hreflang alternate pointing at an English tracer URL", async () => {
    const english = /^https:\/\/alphabes\.com\/alphabet\/[^/]+\/worksheet$/;
    for (const e of await sitemapEntries()) {
      expect(e.url).not.toMatch(english);
      for (const href of Object.values(e.alternates?.languages ?? {})) expect(href, e.url).not.toMatch(english);
    }
  });
});
