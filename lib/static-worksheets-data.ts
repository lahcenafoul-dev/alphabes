// Data for the new, genuinely-new-topic static-PDF worksheets (Mechanism B):
// content with no equivalent in the existing 26-letter x 10-type system.
// Each record points at a real PDF in public/worksheets-pdf/ -- there is no
// client-side generation fallback for these (unlike lib/worksheets-data.ts),
// since a real file already exists for every one of them.
import { getAllLetterSlugs, getLetterContent } from "./letters-data";

export type StaticWorksheetRecord = {
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  categorySlug: string;
  pdfPath: string;
  previewLabel: string;
  skills: string[];
  ageLevelLabel: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const SHAPES = ["circle", "diamond", "heart", "hexagon", "oval", "pentagon", "rectangle", "square", "star", "triangle"];

const COLORS = ["black", "blue", "brown", "green", "orange", "pink", "purple", "red", "white", "yellow"];

const SIGHT_WORDS = ["a", "and", "i", "in", "is", "it", "the", "to", "was", "you"];

const CVC_WORDS = ["bag", "bed", "cat", "cup", "dog", "hat", "pen", "pig", "pot", "sun"];

function cap(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildCursiveWorksheets(): StaticWorksheetRecord[] {
  return getAllLetterSlugs().map((letter) => {
    const content = getLetterContent(letter)!;
    const title = `Letter ${content.uppercase} Cursive Writing Worksheet`;
    return {
      slug: `letter-${letter}-cursive`,
      title,
      description: `Cursive writing practice for the letter ${content.uppercase}${content.lowercase}, with guided strokes to build connected-letter handwriting.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "letter-cursive",
      pdfPath: `/worksheets-pdf/cursive/letter-${letter}-cursive.pdf`,
      previewLabel: `${content.uppercase}${content.lowercase}`,
      skills: ["Cursive handwriting", "Letter formation"],
      ageLevelLabel: "Kindergarten & Early Elementary",
      difficulty: "intermediate",
    };
  });
}

function buildNumberWorksheets(): StaticWorksheetRecord[] {
  return NUMBER_WORDS.map((word, n) => {
    const title = `Number ${n} Tracing Worksheet`;
    return {
      slug: `number-${n}-tracing`,
      title,
      description: `Tracing practice for the number ${n} (${word}), building early number-formation and counting skills.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "numbers",
      pdfPath: `/worksheets-pdf/numbers/number-${n}-tracing.pdf`,
      previewLabel: String(n),
      skills: ["Number formation", "Counting readiness"],
      ageLevelLabel: "Preschool & Pre-K",
      difficulty: "beginner",
    };
  });
}

function buildNumberCursiveWorksheets(): StaticWorksheetRecord[] {
  return NUMBER_WORDS.map((word, n) => {
    const title = `Number ${n} Cursive Writing Worksheet`;
    return {
      slug: `number-${n}-cursive`,
      title,
      description: `Cursive-style tracing practice for the number ${n} (${word}), for children ready for a handwriting challenge.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "numbers-cursive",
      pdfPath: `/worksheets-pdf/numbers-cursive/number-${n}-cursive.pdf`,
      previewLabel: String(n),
      skills: ["Cursive handwriting", "Number formation"],
      ageLevelLabel: "Kindergarten & Early Elementary",
      difficulty: "intermediate",
    };
  });
}

function buildShapeWorksheets(): StaticWorksheetRecord[] {
  return SHAPES.map((shape) => {
    const title = `${cap(shape)} Tracing Worksheet`;
    return {
      slug: `${shape}-tracing`,
      title,
      description: `Tracing practice for a ${shape}, helping children recognize and draw this common shape.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "shapes",
      pdfPath: `/worksheets-pdf/shapes/${shape}-tracing.pdf`,
      previewLabel: cap(shape),
      skills: ["Shape recognition", "Pencil control"],
      ageLevelLabel: "Preschool & Pre-K",
      difficulty: "beginner",
    };
  });
}

function buildColorWorksheets(): StaticWorksheetRecord[] {
  return COLORS.map((color) => {
    const title = `${cap(color)} Color Worksheet`;
    return {
      slug: `${color}-color`,
      title,
      description: `A coloring and recognition worksheet for the color ${color}, building early color-vocabulary skills.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "colors",
      pdfPath: `/worksheets-pdf/colors/${color}-color.pdf`,
      previewLabel: cap(color),
      skills: ["Color recognition", "Fine motor skills"],
      ageLevelLabel: "Preschool & Pre-K",
      difficulty: "beginner",
    };
  });
}

function buildSightWordWorksheets(): StaticWorksheetRecord[] {
  return SIGHT_WORDS.map((word) => {
    const title = `Sight Word "${cap(word)}" Worksheet`;
    return {
      slug: `sight-word-${word}`,
      title,
      description: `Practice recognizing and writing the sight word "${word}," one of the most common words early readers encounter.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "sight-words",
      pdfPath: `/worksheets-pdf/sight-words/sight-word-${word}.pdf`,
      previewLabel: cap(word),
      skills: ["Sight word recognition", "Early reading"],
      ageLevelLabel: "Kindergarten & Early Elementary",
      difficulty: "intermediate",
    };
  });
}

function buildCvcWordWorksheets(): StaticWorksheetRecord[] {
  return CVC_WORDS.map((word) => {
    const title = `CVC Word "${cap(word)}" Worksheet`;
    return {
      slug: `cvc-word-${word}`,
      title,
      description: `A consonant-vowel-consonant word practice page for "${word}," a common first-blending word for early readers.`,
      seoTitle: `${title} | Free Printable PDF`,
      categorySlug: "cvc-words",
      pdfPath: `/worksheets-pdf/cvc-words/cvc-word-${word}.pdf`,
      previewLabel: cap(word),
      skills: ["Blending", "Early reading"],
      ageLevelLabel: "Kindergarten & Early Elementary",
      difficulty: "intermediate",
    };
  });
}

export const staticWorksheets: StaticWorksheetRecord[] = [
  ...buildCursiveWorksheets(),
  ...buildNumberWorksheets(),
  ...buildNumberCursiveWorksheets(),
  ...buildShapeWorksheets(),
  ...buildColorWorksheets(),
  ...buildSightWordWorksheets(),
  ...buildCvcWordWorksheets(),
];

export function getStaticWorksheetBySlug(slug: string): StaticWorksheetRecord | null {
  return staticWorksheets.find((w) => w.slug === slug) ?? null;
}

export function getStaticWorksheetsByCategory(categorySlug: string): StaticWorksheetRecord[] {
  return staticWorksheets.filter((w) => w.categorySlug === categorySlug);
}

export function getAllStaticWorksheetSlugs(): string[] {
  return staticWorksheets.map((w) => w.slug);
}

export function getCursiveWorksheetForLetter(letter: string): StaticWorksheetRecord | null {
  return getStaticWorksheetBySlug(`letter-${letter}-cursive`);
}
