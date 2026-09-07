import { getAllLetterSlugs, getLetterContent } from "./letters-data";
import { wordEmojis } from "./wordEmojis";

export type LetterData = {
  letter: string;
  word: string;
  emoji: string;
};

// A few letters showcase a different example word than letters-data.ts's
// first exampleWord (its list is ordered for phonics teaching, not for this
// chart). "i" showcases a word that isn't in letters-data.ts at all.
const preferredWord: Partial<Record<string, string>> = {
  g: "Grapes",
  h: "Hat",
  i: "Ice cream",
  j: "Juice",
  m: "Moon",
  p: "Pizza",
  r: "Rainbow",
  t: "Tree",
  w: "Watch",
  y: "Yo-yo",
};

// wordEmojis.ts doesn't have (or has a different emoji for) these words.
const emojiOverrides: Record<string, string> = {
  "Ice cream": "🍦",
  Queen: "👑",
  Xylophone: "🎼",
};

export const alphabetData: LetterData[] = getAllLetterSlugs().map((slug) => {
  const exampleWords = getLetterContent(slug)?.exampleWords.map((w) => w.word) ?? [];
  const word = preferredWord[slug] ?? exampleWords.find((w) => wordEmojis[w]) ?? exampleWords[0] ?? slug.toUpperCase();
  const emoji = emojiOverrides[word] ?? wordEmojis[word] ?? "";
  return { letter: slug, word, emoji };
});

export function getLetterData(letter: string) {
  return alphabetData.find((l) => l.letter === letter.toLowerCase());
}