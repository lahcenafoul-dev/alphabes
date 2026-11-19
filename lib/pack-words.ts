// The words on the French, Spanish and Portuguese "write words" sheets
// (écrire des mots, escribir palabras, escrever palavras): the letter's words,
// then its words with the sound inside, then the picture words of its sound or
// first-syllable sheet, three at most. Shared by the PDF generators
// (scripts/fiches-fr, scripts/fichas-es, scripts/atividades-pt) and the pack
// pages, so a page names the words its sheet really has.
import type { FrenchLetter, FrenchWord } from "./letters-fr";
import type { SpanishLetter, SpanishWord } from "./letters-es";
import type { PortugueseLetter, PortugueseWord } from "./letters-pt";
import { LETTER_IMAGES } from "./fiches-fr-words";
import { FIRST_SYLLABLE_WORDS as ES_SYLLABLE_WORDS } from "./fichas-es-words";
import { FIRST_SYLLABLE_WORDS as PT_SYLLABLE_WORDS } from "./atividades-pt-words";

const plain = (word: string) => word.replace(/\|/g, "");

function firstThree<W extends { word: string }>(words: W[]): W[] {
  const out: W[] = [];
  for (const w of words) {
    if (out.length < 3 && !out.some((o) => o.word.toLowerCase() === w.word.toLowerCase())) out.push(w);
  }
  return out;
}

export function frenchLetterWords(l: FrenchLetter): FrenchWord[] {
  return firstThree([...l.words, ...(l.wordsInside ?? []), ...(LETTER_IMAGES[l.slug]?.yes ?? [])]);
}

export function spanishLetterWords(l: SpanishLetter): SpanishWord[] {
  const firstSyllable = (ES_SYLLABLE_WORDS[l.slug] ?? []).map((x) => ({ ...x, word: plain(x.word) }));
  return firstThree([...l.words, ...(l.wordsInside ?? []), ...firstSyllable]);
}

export function portugueseLetterWords(l: PortugueseLetter): PortugueseWord[] {
  const firstSyllable = (PT_SYLLABLE_WORDS[l.slug] ?? []).map((x) => ({ ...x, word: plain(x.word) }));
  return firstThree([...l.words, ...(l.wordsInside ?? []), ...firstSyllable]);
}
