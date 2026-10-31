// The line-drawing sheets (data/worksheets/drawings.ts → dot to dot and
// colouring): every shape is closed; the hand-placed 1–10 dots are ten;
// on every dot-to-dot sheet the dots and labels touch nothing and the
// finished picture has its corner; on every colour-by-number sheet each part
// has a readable number and no unnumbered sliver. Checked on Letter (English)
// and A4 (French, Spanish, Portuguese).
import { describe, expect, it } from "vitest";
import { sheetsOfKind } from "@/lib/sheets/catalog";
import { DRAWINGS } from "@/data/worksheets/drawings";
import { DOT_COUNT, type DotToDotSheet } from "@/data/worksheets/dot-to-dot";
import type { ColouringSheet } from "@/data/worksheets/colouring";
import { flatten } from "@/lib/sheets/geometry";
import { bodyBox } from "@/scripts/sheets/chrome";
import { colourPlan, dotPlan } from "@/scripts/sheets/drawing-layout";

const PAGES = ["letter", "a4"] as const;
const dotSheets = sheetsOfKind("dot-to-dot") as DotToDotSheet[];
const colourSheets = sheetsOfKind("colouring") as ColouringSheet[];

describe("line drawings", () => {
  it("are made of closed shapes", () => {
    for (const d of DRAWINGS) {
      expect(flatten(d.outline), d.id).toHaveLength(1);
      for (const shape of [d.outline, ...d.regions.map((r) => r.d)]) for (const poly of flatten(shape)) expect(poly.closed, `${d.id}: ${shape.slice(0, 30)}`).toBe(true);
    }
  });

  it("have unique ids", () => {
    expect(new Set(DRAWINGS.map((d) => d.id)).size).toBe(DRAWINGS.length);
  });

  it("only make the dot-to-dot levels they read well at, with ten hand-placed dots for 1–10", () => {
    for (const d of DRAWINGS) {
      expect(d.levels.length, d.id).toBeGreaterThan(0);
      // Ten automatic dots don't make a recognisable picture (the owner's review).
      if (d.levels.includes("easy")) expect(d.dots?.easy, d.id).toHaveLength(10);
      for (const [level, dots] of Object.entries(d.dots ?? {})) {
        expect(d.levels, d.id).toContain(level);
        expect(dots, `${d.id} ${level}`).toHaveLength(DOT_COUNT[level as keyof typeof DOT_COUNT]);
      }
    }
  });

  it("make a colouring page and a colour-by-number sheet each", () => {
    expect(colourSheets).toHaveLength(2 * DRAWINGS.length);
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

  it("numbers every piece, even pieces of one region that meet only at a corner", () => {
    // The kite's yellow quarters (top left, bottom right) and red ones touch at its centre.
    const kite = colourSheets.find((s) => s.id === "kite-number")!;
    expect(colourPlan(kite, bodyBox("letter")).spots.map((s) => s.n).sort()).toEqual([1, 1, 2, 2]);
  });
});
