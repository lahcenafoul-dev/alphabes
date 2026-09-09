// Registry of the 10 worksheet types offered for every letter. This drives
// worksheet slugs (letter-{a..z}-{slugFragment}), the 10 type-category pages
// under /worksheets/{categorySlug}, and which PDF template (lib/pdf/index.ts)
// renders a given worksheet.

export type WorksheetTypeId =
  | "tracing"
  | "uppercase"
  | "lowercase"
  | "recognition"
  | "beginning-sounds"
  | "coloring"
  | "matching"
  | "missing-letter"
  | "writing"
  | "review";

export type WorksheetTypeDef = {
  id: WorksheetTypeId;
  categorySlug: string;
  slugFragment: string;
  label: string;
  shortDescription: string;
  longDescription: string;
  defaultSkills: string[];
  defaultAgeRange: [number, number];
  defaultDifficulty: "beginner" | "intermediate" | "advanced";
  instructions: (uppercase: string, lowercase: string, word: string) => string;
  titleTemplate: (uppercase: string) => string;
};

export const WORKSHEET_TYPES: WorksheetTypeDef[] = [
  {
    id: "tracing",
    categorySlug: "letter-tracing",
    slugFragment: "tracing",
    label: "Letter Tracing",
    shortDescription: "Trace the uppercase and lowercase letter with dotted guides.",
    longDescription:
      "Guided tracing practice with large dotted uppercase and lowercase letters, multiple practice rows, and space for independent writing. Builds pencil control and letter-shape memory.",
    defaultSkills: ["Letter formation", "Pencil control", "Handwriting"],
    defaultAgeRange: [3, 5],
    defaultDifficulty: "beginner",
    instructions: (u, l) => `Trace the dotted ${u} and ${l}, then try writing them on your own.`,
    titleTemplate: (u) => `Letter ${u} Tracing Worksheet`,
  },
  {
    id: "uppercase",
    categorySlug: "uppercase-letters",
    slugFragment: "uppercase",
    label: "Uppercase Letter Practice",
    shortDescription: "Find, circle, trace, and write the uppercase letter.",
    longDescription:
      "A focused practice page for the uppercase letter only: a large model letter, tracing, a find-and-circle activity, and independent writing practice.",
    defaultSkills: ["Uppercase recognition", "Letter formation"],
    defaultAgeRange: [3, 5],
    defaultDifficulty: "beginner",
    instructions: (u) => `Find and circle every uppercase ${u}, then trace and write it yourself.`,
    titleTemplate: (u) => `Uppercase Letter ${u} Worksheet`,
  },
  {
    id: "lowercase",
    categorySlug: "lowercase-letters",
    slugFragment: "lowercase",
    label: "Lowercase Letter Practice",
    shortDescription: "Find, circle, trace, and write the lowercase letter.",
    longDescription:
      "A focused practice page for the lowercase letter only: a large model letter, tracing, a find-and-circle activity, and independent writing practice.",
    defaultSkills: ["Lowercase recognition", "Letter formation"],
    defaultAgeRange: [4, 6],
    defaultDifficulty: "beginner",
    instructions: (_u, l) => `Find and circle every lowercase ${l}, then trace and write it yourself.`,
    titleTemplate: (u) => `Lowercase Letter ${u} Worksheet`,
  },
  {
    id: "recognition",
    categorySlug: "letter-recognition",
    slugFragment: "recognition",
    label: "Letter Recognition",
    shortDescription: "Spot the letter among look-alike distractors.",
    longDescription:
      "A mixed grid of uppercase and lowercase letters, including similar-looking distractors, for the child to find and circle every matching letter — building fast, confident letter recognition.",
    defaultSkills: ["Letter recognition", "Visual discrimination"],
    defaultAgeRange: [4, 6],
    defaultDifficulty: "beginner",
    instructions: (u, l) => `Circle every ${u} and ${l} you can find in the grid below.`,
    titleTemplate: (u) => `Letter ${u} Recognition Worksheet`,
  },
  {
    id: "beginning-sounds",
    categorySlug: "beginning-sounds-practice",
    slugFragment: "beginning-sounds",
    label: "Beginning Sounds",
    shortDescription: "Match pictures to the letter that starts their name.",
    longDescription:
      "Simple picture-and-word rows for practicing the beginning sound of the letter, with an activity to circle the pictures whose name starts with the target letter.",
    defaultSkills: ["Phonemic awareness", "Beginning sounds"],
    defaultAgeRange: [4, 6],
    defaultDifficulty: "intermediate",
    instructions: (u, l, word) => `Say each picture's name out loud. Circle the pictures that start with ${u}${l}, like "${word}."`,
    titleTemplate: (u) => `Letter ${u} Beginning Sound Worksheet`,
  },
  {
    id: "coloring",
    categorySlug: "letter-coloring",
    slugFragment: "coloring",
    label: "Letter Coloring",
    shortDescription: "Color a large letter and a simple matching picture.",
    longDescription:
      "A printer-friendly coloring page featuring a large outline letter and a simple original illustration of a word that starts with it — reinforcing letter-word association through open-ended coloring.",
    defaultSkills: ["Letter recognition", "Fine motor skills"],
    defaultAgeRange: [3, 5],
    defaultDifficulty: "beginner",
    instructions: (u, l, word) => `Color the letter ${u}${l} and the picture of the ${word.toLowerCase()}.`,
    titleTemplate: (u) => `Letter ${u} Coloring Worksheet`,
  },
  {
    id: "matching",
    categorySlug: "letter-picture-matching",
    slugFragment: "matching",
    label: "Letter & Picture Matching",
    shortDescription: "Draw a line from the letter to its matching picture.",
    longDescription:
      "A two-column matching activity pairing the uppercase and lowercase letter with simple pictures of words that start with that letter.",
    defaultSkills: ["Letter-sound association", "Visual matching"],
    defaultAgeRange: [4, 6],
    defaultDifficulty: "intermediate",
    instructions: (u, l) => `Draw a line from ${u} and ${l} to the picture that starts with that letter.`,
    titleTemplate: (u) => `Match Letter ${u} Worksheet`,
  },
  {
    id: "missing-letter",
    categorySlug: "missing-letter",
    slugFragment: "missing-letter",
    label: "Missing Letter",
    shortDescription: "Fill in the missing letter in a word and the alphabet.",
    longDescription:
      "Fill-in-the-blank practice: complete a word that's missing its first letter, and complete a short run of the alphabet with the target letter missing.",
    defaultSkills: ["Letter recognition", "Sequencing", "Spelling readiness"],
    defaultAgeRange: [5, 7],
    defaultDifficulty: "intermediate",
    instructions: (u, l, word) => `Write the missing letter ${u}${l} to complete the word and the alphabet sequence, like "${word}."`,
    titleTemplate: (u) => `Missing Letter ${u} Worksheet`,
  },
  {
    id: "writing",
    categorySlug: "alphabet-writing-practice",
    slugFragment: "writing-practice",
    label: "Alphabet Writing Practice",
    shortDescription: "More handwriting practice lines.",
    longDescription:
      "Extended handwriting practice with guided tracing rows followed by independent writing lines for both the uppercase and lowercase letter, building writing stamina.",
    defaultSkills: ["Handwriting", "Letter formation", "Writing stamina"],
    defaultAgeRange: [5, 7],
    defaultDifficulty: "intermediate",
    instructions: (u, l) => `Trace ${u} and ${l} on the guided lines, then write them again on your own.`,
    titleTemplate: (u) => `Letter ${u} Writing Practice Worksheet`,
  },
  {
    id: "review",
    categorySlug: "letter-review",
    slugFragment: "review",
    label: "Letter Review",
    shortDescription: "A mixed-skill review combining every activity type.",
    longDescription:
      "A one-page review combining tracing, recognition, beginning sounds, and writing so caregivers can quickly check whether a child has mastered the letter.",
    defaultSkills: ["Letter recognition", "Tracing", "Beginning sounds", "Writing"],
    defaultAgeRange: [5, 7],
    defaultDifficulty: "advanced",
    instructions: (u, l, word) => `Trace ${u}${l}, circle every matching letter, and circle the picture that starts with ${u}, like "${word}."`,
    titleTemplate: (u) => `Letter ${u} Review Worksheet`,
  },
];

export function getWorksheetType(id: string): WorksheetTypeDef | null {
  return WORKSHEET_TYPES.find((t) => t.id === id) ?? null;
}

export function getWorksheetTypeByCategorySlug(slug: string): WorksheetTypeDef | null {
  return WORKSHEET_TYPES.find((t) => t.categorySlug === slug) ?? null;
}
