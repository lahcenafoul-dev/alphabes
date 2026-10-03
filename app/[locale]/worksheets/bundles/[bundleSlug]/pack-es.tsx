import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard } from "@/components/fiches/FicheParts";
import BundleDownload from "@/components/billing/BundleDownload";
import { getFicha, getFichaPack } from "@/lib/fichas-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

export function packMetadataEs(slug: string): Metadata {
  const pack = getFichaPack(slug);
  if (!pack) return {};
  const title = `${pack.title} | PDF gratis para imprimir`;
  return {
    title,
    description: pack.description,
    alternates: alternatesFor("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }),
    openGraph: { title, description: pack.description, url: absoluteUrl("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }) },
  };
}

export default function PackEs({ slug }: { slug: string }) {
  // The page only renders packs listed in lib/fichas-es.ts.
  const pack = getFichaPack(slug)!;
  const included = pack.fichas.map((s) => getFicha(s)!);
  const url = absoluteUrl("es", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Fichas", url: absoluteUrl("es", "/worksheets") },
    { name: "Paquetes", url: absoluteUrl("es", "/worksheets/bundles") },
    { name: pack.title, url },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/worksheets">Fichas</Link> /</li>
          <li><Link href="/worksheets/bundles">Paquetes</Link> /</li>
          <li aria-current="page" className="font-bold">{pack.title}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">{pack.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{pack.description}</p>
      <div className="mt-6">
        <BundleDownload locale="es" slug={pack.slug} />
      </div>

      <h2 className="mt-12 text-2xl font-bold">En este paquete</h2>
      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {included.map((f) => (
          <FicheCard key={f.slug} fiche={f} locale="es" />
        ))}
      </ul>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
