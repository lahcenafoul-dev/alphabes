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
};

export const games: GameContent[] = [
  {
    slug: "find-the-letter",
    title: "Find the Letter",
    description: "Spot the target letter among a grid of letters as fast as you can.",
    isPremium: false,
  },
  {
    slug: "match-letter-picture",
    title: "Match Letter and Picture",
    description: "Match each letter to the picture that starts with its sound.",
    isPremium: false,
  },
  {
    slug: "beginning-sound",
    title: "Beginning Sound",
    description: "Listen to a word and choose the letter that matches its first sound.",
    isPremium: true,
  },
  {
    slug: "letter-tracing",
    title: "Letter Tracing",
    description: "Trace uppercase and lowercase letters on screen with your finger or mouse.",
    isPremium: true,
  },
  {
    slug: "alphabet-quiz",
    title: "Alphabet Quiz",
    description: "A quick multiple-choice quiz covering letter names and sounds.",
    isPremium: true,
  },
];

export function getGame(slug: string): GameContent | null {
  return games.find((g) => g.slug === slug) ?? null;
}
