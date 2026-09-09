import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { worksheetCategories, getWorksheetCategory } from "@/lib/worksheet-categories";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { WORKSHEET_TYPES, getWorksheetTypeByCategorySlug } from "@/lib/worksheet-types";
import {
  getWorksheetBySlug,
  getAllWorksheetSlugs,
  getWorksheetsByType,
  getRelatedWorksheets,
  getAdjacentWorksheetInType,
} from "@/lib/worksheets-data";
import { buildBreadcrumbJsonLd, buildLearningResourceJsonLd } from "@/lib/json-ld";
import WorksheetIcon from "@/components/icons/WorksheetIcon";
import PdfDownloadButton from "@/components/worksheets/PdfDownloadButton";
import PrintButton from "@/components/worksheets/PrintButton";

type Props = { params: { category: string } };

const BASE_URL = "https://alphabes.com";

export function generateStaticParams() {
  return [
    ...worksheetCategories.map((c) => ({ category: c.slug })),
    ...WORKSHEET_TYPES.map((t) => ({ category: t.categorySlug })),
    ...getAllWorksheetSlugs().map((slug) => ({ category: slug })),
  ];
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.category;

  const pillar = getWorksheetCategory(slug);
  if (pillar) {
    return {
      title: `${pillar.name} Worksheets`,
      description: pillar.description,
      alternates: { canonical: `${BASE_URL}/worksheets/${pillar.slug}` },
    };
  }

  const type = getWorksheetTypeByCategorySlug(slug);
  if (type) {
    return {
      title: `${type.label} Worksheets A-Z | Free Printable PDFs`,
      description: type.longDescription,
      alternates: { canonical: `${BASE_URL}/worksheets/${type.categorySlug}` },
      openGraph: { title: type.label, description: type.longDescription, url: `${BASE_URL}/worksheets/${type.categorySlug}` },
    };
  }

  const worksheet = getWorksheetBySlug(slug);
  if (worksheet) {
    return {
      title: worksheet.seoTitle,
      description: worksheet.description,
      alternates: { canonical: `${BASE_URL}/worksheets/${worksheet.slug}` },
      openGraph: { title: worksheet.seoTitle, description: worksheet.description, url: `${BASE_URL}/worksheets/${worksheet.slug}` },
    };
  }

  return {};
}

export default function WorksheetCategoryPage({ params }: Props) {
  const slug = params.category;

  const pillar = getWorksheetCategory(slug);
  if (pillar) return <PillarCategoryView category={pillar} />;

  const type = getWorksheetTypeByCategorySlug(slug);
  if (type) return <TypeCategoryView typeId={type.id} />;

  const worksheet = getWorksheetBySlug(slug);
  if (worksheet) return <WorksheetDetailView slug={slug} />;

  notFound();
}

// ---------- Pillar category view (existing behavior, unchanged) ----------

function PillarCategoryView({ category }: { category: NonNullable<ReturnType<typeof getWorksheetCategory>> }) {
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
          <Link
            key={letter}
            href={`/alphabet/${letter}/worksheet`}
            className="rounded-block border border-chalkboard/10 p-4 text-center shadow-block"
          >
            <div className="letter-block bg-crayon-blue aspect-square text-xl mx-auto mb-2">
              {letter.toUpperCase()}
            </div>
            <p className="text-sm font-display font-bold">Letter {letter.toUpperCase()}</p>
            <span className="mt-1 inline-block rounded-full bg-crayon-green/20 text-crayon-green px-2 py-0.5 text-xs font-bold">
              Free
            </span>
          </Link>
        ))}
      </ul>
    </main>
  );
}

// ---------- Worksheet-type category view (new) ----------

function TypeCategoryView({ typeId }: { typeId: (typeof WORKSHEET_TYPES)[number]["id"] }) {
  const type = WORKSHEET_TYPES.find((t) => t.id === typeId)!;
  const items = getWorksheetsByType(typeId);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets">Worksheets</Link> /</li>
          <li aria-current="page" className="font-bold">{type.label}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{type.label} Worksheets (A-Z)</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{type.longDescription}</p>
      <Link
        href={`/worksheets/bundles/${type.categorySlug}-bundle`}
        className="mt-4 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Download all {items.length} as one bundle →
      </Link>

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {items.map((w) => (
          <Link key={w.slug} href={`/worksheets/${w.slug}`} className="rounded-block border border-chalkboard/10 p-4 text-center shadow-block">
            <div className="letter-block bg-crayon-blue aspect-square text-xl mx-auto mb-2">{w.uppercase}</div>
            <p className="text-sm font-display font-bold">Letter {w.uppercase}</p>
          </Link>
        ))}
      </ul>
    </main>
  );
}

