// The "how to draw" and body parts sheets (scripts/sheets/art-layout.ts): 4 to
// 6 pictures with a practice box, and body-parts lines that cross no other
// line, box or part. Checked on Letter (English) and A4 (the other languages).
import { describe, expect, it } from "vitest";
import { HOW_TO_DRAW, howToDrawSheets, stepCount } from "@/data/worksheets/how-to-draw";
import { BODY_SUBJECTS, bodyPartsSheets } from "@/data/worksheets/body-parts";
import { SHEET_LOCALES } from "@/lib/sheets/types";
import { bodyPlan, howToDrawPlan } from "@/scripts/sheets/art-layout";
import { bodyBox } from "@/scripts/sheets/chrome";

const PAGES = ["letter", "a4"] as const;

describe("how to draw", () => {
  it("has 4 to 6 pictures, each step adding something", () => {
    for (const h of HOW_TO_DRAW) {
      expect(stepCount(h), h.id).toBeGreaterThanOrEqual(4);
      expect(stepCount(h), h.id).toBeLessThanOrEqual(6);
    }
  });

  for (const page of PAGES)
    it(`fits the pictures and a big practice box (${page})`, () => {
      for (const sheet of howToDrawSheets) expect(howToDrawPlan(sheet, bodyBox(page)).problems, sheet.id).toEqual([]);
    });
});

describe("body parts", () => {
  it("names every part in every language, once", () => {
    for (const b of BODY_SUBJECTS)
      for (const l of SHEET_LOCALES) {
        const words = b.labels.map((x) => x.word[l]);
        expect(new Set(words).size, `${b.id} ${l}`).toBe(words.length);
      }
  });

  for (const page of PAGES)
    it(`draws lines that cross no other line, box or part (${page})`, () => {
      for (const sheet of bodyPartsSheets) {
        const plan = bodyPlan(sheet, bodyBox(page));
        expect(plan.problems, sheet.id).toEqual([]);
        if (sheet.params.version === "match") plan.boxes.forEach((box) => expect(box.word, sheet.id).not.toBe(box.label));
      }
    });
});
