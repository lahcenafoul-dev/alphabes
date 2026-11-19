// SEO phase 4, B4: the per-letter text on the 286 English letter worksheet pages.
import { describe, expect, it, vi } from "vitest";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { getWorksheetBySlug } from "@/lib/worksheets-data";
import { getStaticWorksheetBySlug } from "@/lib/static-worksheets-data";
import { getBundleBySlug as getWorksheetBundle } from "@/lib/worksheet-bundles";
import { getGame } from "@/lib/games-data";
import { storiesV2 } from "@/prisma/stories-v2";
import { HELVETICA_NOTES, HOW_TO_WRITE, LOOK_ALIKES } from "@/lib/letter-writing";
import { letterGuide, storyFor, type GuideBlock, type GuideType, type Inline } from "@/lib/worksheet-letter-guide";
import { missingWords } from "@/lib/letter-sheet-content";

vi.mock("next/font/google", () => {
  const font = () => ({ className: "", variable: "", style: {} });
  return { Baloo_2: font, Nunito: font, Playwrite_BR: font, Playwrite_FR_Trad: font, Playwrite_MX: font };
});

const LETTERS = getAllLetterSlugs();
const TYPES: GuideType[] = [...WORKSHEET_TYPES.map((t) => t.id), "cursive"];
const text = (blocks: GuideBlock[]) => blocks.map((b) => [b.heading, ...b.paragraphs.map((p) => p.map((x) => (typeof x === "string" ? x : "strong" in x ? x.strong : x.text)).join(""))].join("\n")).join("\n");
const links = (blocks: GuideBlock[]) => blocks.flatMap((b) => b.paragraphs.flat()).filter((x): x is Extract<Inline, { href: string }> => typeof x !== "string" && "href" in x);

describe("letter worksheet guide", () => {
  it("gives all 286 pages an 'On this sheet' and a 'Next step' block", () => {
    for (const type of TYPES)
      for (const l of LETTERS) {
        const ids = letterGuide(type, l).map((b) => b.id);
        expect(ids[0], `${type} ${l}`).toBe("sheet");
        expect(ids.at(-1), `${type} ${l}`).toBe("next");
      }
  });

  it("shows how to write the letter only where the sheet has print letters to write", () => {
    for (const type of TYPES) {
      const has = letterGuide(type, "b").some((b) => b.id === "write");
      expect(has, type).toBe(["tracing", "uppercase", "lowercase", "writing"].includes(type));
    }
    expect(letterGuide("uppercase", "i").find((b) => b.id === "write")!.paragraphs[0][0]).toBe(HELVETICA_NOTES.upper.i);
    expect(letterGuide("tracing", "i").find((b) => b.id === "write")!.paragraphs[0][1]).toContain("across the top");
    expect(letterGuide("lowercase", "a").find((b) => b.id === "write")!.paragraphs[0][0]).toBe(HELVETICA_NOTES.lower.a);
  });

  it("describes the letters as the sheets draw them (checked on the rendered PDFs)", () => {
    expect(Object.keys(HOW_TO_WRITE)).toEqual(LETTERS);
    expect(HOW_TO_WRITE.j.upper).not.toMatch(/across the top/);
    expect(HOW_TO_WRITE.q.lower).not.toMatch(/flick/);
    expect(HOW_TO_WRITE.t.lower).toContain("on the middle line");
    expect(HOW_TO_WRITE.m.upper).toContain("bottom line in the middle");
    expect(HOW_TO_WRITE.y.lower).not.toMatch(/crossing/);
    const all = [...Object.values(HOW_TO_WRITE).flatMap((t) => [t.upper, t.lower]), ...LOOK_ALIKES.map((g) => g.tip)].join(" ");
    expect(all).not.toMatch(/green|start dot|arrow|flick/i);
  });

  it("links only to pages that exist", () => {
    const stories = new Set(storiesV2.map((s) => s.text.EN.slug));
    for (const type of TYPES)
      for (const l of LETTERS)
        for (const { href } of links(letterGuide(type, l))) {
          const m = href.match(/^\/(worksheets|stories|games)\/(?:bundles\/)?(.+)$/);
          expect(m, href).not.toBeNull();
          const [, kind, slug] = m!;
          if (kind === "stories") expect(stories.has(slug), href).toBe(true);
          else if (kind === "games") expect(getGame(slug), href).not.toBeNull();
          else if (href.includes("/bundles/")) expect(getWorksheetBundle(slug), href).not.toBeNull();
          else if (slug !== "letter-review" && slug !== "letter-cursive") expect(getWorksheetBySlug(slug) ?? getStaticWorksheetBySlug(slug), href).not.toBeNull();
        }
  });

  it("names a story word that really is in that story", () => {
    for (const type of TYPES)
      for (const l of LETTERS) {
        const hit = storyFor(l, type);
        if (!hit) continue;
        const story = storiesV2.find((s) => s.text.EN.slug === hit.slug)!;
        expect(hit.word[0], `${type} ${l}`).toBe(l);
        expect(story.text.EN.pages.join(" ").toLowerCase(), `${hit.word} in ${hit.slug}`).toContain(hit.word.toLowerCase());
      }
  });

  it("lists the missing-letter sheet's own words", () => {
    const words = missingWords(getLetterContent("b")!).map(({ word, at }) => `${word.slice(0, at)}_${word.slice(at + 1)}`);
    expect(words).toEqual(["_all", "Ra_bit", "Um_rella"]);
    expect(text(letterGuide("missing-letter", "b"))).toContain("_all, Ra_bit and Um_rella");
    expect(text(letterGuide("missing-letter", "q"))).toContain("one word to complete, _ueen");
  });

  it("gives each page of a letter a text of its own", () => {
    for (const l of LETTERS) {
      const sheets = TYPES.map((t) => letterGuide(t, l).find((b) => b.id === "sheet")!.paragraphs[0].join(""));
      expect(new Set(sheets).size, l).toBe(TYPES.length);
    }
  });
});

describe("pillar category letter tiles", () => {
  it("open the matching sheet type", async () => {
    const { PILLAR_SHEET } = await import("@/app/[locale]/worksheets/[category]/category-en");
    const fragments = new Set([...WORKSHEET_TYPES.map((t) => t.slugFragment)]);
    expect(Object.keys(PILLAR_SHEET).sort()).toEqual(["alphabet", "beginning-sounds", "coloring", "handwriting", "phonics", "tracing"]);
    for (const f of Object.values(PILLAR_SHEET)) expect(fragments.has(f), f).toBe(true);
    expect(PILLAR_SHEET.coloring).toBe("coloring");
    expect(PILLAR_SHEET.handwriting).toBe("writing-practice");
  });
});
