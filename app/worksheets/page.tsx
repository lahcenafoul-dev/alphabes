import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Printable Worksheets",
  description:
    "Alphabet, tracing, phonics, coloring, and handwriting worksheets for children ages 3-8. Preview free, download instantly.",
  alternates: { canonical: "https://alphabes.com/worksheets" },
};

// Placeholder data shaped exactly like the Worksheet + WorksheetCategory
// Prisma models. In production this page becomes an async Server Component
// that calls `prisma.worksheet.findMany({ where, orderBy, take, skip })`
// with the same filters below, so hundreds of worksheets can be added via
// the admin panel with zero code changes.
const categories = [
  { slug: "alphabet", name: "Alphabet" },
  { slug: "tracing", name: "Tracing" },
  { slug: "phonics", name: "Phonics" },
  { slug: "beginning-sounds", name: "Beginning Sounds" },
  { slug: "coloring", name: "Coloring" },
  { slug: "handwriting", name: "Handwriting" },
  { slug: "cvc-words", name: "CVC Words" },
  { slug: "sight-words", name: "Sight Words" },
];

const sampleWorksheets = [
  {
    slug: "letter-a-tracing",
    title: "Letter A Tracing",
    category: "tracing",
    ageRange: "3-5",
    difficulty: "beginner",
    isPremium: false,
  },
  {
    slug: "letter-b-coloring",
    title: "Letter B Coloring Page",
    category: "coloring",
    ageRange: "3-5",
    difficulty: "beginner",
    isPremium: false,
  },
  {
    slug: "cvc-words-short-a",
    title: "CVC Words: Short A",
    category: "cvc-words",
    ageRange: "5-7",
    difficulty: "intermediate",
    isPremium: true,
  },
];

export default function WorksheetsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Free Printable Worksheets</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Filter by category, age, and skill. Free worksheets download
        instantly; Pro worksheets unlock with a membership.
      </p>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Worksheet categories">
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`/worksheets/${c.slug}`}
            className="rounded-block bg-paper border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue"
          >
            {c.name}
          </a>
        ))}
      </div>

      <ul className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sampleWorksheets.map((w) => (
          <li
            key={w.slug}
            className="rounded-block border border-chalkboard/10 p-5 shadow-block"
          >
            <div className="aspect-[4/3] rounded-block bg-crayon-blue/10 mb-4" />
            <p className="font-display font-bold">{w.title}</p>
            <p className="mt-1 text-sm text-chalkboard/60">
              Ages {w.ageRange} · {w.difficulty}
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                w.isPremium ? "bg-crayon-purple/20 text-crayon-purple" : "bg-crayon-green/20 text-crayon-green"
              }`}
            >
              {w.isPremium ? "Pro" : "Free"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
