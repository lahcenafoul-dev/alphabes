import type { Metadata } from "next";
import Link from "next/link";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { worksheets } from "@/lib/worksheets-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import WorksheetLibrary, { type LibraryCardData } from "@/components/worksheets/WorksheetLibrary";

export const metadata: Metadata = {
  title: "Free Printable Alphabet Worksheets",
  description:
    "260+ free printable alphabet worksheets: tracing, uppercase, lowercase, recognition, beginning sounds, coloring, matching, missing letter, writing practice, and review for every letter A-Z.",
  alternates: { canonical: "https://alphabes.com/worksheets" },
};

export default function WorksheetsPage() {
  const items: LibraryCardData[] = worksheets.map((w) => ({
    slug: w.slug,
    title: w.title,
    letter: w.letter,
    uppercase: w.uppercase,
    worksheetType: w.worksheetType,
    typeLabel: w.typeLabel,
    ageLevelLabel: w.ageLevelLabel,
    difficulty: w.difficulty,
    primaryWord: w.primaryWord,
  }));

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Free Printable Alphabet Worksheets</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        {worksheets.length}+ worksheets across 10 activity types for every letter, A to Z. Preview free, print, or
        download instantly as a PDF.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Worksheet categories">
        {worksheetCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/worksheets/${c.slug}`}
            className="rounded-block bg-paper border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <nav className="mt-3 flex flex-wrap gap-2" aria-label="Worksheet types">
        {WORKSHEET_TYPES.map((t) => (
          <Link
            key={t.id}
            href={`/worksheets/${t.categorySlug}`}
            className="rounded-block bg-crayon-blue/10 text-crayon-blue px-4 py-2 text-sm font-display font-bold hover:bg-crayon-blue/20"
          >
            {t.label}
          </Link>
        ))}
        <Link
          href="/worksheets/bundles"
          className="rounded-block bg-crayon-purple/10 text-crayon-purple px-4 py-2 text-sm font-display font-bold hover:bg-crayon-purple/20"
        >
          Bundles
        </Link>
      </nav>

      <nav className="mt-3 flex flex-wrap gap-2" aria-label="More worksheet topics">
        {staticWorksheetCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/worksheets/${c.slug}`}
            className="rounded-block bg-crayon-green/10 text-crayon-green px-4 py-2 text-sm font-display font-bold hover:bg-crayon-green/20"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      <WorksheetLibrary items={items} />
    </main>
  );
}
