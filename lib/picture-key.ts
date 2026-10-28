// Word pictures (components/WordIllustration.tsx, public/words/ photos and
// the PDF worksheets) are keyed by an English concept name ("apple",
// "fire-truck"). French, Spanish and Portuguese words carry their key in
// their data (`picture: "apple"`); English words are looked up by the word.

/** English words shown with another word's picture ("Ax" is the axe). */
export const ENGLISH_ALIASES: Record<string, string> = {
  ax: "axe",
  jelly: "jellyfish",
  question: "question-mark",
  queen: "crown",
  up: "up-arrow",
  yoyo: "yo-yo",
};

/** The key for an English word: "Ice cream" -> "ice-cream". */
export function pictureKey(word: string) {
  const key = word.trim().toLowerCase().replace(/\s+/g, "-");
  return ENGLISH_ALIASES[key] ?? key;
}
