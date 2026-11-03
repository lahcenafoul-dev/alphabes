import { describe, expect, it } from "vitest";
import { allStories, englishStories, frenchAudioPath, frenchStories, portugueseStories, spanishStories } from "@/prisma/stories-data";
import { LEVEL_PAGES } from "@/prisma/stories-v2";

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// What the seed writes (prisma/stories-data.ts, built from prisma/stories-v2).
// The texts themselves are checked in tests/stories-v2.test.ts.
describe("stories (prisma/stories-data.ts)", () => {
  it("has 24 stories in each language, with the page count of their level", () => {
    for (const list of [englishStories, frenchStories, spanishStories, portugueseStories]) {
      expect(list).toHaveLength(24);
      for (const s of list) {
        expect(s.pages.map((p) => p.pageNumber), s.slug).toEqual(Array.from({ length: LEVEL_PAGES[s.level] }, (_, i) => i + 1));
      }
      expect(list.map((s) => s.order)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
    }
    expect(new Set(spanishStories.map((s) => s.locale))).toEqual(new Set(["ES"]));
    expect(new Set(portugueseStories.map((s) => s.locale))).toEqual(new Set(["PT"]));
  });

  it("gives every slug once across all languages", () => {
    const slugs = allStories.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("pairs every story with its twins in the other languages: same pictures, order and ages", () => {
    for (const list of [frenchStories, spanishStories, portugueseStories]) {
      for (const s of list) {
        const en = englishStories.find((e) => e.translationGroup === s.translationGroup)!;
        expect(en, s.slug).toBeDefined();
        expect([s.cover, s.order, s.ageRangeMin, s.ageRangeMax]).toEqual([en.cover, en.order, en.ageRangeMin, en.ageRangeMax]);
        expect(s.pages.map((p) => p.image)).toEqual(en.pages.map((p) => p.image));
      }
    }
  });

  it("points pictures at the converted WebP files, with the old drawn scenes as fallback", () => {
    const apple = englishStories.find((s) => s.translationGroup === "apple")!;
    expect(apple.cover).toBe("/stories/apple/cover-1200.webp");
    expect(apple.coverFallbackScene).toBe("apple-1");
    expect(apple.pages.map((p) => p.fallbackScene)).toEqual(["apple-1", "apple-2", "apple-3", "apple-4", "apple-5", null]);
    const puddles = englishStories.find((s) => s.translationGroup === "puddles")!;
    expect(puddles.pages[0].image).toBe("/stories/puddles/p1-1200.webp");
    expect(puddles.coverFallbackScene).toBeNull();
  });

  it("keeps new French audio apart from the MP3s of the old texts", () => {
    expect(frenchAudioPath("la-petite-pomme", 1)).toBe("/audio/histoires/v2/la-petite-pomme-1.mp3");
  });

  it("avoids words that change from one country to another, and vosotros", () => {
    const regional = [
      "carro", "coche", "platano", "banana", "fresa", "frutilla", "durazno", "melocoton", "jugo", "zumo",
      "pastel", "torta", "papa", "patata", "pina", "anana", "computadora", "ordenador", "coger", "cogio", "camion",
      "pasto", "cesped", "escondidas", "escondite", "vosotros", "podeis", "venid",
    ];
    for (const s of spanishStories) {
      const words = strip([s.title, ...s.pages.map((p) => p.text)].join(" ")).match(/\p{L}+/gu) ?? [];
      for (const w of words) expect(regional, `${s.slug}: ${w}`).not.toContain(w);
    }
  });

  it("writes Brazilian Portuguese: no Portugal-only words or forms, no Spanish", () => {
    const notBrazilian = [
      "autocarro", "comboio", "frigorifico", "sumo", "gelado", "rapariga", "miudo", "relva", "casa-de-banho",
      "estou a", "esta a", "estava a", "vos", "vosso", "pequeno-almoco",
    ];
    const spanish = ["el", "la", "una", "muy", "dice", "pero", "niña", "niño", "cuento", "también"];
    for (const s of portugueseStories) {
      const text = strip([s.title, ...s.pages.map((p) => p.text)].join(" "));
      const words = text.match(/\p{L}+(?:-\p{L}+)*/gu) ?? [];
      for (const w of words) expect(notBrazilian, `${s.slug}: ${w}`).not.toContain(w);
      // Compared with the accents kept: Portuguese "lá" is not Spanish "la".
      const raw = [s.title, ...s.pages.map((p) => p.text)].join(" ").toLowerCase().match(/\p{L}+/gu) ?? [];
      for (const w of raw) expect(spanish, `${s.slug}: ${w}`).not.toContain(w);
      expect(raw, s.slug).not.toContain("bebé"); // Brazil writes bebê
      for (const phrase of notBrazilian.filter((x) => x.includes(" "))) expect(text, s.slug).not.toContain(phrase);
    }
  });
});
