import type { Metadata } from "next";
import { SheetTypesSection } from "@/components/sheets/SheetPages";
import Link from "next/link";
import { worksheetCategories } from "@/lib/worksheet-categories";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";
import { worksheets } from "@/lib/worksheets-data";
import { staticWorksheetCategories } from "@/lib/static-worksheet-categories";
import WorksheetLibrary, { type LibraryCardData } from "@/components/worksheets/WorksheetLibrary";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import JsonLd from "@/components/JsonLd";
import { buildCollectionPageJsonLd, buildLocaleBreadcrumbJsonLd } from "@/lib/json-ld";
import { sheetKindItems } from "@/lib/hub-json-ld";

export const worksheetsMetadataEn: Metadata = {
  title: "Free Printable Alphabet Worksheets",
  description:
    "260+ free printable alphabet worksheets: tracing, uppercase, lowercase, recognition, beginning sounds, coloring, matching, missing letter, writing practice, and review for every letter A-Z.",
  alternates: alternatesFor("en", "/worksheets"),
};

export default function WorksheetsEn() {
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

  const url = absoluteUrl("en", "/worksheets");
  const page = (slug: string) => absoluteUrl("en", "/worksheets/[category]", { category: slug });
  const jsonLd = [
    buildLocaleBreadcrumbJsonLd("en", [{ name: "Worksheets", url }]),
    // The topics and types this page links to, in its order.
    buildCollectionPageJsonLd("en", {
      name: "Free Printable Alphabet Worksheets",
      description: worksheetsMetadataEn.description as string,
      url,
      items: [
        ...worksheetCategories.map((c) => ({ name: c.name, url: page(c.slug) })),
        ...WORKSHEET_TYPES.map((t) => ({ name: t.label, url: page(t.categorySlug) })),
        { name: "Bundles", url: absoluteUrl("en", "/worksheets/bundles") },
        ...staticWorksheetCategories.map((c) => ({ name: c.name, url: page(c.slug) })),
        ...sheetKindItems("en"),
      ],
    }),
  ];

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <JsonLd data={jsonLd} />
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

      <SheetTypesSection locale="en" />

      <WorksheetLibrary items={items} />
    </main>
  );
}
