import { existsSync, statSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { alternatesFor, counterpartPath, localizedPath, matchPath, sectionFallbackPath } from "@/lib/i18n/routes";
import {
  FICHE_CATEGORIES,
  LETTER_IMAGES,
  ficheCategoryParams,
  fichePacks,
  fiches,
  fichesForLetter,
  getFiche,
  imageDistractors,
} from "@/lib/fiches-fr";
import { frenchLetters } from "@/lib/letters-fr";
import { getAllWorksheetSlugs } from "@/lib/worksheets-data";
import { ficheBody, letterWords, pageHtml } from "../../scripts/fiches-fr/templates";

const publicFile = (path: string) => join(process.cwd(), "public", path);

describe("French worksheet catalogue", () => {
  it("has unique slugs that never collide with a category", () => {
    const params = ficheCategoryParams();
    expect(new Set(params).size).toBe(params.length);
    expect(new Set(fichePacks.map((p) => p.slug)).size).toBe(fichePacks.length);
  });

  it("gives every category some worksheets, and every letter at least five", () => {
    for (const c of FICHE_CATEGORIES) expect(fiches.some((f) => f.category === c.slug), c.slug).toBe(true);
    for (const l of frenchLetters) expect(fichesForLetter(l.slug).length, l.slug).toBeGreaterThanOrEqual(5);
  });

  it("builds packs from worksheets that exist", () => {
    for (const p of fichePacks) {
      expect(p.fiches.length, p.slug).toBeGreaterThan(0);
      for (const slug of p.fiches) expect(getFiche(slug), `${p.slug} → ${slug}`).toBeDefined();
    }
  });

  it("has a rendered PDF and preview for every worksheet and pack (run npm run fiches:fr)", () => {
    for (const f of fiches) {
      expect(existsSync(publicFile(f.pdf)), f.pdf).toBe(true);
      expect(statSync(publicFile(f.pdf)).size, f.pdf).toBeGreaterThan(10_000);
      expect(existsSync(publicFile(f.preview)), f.preview).toBe(true);
    }
    for (const p of fichePacks) expect(existsSync(publicFile(p.pdf)), p.pdf).toBe(true);
  });

  it("never uses a picture as a distractor when it starts with the target sound", () => {
    for (const [letter, images] of Object.entries(LETTER_IMAGES)) {
      const distractors = imageDistractors(letter);
      expect(distractors, letter).toHaveLength(6);
      for (const d of distractors) {
        const owner = Object.values(LETTER_IMAGES).find((li) => li.yes.includes(d))!;
        expect(owner.key, `${letter}: ${d.word}`).not.toBe(images.key);
      }
    }
  });
});

describe("French worksheet templates", () => {
  it("render every worksheet without throwing", () => {
    for (const f of fiches) {
      const html = pageHtml(f, ficheBody(f));
      expect(html, f.slug).toContain('class="page"');
    }
  });

  it("give every letter two or three words to write", () => {
    for (const l of frenchLetters) expect(letterWords(l).length, l.slug).toBeGreaterThanOrEqual(2);
  });
});

describe("French worksheet routes", () => {
  it("accept French worksheets only in French, English ones only in English", () => {
    for (const slug of ficheCategoryParams()) {
      expect(paramsExist("/worksheets/[category]", { category: slug }, "fr"), slug).toBe(true);
      expect(paramsExist("/worksheets/[category]", { category: slug }, "en"), slug).toBe(false);
    }
    for (const slug of getAllWorksheetSlugs().slice(0, 20))
      expect(paramsExist("/worksheets/[category]", { category: slug }, "fr"), slug).toBe(false);
    for (const p of fichePacks) expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: p.slug }, "fr")).toBe(true);
    expect(paramsExist("/worksheets/bundles/[bundleSlug]", { bundleSlug: "complete-bundle" }, "fr")).toBe(false);
  });

  it("pair the index pages but no worksheet or pack page", () => {
    expect(localizedPath("fr", "/worksheets/[category]", { category: "lettre-a-cursive" })).toBe("/fr/fiches/lettre-a-cursive");
    expect(localizedPath("fr", "/worksheets/bundles")).toBe("/fr/fiches/packs");
    expect(alternatesFor("fr", "/worksheets").languages?.en).toBe("https://alphabes.com/worksheets");
    expect(alternatesFor("fr", "/worksheets/bundles").languages?.fr).toBe("https://alphabes.com/fr/fiches/packs");
    expect(alternatesFor("fr", "/worksheets/[category]", { category: "nombres" })).toEqual({
      canonical: "https://alphabes.com/fr/fiches/nombres",
    });
    expect(alternatesFor("en", "/worksheets/[category]", { category: "letter-a-tracing" })).toEqual({
      canonical: "https://alphabes.com/worksheets/letter-a-tracing",
    });
    expect(counterpartPath(matchPath("/worksheets")!, "fr")).toBe("/fr/fiches");
    expect(counterpartPath(matchPath("/worksheets/letter-a-tracing")!, "fr")).toBeNull();
  });

  it("send the switcher to the worksheet index of the other language", () => {
    expect(sectionFallbackPath(matchPath("/fr/fiches/lettre-a-cursive")!, "en")).toBe("/worksheets");
    expect(sectionFallbackPath(matchPath("/worksheets/letter-a-tracing")!, "fr")).toBe("/fr/fiches");
    expect(sectionFallbackPath(matchPath("/fr/fiches/packs/pack-lettre-a")!, "en")).toBe("/worksheets/bundles");
  });
});
