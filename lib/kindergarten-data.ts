export type KindergartenTopicContent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tips: string[];
  relatedHref: string;
  relatedLabel: string;
};

export const kindergartenTopics: KindergartenTopicContent[] = [
  {
    slug: "sight-words",
    title: "Kindergarten Sight Words",
    summary: "Recognize common words instantly, without sounding them out each time.",
    description:
      "Sight words are common words like the, is, and you that show up so often in early books that sounding them out every time would slow a new reader down. Kindergartners are usually encouraged to recognize a small, growing list of these words by sight, freeing up their attention for words they do need to sound out.",
    tips: [
      "Practice a handful of sight words at a time, not a long list at once.",
      "Spotting a sight word in a real book or sign reinforces it better than flashcards alone.",
      "Mixing sight words into simple sentences helps a child see how they're actually used.",
    ],
    relatedHref: "/worksheets/sight-words",
    relatedLabel: "Sight Word Worksheets",
  },
  {
    slug: "handwriting",
    title: "Kindergarten Handwriting",
    summary: "Move from guided tracing to writing letters and words independently.",
    description:
      "By kindergarten, most children are ready to move past tracing and start writing letters on their own, without a dotted outline to follow. This stage focuses on letter size, spacing, and starting each letter in the right place, building toward writing full words and short sentences.",
    tips: [
      "Wide-ruled paper or extra-large practice lines make early independent writing easier to control.",
      "Writing a child's own name is usually the most motivating first word to practice.",
      "Short, frequent writing practice builds more stamina than one long session.",
    ],
    relatedHref: "/worksheets/alphabet-writing-practice",
    relatedLabel: "Handwriting Worksheets",
  },
];

export function getKindergartenTopic(slug: string): KindergartenTopicContent | null {
  return kindergartenTopics.find((t) => t.slug === slug) ?? null;
}
