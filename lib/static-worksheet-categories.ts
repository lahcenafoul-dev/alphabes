// Category registry for the new, genuinely-new-topic static-PDF worksheets
// (Mechanism B from the integration plan) -- content with no equivalent in
// the existing 26-letter x 10-type system. "sight-words" and "cvc-words"
// intentionally reuse the exact slugs that used to be placeholder pillar
// categories in lib/worksheet-categories.ts (stub pages showing a generic
// 26-letter grid) -- same URL, now with real, correctly-shaped content.
export type StaticWorksheetCategory = {
  slug: string;
  name: string;
  description: string;
};

export const staticWorksheetCategories: StaticWorksheetCategory[] = [
  {
    slug: "letter-cursive",
    name: "Cursive Writing",
    description: "Cursive letter-formation practice for every letter A-Z.",
  },
  {
    slug: "numbers",
    name: "Number Tracing",
    description: "Tracing practice for numbers 0-9.",
  },
  {
    slug: "numbers-cursive",
    name: "Cursive Numbers",
    description: "Cursive-style tracing practice for numbers 0-9.",
  },
  {
    slug: "shapes",
    name: "Shape Tracing",
    description: "Tracing practice for common shapes.",
  },
  {
    slug: "colors",
    name: "Colors",
    description: "Color recognition and coloring practice.",
  },
  {
    slug: "sight-words",
    name: "Sight Words",
    description: "Practice pages for common sight words young readers see often.",
  },
  {
    slug: "cvc-words",
    name: "CVC Words",
    description: "Simple consonant-vowel-consonant word practice pages.",
  },
];

export function getStaticWorksheetCategory(slug: string): StaticWorksheetCategory | null {
  return staticWorksheetCategories.find((c) => c.slug === slug) ?? null;
}
