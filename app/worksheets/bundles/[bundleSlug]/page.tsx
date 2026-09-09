import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBundleBySlug, getAllBundleSlugs } from "@/lib/worksheet-bundles";
import { worksheets } from "@/lib/worksheets-data";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import BundleDownloadButton from "@/components/worksheets/BundleDownloadButton";

type Props = { params: { bundleSlug: string } };

const BASE_URL = "https://alphabes.com";

export function generateStaticParams() {
  return getAllBundleSlugs().map((bundleSlug) => ({ bundleSlug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const bundle = getBundleBySlug(params.bundleSlug);
  if (!bundle) return {};
  return {
    title: `${bundle.title} | Free Printable PDF Bundle`,
    description: bundle.description,
    alternates: { canonical: `${BASE_URL}/worksheets/bundles/${bundle.slug}` },
  };
}

export default function BundleDetailPage({ params }: Props) {
  const bundle = getBundleBySlug(params.bundleSlug);
  if (!bundle) notFound();

  const included = bundle.worksheetSlugs
    .map((slug) => worksheets.find((w) => w.slug === slug))
    .filter((w): w is (typeof worksheets)[number] => Boolean(w));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Worksheets", url: `${BASE_URL}/worksheets` },
    { name: "Bundles", url: `${BASE_URL}/worksheets/bundles` },
    { name: bundle.title, url: `${BASE_URL}/worksheets/bundles/${bundle.slug}` },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets">Worksheets</Link> /</li>
          <li><Link href="/worksheets/bundles">Bundles</Link> /</li>
          <li aria-current="page" className="font-bold">{bundle.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{bundle.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{bundle.description}</p>

      <div className="mt-6">
        <BundleDownloadButton bundle={bundle} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">What's included ({included.length} worksheets)</h2>
        <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {included.map((w) => (
            <li key={w.slug}>
              <Link href={`/worksheets/${w.slug}`} className="block rounded-block border border-chalkboard/10 px-3 py-2 text-sm hover:border-crayon-blue">
                {w.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
