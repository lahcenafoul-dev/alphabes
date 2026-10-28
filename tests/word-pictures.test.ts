import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { pictureKey } from "@/components/WordIllustration";
import { hasIllustration } from "@/components/illustrations";
import { WORD_PHOTOS } from "@/lib/word-photos";
import { pictureEmoji } from "@/scripts/picture-emoji";
import { allPictureKeys, dataPictureKeys, englishWords } from "@/scripts/word-photo-keys";

describe("word pictures", () => {
  const keys = dataPictureKeys();

  it("finds the French, Spanish and Portuguese picture keys", () => {
    expect(keys.length).toBeGreaterThan(300);
  });

  it("draws every picture used by the French, Spanish and Portuguese words", () => {
    expect(keys.filter((k) => !hasIllustration(k))).toEqual([]);
  });

  it("keeps an emoji for every picture printed in the pre-rendered PDFs", () => {
    for (const k of keys) expect(() => pictureEmoji(k), k).not.toThrow();
  });

  it("knows the picture of every English example word and alphabet chart word", () => {
    // A known key: a drawing in components/illustrations/ or a cartoon in public/words/ (jelly -> jellyfish).
    const known = (k: string) => hasIllustration(k) || WORD_PHOTOS.has(k);
    expect(englishWords().filter((w) => !known(pictureKey(w)))).toEqual([]);
  });
});

describe("word photos", () => {
  const dir = path.resolve(__dirname, "../public/words");
  const creditsFile = path.join(dir, "credits.json");
  const credits: { word: string; source: string; photographer: string; license: string; own?: boolean }[] = existsSync(creditsFile)
    ? JSON.parse(readFileSync(creditsFile, "utf8"))
    : [];

  it("lists only word picture keys", () => {
    const all = allPictureKeys();
    expect([...WORD_PHOTOS].filter((k) => !all.includes(k))).toEqual([]);
  });

  it("has a small WebP file for every listed picture, and no Pixabay photo", () => {
    for (const k of WORD_PHOTOS) {
      const file = path.join(dir, `${k}.webp`);
      expect(existsSync(file), k).toBe(true);
      expect(statSync(file).size, k).toBeLessThanOrEqual(45 * 1024);
      // Only the site's own cartoons, never photos, so every card matches (the photos are in public/words-old/).
      expect(credits.find((c) => c.word === k && !c.own), k).toBeUndefined();
    }
  });

  it("lists every picture file a word uses", () => {
    const missing = allPictureKeys().filter((k) => existsSync(path.join(dir, `${k}.webp`)) && !WORD_PHOTOS.has(k));
    expect(missing, "run node scripts/fetch-word-photos.mjs --review").toEqual([]);
  });
});
