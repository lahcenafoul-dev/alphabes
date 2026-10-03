import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard } from "@/components/fiches/FicheParts";
import BundleDownload from "@/components/billing/BundleDownload";
import { getAtividade, getAtividadePack } from "@/lib/atividades-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

export function packMetadataPt(slug: string): Metadata {
  const pack = getAtividadePack(slug);
  if (!pack) return {};
  const title = `${pack.title} | PDF grátis para imprimir`;
  return {
    title,
    description: pack.description,
    alternates: alternatesFor("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }),
    openGraph: { title, description: pack.description, url: absoluteUrl("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug }) },
  };
}

export default function PackPt({ slug }: { slug: string }) {
  // The page only renders packs listed in lib/atividades-pt.ts.
  const pack = getAtividadePack(slug)!;
  const included = pack.atividades.map((s) => getAtividade(s)!);
  const url = absoluteUrl("pt", "/worksheets/bundles/[bundleSlug]", { bundleSlug: pack.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Atividades", url: absoluteUrl("pt", "/worksheets") },
    { name: "Pacotes", url: absoluteUrl("pt", "/worksheets/bundles") },
    { name: pack.title, url },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/worksheets">Atividades</Link> /</li>
          <li><Link href="/worksheets/bundles">Pacotes</Link> /</li>
          <li aria-current="page" className="font-bold">{pack.title}</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">{pack.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{pack.description}</p>
      <div className="mt-6">
        <BundleDownload locale="pt" slug={pack.slug} />
      </div>

      <h2 className="mt-12 text-2xl font-bold">Neste pacote</h2>
      <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {included.map((a) => (
          <FicheCard key={a.slug} fiche={a} locale="pt" />
        ))}
      </ul>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
