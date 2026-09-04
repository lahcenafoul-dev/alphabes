export type LetterData = {
  letter: string;
  word: string;
  emoji: string;
};

export const alphabetData: LetterData[] = [
  { letter: "a", word: "Apple", emoji: "🍎" },
  { letter: "b", word: "Ball", emoji: "⚽" },
  { letter: "c", word: "Cat", emoji: "🐱" },
  { letter: "d", word: "Dog", emoji: "🐶" },
  { letter: "e", word: "Elephant", emoji: "🐘" },
  { letter: "f", word: "Fish", emoji: "🐟" },
  { letter: "g", word: "Grapes", emoji: "🍇" },
  { letter: "h", word: "Hat", emoji: "🎩" },
  { letter: "i", word: "Ice cream", emoji: "🍦" },
  { letter: "j", word: "Juice", emoji: "🧃" },
  { letter: "k", word: "Kite", emoji: "🪁" },
  { letter: "l", word: "Lion", emoji: "🦁" },
  { letter: "m", word: "Moon", emoji: "🌙" },
  { letter: "n", word: "Nest", emoji: "🪺" },
  { letter: "o", word: "Orange", emoji: "🍊" },
  { letter: "p", word: "Pizza", emoji: "🍕" },
  { letter: "q", word: "Queen", emoji: "👑" },
  { letter: "r", word: "Rainbow", emoji: "🌈" },
  { letter: "s", word: "Sun", emoji: "☀️" },
  { letter: "t", word: "Tree", emoji: "🌳" },
  { letter: "u", word: "Umbrella", emoji: "☂️" },
  { letter: "v", word: "Van", emoji: "🚐" },
  { letter: "w", word: "Watch", emoji: "⌚" },
  { letter: "x", word: "Xylophone", emoji: "🎼" },
  { letter: "y", word: "Yo-yo", emoji: "🪀" },
  { letter: "z", word: "Zebra", emoji: "🦓" },
];

export function getLetterData(letter: string) {
  return alphabetData.find((l) => l.letter === letter.toLowerCase());
}