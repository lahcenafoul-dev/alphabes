import Link from "next/link";
import type { Metadata } from "next";
import { bundles, type BundleRecord } from "@/lib/worksheet-bundles";

export const metadata: Metadata = {
  title: "Worksheet Bundles",
  description: "Download complete, letter, or worksheet-type bundles as a single printable PDF.",
  alternates: { canonical: "https://alphabes.com/worksheets/bundles" },
};

export default function BundlesIndexPage() {
  const complete = bundles.filter((b) => b.kind === "complete");
  const letterBundles = bundles.filter((b) => b.kind === "letter");
  const typeBundles = bundles.filter((b) => b.kind === "type");

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets">Worksheets</Link> /</li>
          <li aria-current="page" className="font-bold">Bundles</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Worksheet Bundles</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Download several worksheets at once as a single, real, multi-page PDF.
      </p>

      <BundleSection title="Complete Bundle" bundles={complete} />
      <BundleSection title="Letter Bundles (A-Z)" bundles={letterBundles} />
      <BundleSection title="Worksheet Type Bundles" bundles={typeBundles} />
    </main>
  );
}

function BundleSection({ title, bundles }: { title: string; bundles: BundleRecord[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {bundles.map((b) => (
          <li key={b.slug} className="rounded-block border border-chalkboard/10 p-4 shadow-block">
            <Link href={`/worksheets/bundles/${b.slug}`} className="font-display font-bold hover:text-crayon-blue">
              {b.title}
            </Link>
            <p className="mt-1 text-xs text-chalkboard/60">{b.worksheetSlugs.length} worksheets</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
