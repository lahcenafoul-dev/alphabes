export type PreschoolTopicContent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tips: string[];
  relatedHref: string;
  relatedLabel: string;
};

export const preschoolTopics: PreschoolTopicContent[] = [
  {
    slug: "letter-tracing",
    title: "Preschool Letter Tracing",
    summary: "Build pencil control and letter-shape memory before independent writing.",
    description:
      "Preschoolers usually aren't ready to write letters from memory yet, but tracing lets them practice the motion of a letter shape long before that's expected. Following a dotted line strengthens the same small hand muscles used for holding a pencil, coloring, and eventually writing on their own.",
    tips: [
      "Start with just 2-3 letters at a time instead of the whole alphabet.",
      "A big crayon or chunky pencil is easier to grip than a thin one.",
      "It's fine if the traced line wanders outside the dots at first.",
    ],
    relatedHref: "/worksheets/letter-tracing",
    relatedLabel: "Letter Tracing Worksheets",
  },
  {
    slug: "coloring",
    title: "Preschool Coloring Activities",
    summary: "Use coloring to build fine motor control and letter familiarity through play.",
    description:
      "Coloring doesn't need to be a phonics lesson to be valuable at preschool age. Holding a crayon, staying roughly inside a shape, and choosing colors all build the same fine motor control that later supports handwriting, and a letter-shaped coloring page keeps that letter's shape in view without any pressure to perform.",
    tips: [
      "Let a preschooler pick their own colors — the goal is motor practice, not a \"correct\" picture.",
      "A short coloring session is plenty; there's no need to finish the whole page.",
      "Talking about the letter or word on the page while coloring adds a language boost for free.",
    ],
    relatedHref: "/worksheets/letter-coloring",
    relatedLabel: "Letter Coloring Worksheets",
  },
];

export function getPreschoolTopic(slug: string): PreschoolTopicContent | null {
  return preschoolTopics.find((t) => t.slug === slug) ?? null;
}
