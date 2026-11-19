// What the English static letter sheets put on the page, shared by their
// generator (scripts/worksheets-en/templates.ts) and the worksheet pages that
// describe them (lib/worksheet-letter-guide.ts), so a page never describes a
// sheet that the generator would draw differently.
import { getAllLetterSlugs, getLetterContent, type LetterContent } from "./letters-data";

const SLUGS = getAllLetterSlugs();

/** A letter's first example word, the one its sheets show ("Ball"). */
export const firstWord = (slug: string) => getLetterContent(slug)!.exampleWords[0].word;

/** The other letters a sheet shows: 5, 11 and 17 places on by default (E: J, P, V). */
export const otherLetters = (slug: string, offsets = [5, 11, 17]) => offsets.map((o) => SLUGS[(SLUGS.indexOf(slug) + o) % SLUGS.length]);

/** Up to three words to complete: the letter's word, then other letters' words that contain it. */
export function missingWords(letter: LetterContent): { word: string; at: number }[] {
  const words = [{ word: letter.exampleWords[0].word, at: 0 }];
  for (const slug of SLUGS) {
    if (words.length === 3) break;
    if (slug === letter.slug) continue;
    const w = firstWord(slug);
    const at = w.toLowerCase().indexOf(letter.lowercase);
    if (at > 0) words.push({ word: w, at });
  }
  return words;
}
