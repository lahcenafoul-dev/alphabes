// The line-drawing sheets (data/worksheets/drawings.ts → dot to dot and
// colouring, still drafts in lib/sheets/catalog.ts): every shape is closed;
// on every dot-to-dot sheet the dots and labels touch nothing and the
// finished picture has its corner; on every colour-by-number sheet each part
// has a readable number and no unnumbered sliver. Checked on Letter (English)
// and A4 (French, Spanish, Portuguese).
import { describe, expect, it } from "vitest";
import { DRAFT_KINDS, DRAFT_SHEETS, SHEETS, SHEET_KINDS } from "@/lib/sheets/catalog";
import { SHEET_LOCALES } from "@/lib/sheets/types";
import { DRAWINGS } from "@/data/worksheets/drawings";
import { DOT_COUNT, type DotToDotSheet } from "@/data/worksheets/dot-to-dot";
import type { ColouringSheet } from "@/data/worksheets/colouring";
import { flatten } from "@/lib/sheets/geometry";
import { bodyBox } from "@/scripts/sheets/chrome";
import { colourPlan, dotPlan } from "@/scripts/sheets/drawing-layout";

const PAGES = ["letter", "a4"] as const;
const dotSheets = DRAFT_SHEETS.filter((s) => s.kind === "dot-to-dot") as DotToDotSheet[];
const colourSheets = DRAFT_SHEETS.filter((s) => s.kind === "colouring") as ColouringSheet[];

describe("line drawings", () => {
  it("are made of closed shapes", () => {
    for (const d of DRAWINGS) {
      expect(flatten(d.outline), d.id).toHaveLength(1);
      for (const shape of [d.outline, ...d.regions.map((r) => r.d)]) for (const poly of flatten(shape)) expect(poly.closed, `${d.id}: ${shape.slice(0, 30)}`).toBe(true);
    }
  });

  it("are drafts: no pages, routes or sitemap entries yet", () => {
    expect(SHEET_KINDS.some((k) => DRAFT_KINDS.includes(k))).toBe(false);
    expect(SHEETS.some((s) => DRAFT_SHEETS.includes(s))).toBe(false);
  });

  it("have unique ids, slugs and titles in every language", () => {
    const all = [...SHEETS, ...DRAFT_SHEETS];
    expect(new Set(all.map((s) => `${s.kind}:${s.id}`)).size).toBe(all.length);
    for (const l of SHEET_LOCALES) {
      expect(new Set(all.map((s) => s.slug[l])).size, l).toBe(all.length);
      expect(new Set(all.map((s) => s.title[l])).size, l).toBe(all.length);
    }
  });
});

describe("dot to dot", () => {
  for (const page of PAGES)
    it(`dots and labels touch nothing (${page})`, () => {
      const box = bodyBox(page);
      for (const sheet of dotSheets) {
        const plan = dotPlan(sheet, box);
        expect(plan.problems, `${page} ${sheet.id}`).toEqual([]);
        expect(plan.dots).toHaveLength(DOT_COUNT[sheet.params.level]);
        // Everything inside the body, the corner picture included.
        for (const l of plan.labels) {
          expect(l.rect.x0 + plan.tx, sheet.id).toBeGreaterThanOrEqual(0);
          expect(l.rect.x1 + plan.tx, sheet.id).toBeLessThanOrEqual(box.w);
          expect(l.rect.y0 + plan.ty, sheet.id).toBeGreaterThanOrEqual(0);
          expect(l.rect.y1 + plan.ty, sheet.id).toBeLessThanOrEqual(box.h);
        }
      }
    }, 120_000);
});

describe("colouring", () => {
  for (const page of PAGES)
    it(`every part has a readable number (${page})`, () => {
      const box = bodyBox(page);
      for (const sheet of colourSheets) {
        const plan = colourPlan(sheet, box);
        expect(plan.problems, `${page} ${sheet.id}`).toEqual([]);
        if (sheet.params.version === "plain") continue;
        // Every colour of the key is used, and has its number on the drawing.
        expect(new Set(plan.spots.map((s) => s.n)).size, sheet.id).toBe(plan.paints.length);
        for (const s of plan.spots) expect(s.fs, sheet.id).toBeGreaterThanOrEqual(3.8);
      }
    }, 120_000);
});
