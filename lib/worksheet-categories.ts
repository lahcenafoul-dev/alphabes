export type WorksheetCategoryContent = {
  slug: string;
  name: string;
  description: string;
};

export const worksheetCategories: WorksheetCategoryContent[] = [
  { slug: "alphabet", name: "Alphabet", description: "Letter recognition and formation practice for every letter A-Z." },
  { slug: "tracing", name: "Tracing", description: "Guided tracing pages to build pencil control and letter shapes." },
  { slug: "phonics", name: "Phonics", description: "Letter-sound, beginning-sound, and blending practice pages." },
  { slug: "coloring", name: "Coloring", description: "Letter-themed coloring pages that reinforce recognition through play." },
  { slug: "handwriting", name: "Handwriting", description: "Line-based handwriting practice for uppercase and lowercase letters." },
];

export function getWorksheetCategory(slug: string): WorksheetCategoryContent | null {
  return worksheetCategories.find((c) => c.slug === slug) ?? null;
}
