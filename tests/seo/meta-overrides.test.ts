import { describe, expect, it } from "vitest";
import { META_OVERRIDES } from "@/lib/seo/meta-overrides";
import { MAX_TITLE, completeSocial, fitTitle } from "@/lib/social-metadata";
import { isAvailable, matchPath } from "@/lib/i18n/routes";
import { paramsExist } from "@/lib/i18n/known-params";
import { blogCategories } from "@/lib/blog-data";

// docs/seo-batch2-proposals.md: rules R1 and R2, the hand-rewritten titles and descriptions.
describe("fitTitle (R1, R2)", () => {
  it("adds the brand only when the title stays within 60 characters", () => {
    expect(fitTitle("Pricing")).toBe("Pricing | AlphaBes");
    expect(fitTitle("Free Alphabet Worksheets & Activities for Kids | AlphaBes")).toBe("Free Alphabet Worksheets & Activities for Kids | AlphaBes");
    expect(fitTitle("The Brave Little Bear: A Short Story to Read and Listen To")).toBe("The Brave Little Bear: A Short Story to Read and Listen To");
  });

  it("shortens or drops a worksheet suffix that doesn't fit", () => {
    expect(fitTitle("Letter A Tracing Worksheet | Free Printable PDF")).toBe("Letter A Tracing Worksheet | Free Printable PDF | AlphaBes");
    expect(fitTitle("Uppercase Letter Practice Worksheets Bundle (A-Z) | Free Printable PDF Bundle")).toBe(
      "Uppercase Letter Practice Worksheets Bundle (A-Z) | AlphaBes",
    );
    expect(fitTitle("El número 19 (diecinueve): escribir y colorear | Ficha PDF gratis")).toBe(
      "El número 19 (diecinueve): escribir y colorear (PDF gratis)",
    );
    expect(fitTitle("Reconhecer a letra Z nos quatro tipos de letra | Atividade em PDF grátis")).toBe(
      "Reconhecer a letra Z nos quatro tipos de letra (PDF grátis)",
    );
    expect(fitTitle("Le c et le g : son dur, son doux : fiche à imprimer | Fiche PDF gratuite")).toBe(
      "Le c et le g : son dur, son doux : fiche à imprimer",
    );
  });

  it("is applied to every page through completeSocial, with the overrides first", () => {
    const m = completeSocial("fr", { title: "Tarifs", description: "x".repeat(80), alternates: { canonical: "https://alphabes.com/fr/tarifs" } });
    expect(m.title).toEqual({ absolute: "AlphaBes Pro : formules et tarifs | AlphaBes" });
    expect(m.openGraph?.title).toBe("AlphaBes Pro : formules et tarifs");
  });
});

describe("META_OVERRIDES", () => {
  const categories = new Set(blogCategories.map((c) => `/blog/${c.slug}`));

  it("only names real pages", () => {
    for (const path of Object.keys(META_OVERRIDES)) {
      const match = matchPath(path);
      expect(match, path).not.toBeNull();
      expect(isAvailable(match!.locale, match!.pathname), path).toBe(true);
      if (!categories.has(path)) expect(paramsExist(match!.pathname, match!.params, match!.locale), path).toBe(true);
    }
  });

  it("keeps every title within 60 characters as shown, and every description within 70–160", () => {
    for (const [path, { title, description }] of Object.entries(META_OVERRIDES)) {
      if (title) expect(fitTitle(title).length, `${path}: ${title}`).toBeLessThanOrEqual(MAX_TITLE);
      if (description) {
        expect(description.length, `${path}: ${description}`).toBeGreaterThanOrEqual(70);
        expect(description.length, `${path}: ${description}`).toBeLessThanOrEqual(160);
      }
    }
  });
});
