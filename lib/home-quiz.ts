// The home page's Owl Quiz (components/home/OwlQuiz.tsx): six rounds of
// "which picture starts with this letter?". Each language has its own six
// letter → word pairs, taken from that language's alphabet data so the word
// really starts with the letter there (French "canard", not "duck"), and only
// words with a cartoon in public/words/. Built at render time on the server;
// a pick that no longer matches the data fails the build instead of showing
// a wrong answer.
import type { Locale } from "@/i18n/routing";
import { getLetterContent } from "@/lib/letters-data";
import { frenchLetters } from "@/lib/letters-fr";
import { spanishLetters } from "@/lib/letters-es";
import { portugueseLetters } from "@/lib/letters-pt";
import { pictureKey } from "@/lib/picture-key";
import { WORD_PHOTOS } from "@/lib/word-photos";

export type QuizWord = { word: string; picture: string };

export type QuizRound = {
  /** The letter shown on the button ("B"). */
  letter: string;
  /** What the speech engine says when the letter is tapped. */
  spoken: string;
  /** Index of the right answer in options. */
  answer: number;
  options: QuizWord[];
};

// Six [letter, picture key] pairs per language, each with a different letter.
const PICKS: Record<Locale, [string, string][]> = {
  en: [["A", "apple"], ["B", "bear"], ["C", "cat"], ["D", "duck"], ["E", "elephant"], ["F", "fish"]],
  fr: [["A", "bee"], ["B", "banana"], ["C", "duck"], ["L", "lion"], ["P", "apple"], ["T", "turtle"]],
  es: [["A", "bee"], ["B", "whale"], ["C", "rabbit"], ["D", "dolphin"], ["E", "elephant"], ["G", "cat"]],
  pt: [["A", "bee"], ["B", "ball"], ["E", "elephant"], ["G", "cat"], ["P", "duck"], ["U", "bear"]],
};

// Rounds as [answer, options] indexes into the six picks (the design's order).
const ROUNDS: [number, number[]][] = [
  [1, [0, 1, 5]],
  [2, [2, 3, 4]],
  [5, [1, 0, 5]],
  [0, [3, 0, 2]],
  [4, [4, 5, 1]],
  [3, [2, 4, 3]],
];

type Entry = { letter: string; spoken: string; word: string };

function find(locale: Locale, letter: string, picture: string): Entry | undefined {
  if (locale === "en") {
    const content = getLetterContent(letter.toLowerCase());
    const word = content?.exampleWords.find((w) => pictureKey(w.word) === picture)?.word;
    return word ? { letter, spoken: letter, word } : undefined;
  }
  const letters: { upper: string; nameSpoken: string; words: QuizWord[] }[] = {
    fr: frenchLetters,
    es: spanishLetters,
    pt: portugueseLetters,
  }[locale];
  const l = letters.find((x) => x.upper === letter);
  const word = l?.words.find((w) => w.picture === picture)?.word;
  return l && word ? { letter, spoken: l.nameSpoken, word } : undefined;
}

const firstLetter = (word: string) => word.normalize("NFD").charAt(0).toUpperCase();

export function homeQuizRounds(locale: Locale): QuizRound[] {
  const entries = PICKS[locale].map(([letter, picture]) => {
    const entry = find(locale, letter, picture);
    if (!entry || firstLetter(entry.word) !== letter || !WORD_PHOTOS.has(picture)) {
      throw new Error(`Home quiz (${locale}): no word for ${letter} with the picture "${picture}"`);
    }
    return { ...entry, picture, word: entry.word.toLocaleLowerCase(locale) };
  });
  return ROUNDS.map(([answer, options]) => ({
    letter: entries[answer].letter,
    spoken: entries[answer].spoken,
    answer: options.indexOf(answer),
    options: options.map((i) => ({ word: entries[i].word, picture: entries[i].picture })),
  }));
}
