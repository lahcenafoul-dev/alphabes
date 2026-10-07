export type GameSlug =
  | "find-the-letter"
  | "match-letter-picture"
  | "beginning-sound"
  | "letter-tracing"
  | "alphabet-quiz";

export type GameContent = {
  slug: GameSlug;
  title: string;
  description: string;
  isPremium: boolean;
  /** "How to play", checked against the game component. */
  howToPlay: string;
  /** "What your child practices". */
  practices: string;
};

export const games: GameContent[] = [
  {
    slug: "find-the-letter",
    title: "Find the Letter",
    description: "Spot the target letter among a grid of letters as fast as you can.",
    isPremium: false,
    howToPlay:
      "A letter is shown at the top. Find it among the 24 letters below and tap it: each right answer scores a point and brings a new letter, and a wrong tap simply says \"Try again\". A timer shows how long you've been playing.",
    practices: "Recognizing uppercase letters quickly among many others.",
  },
  {
    slug: "match-letter-picture",
    title: "Match Letter and Picture",
    description: "Match each letter to the picture that starts with its sound.",
    isPremium: false,
    howToPlay:
      "Each round shows a letter and four pictures. Tap the picture whose name starts with that letter. A wrong tap says \"Try again\", and after 10 rounds you see your score.",
    practices: "Linking each letter to words that start with it.",
  },
  {
    slug: "beginning-sound",
    title: "Beginning Sound",
    description: "Listen to a word and choose the letter that matches its first sound.",
    isPremium: true,
    howToPlay:
      "A word appears with a 🔊 Listen button to hear it. Choose, among four letters, the one the word starts with. There are 10 rounds, then your score.",
    practices: "Hearing the first sound of a word and linking it to its letter.",
  },
  {
    slug: "letter-tracing",
    title: "Letter Tracing",
    description: "Trace uppercase and lowercase letters on screen with your finger or mouse.",
    isPremium: true,
    howToPlay:
      "Trace the dotted letter on the screen with a finger or a mouse, then tap \"Done, Next Letter\". Switch between uppercase and lowercase at any time; the game goes through all 26 letters.",
    practices: "Letter shapes in uppercase and lowercase, and the hand control to write them.",
  },
  {
    slug: "alphabet-quiz",
    title: "Alphabet Quiz",
    description: "A quick multiple-choice quiz covering letter names and sounds.",
    isPremium: true,
    howToPlay:
      "Ten multiple-choice questions, each with four letters to choose from: which letter comes next in the alphabet, which letter makes a sound, or which letter a picture's name starts with. Your score shows at the end.",
    practices: "What your child already knows: alphabet order, letter sounds and first letters.",
  },
];

export function getGame(slug: string): GameContent | null {
  return games.find((g) => g.slug === slug) ?? null;
}
