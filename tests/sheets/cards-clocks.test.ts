// The flash card sets (data/worksheets/flash-cards.ts) and the telling-time
// sheets (data/worksheets/telling-time.ts): every card has its cartoon and a
// word in every language, sets fill 2 to 4 pages, and the clocks say the
// time the way each language does.
import { existsSync } from "fs";
import { describe, expect, it } from "vitest";
import { CARDS_PER_PAGE, flashCardPictures, flashCardsSheets } from "@/data/worksheets/flash-cards";
import { digital, tellingTimeSheets, timeWords, type Time } from "@/data/worksheets/telling-time";
import { SHEET_LOCALES } from "@/lib/sheets/types";

describe("flash cards", () => {
  it("only draw cartoons that exist", () => {
    for (const p of flashCardPictures()) expect(existsSync(`public/words/${p}.webp`), p).toBe(true);
  });

  it("have a word on every card in every language, and 2 to 4 pages", () => {
    for (const sheet of flashCardsSheets) {
      const pages = Math.ceil(sheet.params.cards.length / CARDS_PER_PAGE);
      expect(pages, sheet.id).toBeGreaterThanOrEqual(2);
      expect(pages, sheet.id).toBeLessThanOrEqual(4);
      expect(sheet.pages, sheet.id).toBe(pages);
      for (const card of sheet.params.cards)
        for (const l of SHEET_LOCALES) {
          const word = card.word[l];
          expect(word, `${sheet.id} ${l}`).toBeTruthy();
          // A letter card's word holds its letter (accents aside).
          if (card.type === "letter") expect(word!.normalize("NFD").toLowerCase(), `${sheet.id} ${l}`).toContain(card.lower);
        }
    }
  });
});

describe("telling time", () => {
  it("says the time the way each language does", () => {
    const say = (t: Time) => SHEET_LOCALES.map((l) => timeWords(t, l));
    expect(say([3, 30])).toEqual(["It's half past three.", "Il est trois heures et demie.", "Son las tres y media.", "São três e meia."]);
    expect(say([11, 45])).toEqual(["It's quarter to twelve.", "Il est midi moins le quart.", "Son las doce menos cuarto.", "São quinze para o meio-dia."]);
    expect(say([12, 45])).toEqual(["It's quarter to one.", "Il est une heure moins le quart.", "Es la una menos cuarto.", "São quinze para a uma."]);
    expect(say([1, 0])).toEqual(["It's one o'clock.", "Il est une heure.", "Es la una.", "É uma hora."]);
    expect(say([3, 5])).toEqual(["It's three oh five.", "Il est trois heures cinq.", "Son las tres y cinco.", "São três e cinco."]);
    expect(say([3, 40])).toEqual(["It's three forty.", "Il est quatre heures moins vingt.", "Son las cuatro menos veinte.", "São três e quarenta."]);
    expect(say([1, 21])).toEqual(["It's one twenty-one.", "Il est une heure vingt et une.", "Es la una y veintiuno.", "É uma e vinte e um."]);
    expect(digital([3, 5], "fr")).toBe("3 h 05");
    expect(digital([3, 0], "fr")).toBe("3 h");
    expect(digital([3, 5], "en")).toBe("3:05");
  });

  it("puts each clock of a sheet on a different hour, at its level's minutes", () => {
    const minutes: Record<string, (m: number) => boolean> = {
      oclock: (m) => m === 0,
      half: (m) => m === 30,
      quarter: (m) => m === 15 || m === 45,
      five: (m) => m % 5 === 0 && m % 15 !== 0,
      any: (m) => m % 5 !== 0,
    };
    for (const sheet of tellingTimeSheets) {
      const { level, times } = sheet.params;
      if (level === null) continue;
      expect(new Set(times.map(([h]) => h)).size, sheet.id).toBe(times.length);
      for (const [h, m] of times) {
        expect(h >= 1 && h <= 12, sheet.id).toBe(true);
        expect(minutes[level](m), `${sheet.id} ${h}:${m}`).toBe(true);
      }
    }
  });
});
