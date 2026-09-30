import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard, PdfButtons } from "@/components/fiches/FicheParts";
import { getFiche, getFichePack } from "@/lib/fiches-fr";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

export function packMetadataFr(slug: string): Metadata {
  const pack = getFichePack(slug);
  if (!pack) return {};
  const title = `${pack.title} | PDF gratuit à imprimer`;
  return {
    title,
    description: pack.description,
    alternates: alternatesFor("fr", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }),
    openGraph: { title, description: pack.description, url: absoluteUrl("fr", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }) },
  };
}

export default function PackFr({ slug }: { slug: string }) {
  // The page only renders packs listed in lib/fiches-fr.ts.
  const pack = getFichePack(slug)!;
  const included = pack.fiches.map((s) => getFiche(s)!);
  const url = absoluteUrl("fr", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Fiches", url: absoluteUrl("fr", "/worksheets") },
    { name: "Packs", url: absoluteUrl("fr", "/worksheets/bundles") },
    { name: pack.title, url },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/worksheets">Fiches</Link> /</li>
          <li><Link href="/worksheets/bundles">Packs</Link> /</li>
          <li aria-current="page" className="font-bold">{pack.title}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">{pack.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{pack.description}</p>
      <div className="mt-6">
        <PdfButtons pdf={pack.pdf} fileName={`alphabes-${pack.slug}.pdf`} pages={included.length} />
      </div>

      <h2 className="mt-12 text-2xl font-bold">Dans ce pack</h2>
      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {included.map((f) => (
          <FicheCard key={f.slug} fiche={f} />
        ))}
      </ul>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
