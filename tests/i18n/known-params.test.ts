import { describe, expect, it } from "vitest";
import { paramsExist } from "@/lib/i18n/known-params";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { alphabetData } from "@/lib/alphabet-data";
import { blogCategories, blogPosts } from "@/lib/blog-data";
import { games } from "@/lib/games-data";
import { frenchGames } from "@/lib/games-fr";
import { schoolTopics } from "@/lib/ecole-fr";
import { kindergartenTopics } from "@/lib/kindergarten-data";
import { phonicsSkills } from "@/lib/phonics-data";
import { preschoolTopics } from "@/lib/preschool-data";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { getAllWorksheetSlugs } from "@/lib/worksheets-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import { getAllStaticWorksheetSlugs } from "@/lib/static-worksheets-data";
import { getAllBundleSlugs } from "@/lib/worksheet-bundles";

// The same lists the pages' generateStaticParams use: every prerendered page
// must pass the middleware's check, or it would start answering 404.
describe("paramsExist accepts every real page", () => {
  const cases: [Parameters<typeof paramsExist>[0], string, string[]][] = [
    ["/alphabet/[letter]", "letter", getAllLetterSlugs().flatMap((l) => [l, l.toUpperCase()])],
    ["/alphabet/[letter]/worksheet", "letter", alphabetData.flatMap((l) => [l.letter, l.letter.toUpperCase()])],
    ["/blog/[slug]", "slug", [...blogCategories.map((c) => c.slug), ...blogPosts.map((p) => p.slug)]],
    ["/games/[slug]", "slug", games.map((g) => g.slug)],
    ["/kindergarten/[topic]", "topic", kindergartenTopics.map((t) => t.slug)],
    ["/phonics/[skill]", "skill", phonicsSkills.map((s) => s.slug)],
    ["/preschool/[topic]", "topic", preschoolTopics.map((t) => t.slug)],
    [
      "/worksheets/[category]",
      "category",
      [
        ...worksheetCategories.map((c) => c.slug),
        ...WORKSHEET_TYPES.map((t) => t.categorySlug),
        ...getAllWorksheetSlugs(),
        ...staticWorksheetCategories.map((c) => c.slug),
        ...getAllStaticWorksheetSlugs(),
      ],
    ],
    ["/worksheets/bundles/[bundleSlug]", "bundleSlug", getAllBundleSlugs()],
  ];

  for (const [pathname, key, values] of cases) {
    it(`${pathname} (${values.length} pages)`, () => {
      expect(values.length).toBeGreaterThan(0);
      for (const value of values) expect(paramsExist(pathname, { [key]: value }, "en"), value).toBe(true);
      expect(paramsExist(pathname, { [key]: "does-not-exist" }, "en")).toBe(false);
    });
  }

  it("checks French games and topics against the French data", () => {
    for (const g of frenchGames) expect(paramsExist("/games/[slug]", { slug: g.slug }, "fr"), g.slug).toBe(true);
    for (const t of schoolTopics) {
      const pathname = t.level === "maternelle" ? "/preschool/[topic]" : "/kindergarten/[topic]";
      expect(paramsExist(pathname, { topic: t.slug }, "fr"), t.slug).toBe(true);
    }
    expect(paramsExist("/games/[slug]", { slug: "find-the-letter" }, "fr")).toBe(false);
  });

  it("doesn't judge routes it can't check (database-backed)", () => {
    expect(paramsExist("/stories/[slug]", { slug: "anything" }, "en")).toBe(true);
  });
});
