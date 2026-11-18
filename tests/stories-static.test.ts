import { existsSync } from "fs";
import { join } from "path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { routing } from "@/i18n/routing";
import { buildShortStoryJsonLd } from "@/lib/json-ld";
import { storiesFor, storyBySlug, storyExtras, storyTwins } from "@/lib/stories";
import { ForParents, WholeStory, letterPageFor } from "@/components/stories/StorySections";
import { loadReader } from "@/app/[locale]/stories/[slug]/story-reader";

// SEO phase 3: story pages and lists are built from prisma/stories-v2 at
// build time (static, cached), with the whole text and a "For parents"
// section in the HTML; the reader loads the parent's children in the browser.
describe("stories built from the data files", () => {
  it("has the 24 stories in each language, with every picture on disk", () => {
    for (const locale of routing.locales) {
      const stories = storiesFor(locale);
      expect(stories).toHaveLength(24);
      for (const s of stories) {
        expect(existsSync(join(process.cwd(), "public", s.coverUrl))).toBe(true);
        for (const p of s.pages) expect(existsSync(join(process.cwd(), "public", p.imageUrl))).toBe(true);
      }
    }
  });

  it("finds a story only in its own language, and its twins in the others", () => {
    expect(storyBySlug("la-petite-pomme", "fr")?.title).toBe("La petite pomme");
    expect(storyBySlug("la-petite-pomme", "en")).toBeNull();
    expect(storyTwins("apple", "fr")).toEqual({
      en: { slug: "the-little-apple" },
      es: { slug: "la-manzanita-roja" },
      pt: { slug: "a-macazinha-vermelha" },
    });
  });

  it("has a For parents section in every language: teaches, 3 questions, 4–6 words from the story", () => {
    for (const locale of routing.locales) {
      for (const s of storiesFor(locale)) {
        const extras = storyExtras(s.translationGroup, locale)!;
        expect(extras.teaches.length).toBeGreaterThan(40);
        expect(extras.questions).toHaveLength(3);
        expect(extras.words.length).toBeGreaterThanOrEqual(4);
        expect(extras.words.length).toBeLessThanOrEqual(6);
        const text = `${s.title} ${s.pages.map((p) => p.text).join(" ")}`.toLowerCase();
        for (const w of extras.words) expect(text, `${s.slug}: ${w}`).toContain(w.toLowerCase());
      }
    }
  });
});

describe("letterPageFor", () => {
  it("links a word to its first letter's alphabet page", () => {
    expect(letterPageFor("en", "Apple")?.href).toBe("/alphabet/a");
    expect(letterPageFor("fr", "éléphant")?.href).toBe("/fr/alphabet/e-accent-aigu");
    expect(letterPageFor("fr", "boîte")?.href).toBe("/fr/alphabet/b");
    expect(letterPageFor("es", "árbol")?.href).toBe("/es/abecedario/a");
    expect(letterPageFor("es", "ñandú")?.href).toBe("/es/abecedario/enie");
    expect(letterPageFor("pt", "ovo")?.href).toBe("/pt/alfabeto/o");
    expect(letterPageFor("en", "123")).toBeNull();
  });
});

describe("story sections in the HTML", () => {
  const story = storyBySlug("the-little-apple", "en")!;
  const extras = storyExtras(story.translationGroup, "en")!;

  it("shows every page's text and picture alt text in a visible details block", () => {
    const html = renderToStaticMarkup(createElement(WholeStory, { locale: "en", pages: story.pages, alt: extras.alt }));
    expect(html).toContain("<details");
    expect(html).not.toMatch(/display:\s*none|sr-only|hidden/);
    for (const p of story.pages) expect(html).toContain(p.text.replace(/'/g, "&#x27;"));
    for (const a of extras.alt.slice(1)) expect(html).toContain(`alt="${a.replace(/'/g, "&#x27;")}"`);
  });

  it("renders the For parents section with linked words", () => {
    const html = renderToStaticMarkup(
      createElement(ForParents, { locale: "en", teaches: extras.teaches, questions: extras.questions, words: extras.words }),
    );
    expect(html).toContain("For parents");
    expect(html).toContain('href="/alphabet/a"');
    expect(html).toContain("What did Hazel try first?");
  });

  it("adds teaches, keywords and educationalUse to the ShortStory JSON-LD", () => {
    const ld = buildShortStoryJsonLd("fr", { ...storyBySlug("la-petite-pomme", "fr")!, teaches: "x", keywords: ["pomme", "rouge"] });
    expect(ld).toMatchObject({ teaches: "x", keywords: "pomme, rouge", educationalUse: "Lecture à voix haute", isAccessibleForFree: true });
  });
});

describe("loadReader", () => {
  it("returns the children, those learning the story's language first", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ children: [{ id: "a", firstName: "Ana", language: "EN" }, { id: "b", firstName: "Bea", language: "FR" }] })),
    ) as unknown as typeof fetch;
    await expect(loadReader("fr", fetcher)).resolves.toEqual({
      loggedIn: true,
      children: [{ id: "b", firstName: "Bea" }, { id: "a", firstName: "Ana" }],
    });
  });

  it("is signed out on 401 or a network error", async () => {
    const unauthorized = vi.fn(async () => new Response("{}", { status: 401 })) as unknown as typeof fetch;
    await expect(loadReader("en", unauthorized)).resolves.toEqual({ loggedIn: false, children: [] });
    const offline = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    await expect(loadReader("en", offline)).resolves.toEqual({ loggedIn: false, children: [] });
  });
});
