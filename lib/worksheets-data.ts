// Central worksheet data table: 26 letters x 10 worksheet types, derived
// programmatically from the already-authored lib/letters-data.ts vocabulary
// and the lib/worksheet-types.ts type registry. Nothing here touches a
// database -- it's a pure function computed once at module load, matching
// the same pattern as lib/phonics-data.ts and lib/blog-data.ts. In a future
// admin-managed phase this could be read from the (currently unused) Prisma
// Worksheet/WorksheetCategory models instead.

import { getAllLetterSlugs, getLetterContent, type ExampleWord } from "./letters-data";
import { WORKSHEET_TYPES, type WorksheetTypeId } from "./worksheet-types";

export type WorksheetRecord = {
  id: string;
  slug: string;
  letter: string;
  uppercase: string;
  lowercase: string;
  worksheetType: WorksheetTypeId;
  typeLabel: string;
  categorySlug: string;
  title: string;
  description: string;
  seoTitle: string;
  ageRangeMin: number;
  ageRangeMax: number;
  ageLevelLabel: string;
  skills: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string;
  exampleWords: ExampleWord[];
  primaryWord: string;
  orderInType: number;
};

function ageLevelLabel(min: number, max: number): string {
  if (max <= 4) return "Preschool";
  if (max <= 5) return "Preschool & Pre-K";
  if (max <= 6) return "Pre-K & Kindergarten";
  return "Kindergarten & Early Elementary";
}

function buildWorksheets(): WorksheetRecord[] {
  const letters = getAllLetterSlugs();
  const records: WorksheetRecord[] = [];

  WORKSHEET_TYPES.forEach((type) => {
    letters.forEach((letter, letterIndex) => {
      const content = getLetterContent(letter);
      if (!content) return;

      const { uppercase, lowercase, exampleWords } = content;
      const primaryWord = exampleWords[0]?.word ?? uppercase;
      const [ageMin, ageMax] = type.defaultAgeRange;
      const title = type.titleTemplate(uppercase);

      records.push({
        id: `${letter}-${type.id}`,
        slug: `letter-${letter}-${type.slugFragment}`,
        letter,
        uppercase,
        lowercase,
        worksheetType: type.id,
        typeLabel: type.label,
        categorySlug: type.categorySlug,
        title,
        description: `Free printable ${type.label.toLowerCase()} worksheet for the letter ${uppercase}${lowercase}. ${type.shortDescription} Perfect for ${ageLevelLabel(ageMin, ageMax).toLowerCase()}.`,
        seoTitle: `${title} | Free Printable PDF`,
        ageRangeMin: ageMin,
        ageRangeMax: ageMax,
        ageLevelLabel: ageLevelLabel(ageMin, ageMax),
        skills: type.defaultSkills,
        difficulty: type.defaultDifficulty,
        instructions: type.instructions(uppercase, lowercase, primaryWord),
        exampleWords,
        primaryWord,
        orderInType: letterIndex,
      });
    });
  });

  return records;
}

export const worksheets: WorksheetRecord[] = buildWorksheets();

export function getAllWorksheetSlugs(): string[] {
  return worksheets.map((w) => w.slug);
}

export function getWorksheetBySlug(slug: string): WorksheetRecord | null {
  return worksheets.find((w) => w.slug === slug) ?? null;
}

export function getWorksheetsByLetter(letter: string): WorksheetRecord[] {
  const lower = letter.toLowerCase();
  return worksheets
    .filter((w) => w.letter === lower)
    .sort((a, b) => WORKSHEET_TYPES.findIndex((t) => t.id === a.worksheetType) - WORKSHEET_TYPES.findIndex((t) => t.id === b.worksheetType));
}

export function getWorksheetsByType(typeId: WorksheetTypeId): WorksheetRecord[] {
  return worksheets.filter((w) => w.worksheetType === typeId).sort((a, b) => a.orderInType - b.orderInType);
}

export function getRelatedWorksheets(worksheet: WorksheetRecord): WorksheetRecord[] {
  return getWorksheetsByLetter(worksheet.letter).filter((w) => w.slug !== worksheet.slug);
}

export function getAdjacentWorksheetInType(worksheet: WorksheetRecord, dir: -1 | 1): WorksheetRecord | null {
  const inType = getWorksheetsByType(worksheet.worksheetType);
  const idx = inType.findIndex((w) => w.slug === worksheet.slug);
  if (idx === -1) return null;
  const nextIdx = (idx + dir + inType.length) % inType.length;
  return inType[nextIdx] ?? null;
}
