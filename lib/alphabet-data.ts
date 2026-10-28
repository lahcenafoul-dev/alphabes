import { getAllLetterSlugs, getLetterContent } from "./letters-data";

export type LetterData = {
  letter: string;
  /** Pictured by components/WordIllustration.tsx. */
  word: string;
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

export const alphabetData: LetterData[] = getAllLetterSlugs().map((slug) => {
  const word = preferredWord[slug] ?? getLetterContent(slug)?.exampleWords[0]?.word ?? slug.toUpperCase();
  return { letter: slug, word };
});

export function getLetterData(letter: string) {
  return alphabetData.find((l) => l.letter === letter.toLowerCase());
}