// ---------- Individual worksheet detail view (new) ----------

function WorksheetDetailView({ slug }: { slug: string }) {
  const worksheet = getWorksheetBySlug(slug);
  if (!worksheet) return notFound();

  const type = WORKSHEET_TYPES.find((t) => t.id === worksheet.worksheetType)!;
  const related = getRelatedWorksheets(worksheet);
  const prev = getAdjacentWorksheetInType(worksheet, -1);
  const next = getAdjacentWorksheetInType(worksheet, 1);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Worksheets", url: `${BASE_URL}/worksheets` },
    { name: type.label, url: `${BASE_URL}/worksheets/${type.categorySlug}` },
    { name: worksheet.title, url: `${BASE_URL}/worksheets/${worksheet.slug}` },
  ]);
  const learningResourceJsonLd = buildLearningResourceJsonLd({
    title: worksheet.title,
    description: worksheet.description,
    url: `${BASE_URL}/worksheets/${worksheet.slug}`,
    skills: worksheet.skills,
    ageLevelLabel: worksheet.ageLevelLabel,
  });

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60 print:hidden">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets">Worksheets</Link> /</li>
          <li><Link href={`/worksheets/${type.categorySlug}`}>{type.label}</Link> /</li>
          <li aria-current="page" className="font-bold">Letter {worksheet.uppercase}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{worksheet.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{type.shortDescription}</p>

      <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm print:hidden">
        <InfoItem label="Letter" value={`${worksheet.uppercase}${worksheet.lowercase}`} />
        <InfoItem label="Type" value={worksheet.typeLabel} />
        <InfoItem label="Age level" value={worksheet.ageLevelLabel} />
        <InfoItem label="Difficulty" value={worksheet.difficulty} />
      </dl>

      <div className="mt-6 flex flex-wrap gap-2 print:hidden">
        {worksheet.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-crayon-blue/10 text-crayon-blue px-3 py-1 text-xs font-bold">
            {skill}
          </span>
        ))}
      </div>

      <section
        className="worksheet-preview mt-8 rounded-block border border-chalkboard/20 p-8 text-center print:border-none print:rounded-none"
        aria-label="Worksheet preview"
      >
        <p className="text-sm font-bold text-chalkboard/60 print:hidden">Preview</p>
        <div className="mt-4 flex items-center justify-center gap-8">
          <div className="text-7xl font-extrabold text-crayon-blue/30 select-none">
            {worksheet.uppercase}{worksheet.lowercase}
          </div>
          <WorksheetIcon word={worksheet.primaryWord} className="h-24 w-24 text-chalkboard/60" />
        </div>
        <p className="mt-4 text-lg font-display font-bold">{worksheet.primaryWord}</p>
        <p className="mt-2 text-chalkboard/70 max-w-md mx-auto">{worksheet.instructions}</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-4 print:hidden">
        <PrintButton />
        <PdfDownloadButton worksheet={worksheet} />
      </div>

      {worksheet.worksheetType === "tracing" && (
        <p className="mt-4 text-sm text-chalkboard/60 print:hidden">
          Prefer an interactive version?{" "}
          <Link href={`/alphabet/${worksheet.letter}/worksheet`} className="font-bold underline">
            Try the online tracing tool
          </Link>
          .
        </p>
      )}

      <section className="mt-12 print:hidden" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-xl font-bold">
          More Letter {worksheet.uppercase} Worksheets
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related.map((w) => (
            <li key={w.slug}>
              <Link href={`/worksheets/${w.slug}`} className="rounded-block border border-chalkboard/15 px-3 py-1.5 text-sm font-bold hover:border-crayon-blue">
                {w.typeLabel}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href={`/alphabet/${worksheet.letter}`} className="font-bold underline">
            Back to the Letter {worksheet.uppercase} page
          </Link>
        </p>
      </section>

      <nav className="mt-12 flex justify-between text-sm print:hidden" aria-label="Other letters, same worksheet type">
        {prev ? (
          <Link href={`/worksheets/${prev.slug}`} className="font-display font-bold">
            ← Letter {prev.uppercase} {type.label}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/worksheets/${next.slug}`} className="font-display font-bold">
            Letter {next.uppercase} {type.label} →
          </Link>
        ) : <span />}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-block border border-chalkboard/10 p-3">
      <dt className="text-xs uppercase tracking-wide text-chalkboard/50">{label}</dt>
      <dd className="mt-1 font-display font-bold capitalize">{value}</dd>
    </div>
  );
}
