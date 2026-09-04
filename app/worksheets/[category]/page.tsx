import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { worksheetCategories, getWorksheetCategory } from "@/lib/worksheet-categories";
import { getAllLetterSlugs } from "@/lib/letters-data";

type Props = { params: { category: string } };

export function generateStaticParams() {
  return worksheetCategories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const category = getWorksheetCategory(params.category);
  if (!category) return {};
  return {
    title: `${category.name} Worksheets`,
    description: category.description,
    alternates: { canonical: `https://alphabes.com/worksheets/${category.slug}` },
  };
}

export default function WorksheetCategoryPage({ params }: Props) {
  const category = getWorksheetCategory(params.category);
  if (!category) notFound();

  // In production this becomes:
  // prisma.worksheet.findMany({ where: { category: { slug: category.slug } } })
  const letters = getAllLetterSlugs();

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets">Worksheets</Link> /</li>
          <li aria-current="page" className="font-bold">{category.name}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{category.name} Worksheets</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{category.description}</p>

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {letters.map((letter) => (
          <link key={letter} href={letter} className="rounded-block border border-chalkboard/10 p-4 text-center shadow-block">
            <div className="letter-block bg-crayon-blue aspect-square text-xl mx-auto mb-2">
              {letter.toUpperCase()}
            </div>
            <p className="text-sm font-display font-bold">Letter {letter.toUpperCase()}</p>
            <span className="mt-1 inline-block rounded-full bg-crayon-green/20 text-crayon-green px-2 py-0.5 text-xs font-bold">
              Free
            </span>
          </link>
        ))}
      </ul>
    </main>
  );
}
