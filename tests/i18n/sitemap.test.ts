import { describe, expect, it, vi } from "vitest";

// The release date is baked in at build time; fix it for the test.
vi.stubEnv("RELEASE_DATE", "2026-10-07T12:00:00.000Z");

// Stand-in for the database: two stories with their own update dates.
const stories = [
  { slug: "the-little-apple", locale: "EN", translationGroup: null, updatedAt: new Date("2026-09-01T08:00:00Z") },
  { slug: "la-petite-pomme", locale: "FR", translationGroup: null, updatedAt: new Date("2026-09-15T09:30:00Z") },
];
vi.mock("next/cache", () => ({ unstable_cache: (fn: () => unknown) => fn }));
vi.mock("@/lib/prisma", () => ({ getPrisma: () => ({ story: { findMany: async () => stories } }) }));

const { default: sitemap } = await import("@/app/sitemap");

describe("sitemap lastmod", () => {
  it("uses the release date for pages in the code and each story's own date", async () => {
    const first = await sitemap();
    const release = new Date("2026-10-07T12:00:00.000Z").getTime();
    const storyUrls = new Map([
      ["https://alphabes.com/stories/the-little-apple", "2026-09-01T08:00:00Z"],
      ["https://alphabes.com/fr/histoires/la-petite-pomme", "2026-09-15T09:30:00Z"],
    ]);

    expect(first.length).toBeGreaterThan(1000);
    for (const e of first) {
      const story = storyUrls.get(e.url);
      expect(new Date(e.lastModified!).getTime(), e.url).toBe(story ? new Date(story).getTime() : release);
    }
    expect(first.filter((e) => storyUrls.has(e.url))).toHaveLength(2);
  });

  it("gives the same lastmod values on every request", async () => {
    const lastmods = async () => (await sitemap()).map((e) => [e.url, new Date(e.lastModified!).toISOString()]);
    const a = await lastmods();
    await new Promise((r) => setTimeout(r, 5));
    expect(await lastmods()).toEqual(a);
  });
});
