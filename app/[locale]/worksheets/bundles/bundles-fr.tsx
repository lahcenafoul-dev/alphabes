import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FICHE_CATEGORIES, fichePacks, type FichePack } from "@/lib/fiches-fr";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Packs de fiches à imprimer (PDF gratuits)";
const description =
  "Plusieurs fiches dans un seul PDF : le pack alphabet complet, toutes les fiches d'une lettre, ou tout un type de fiche de A à Z. Gratuit, pour la maternelle et le CP.";

export const bundlesMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/worksheets/bundles"),
  openGraph: { title, description, url: absoluteUrl("fr", "/worksheets/bundles") },
};

function PackList({ heading, packs }: { heading: string; packs: FichePack[] }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold">{heading}</h2>
      <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {packs.map((p) => (
          <li key={p.slug}>
            <Link
              href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: p.slug } }}
              className="block h-full rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
            >
              <span className="font-display font-bold">{p.title}</span>
              <span className="mt-1 block text-xs text-chalkboard/60">{p.fiches.length} fiches</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BundlesFr() {
  const byType = (group: "lettres" | "themes") =>
    FICHE_CATEGORIES.filter((c) => c.group === group).map((c) => fichePacks.find((p) => p.slug === `pack-${c.slug}`)!);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Fiches", url: absoluteUrl("fr", "/worksheets") },
    { name: "Packs", url: absoluteUrl("fr", "/worksheets/bundles") },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/worksheets">Fiches</Link> /</li>
          <li aria-current="page" className="font-bold">Packs</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">Les packs de fiches</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Plusieurs fiches réunies dans un seul PDF, à imprimer d&apos;un coup : pratique pour préparer une semaine de
        travail ou les photocopies de la classe.
      </p>

      <PackList heading="L'alphabet complet" packs={fichePacks.filter((p) => p.slug === "pack-alphabet-complet")} />
      <PackList heading="Un type de fiche, de A à Z" packs={byType("lettres")} />
      <PackList heading="Nombres, formes, couleurs, sons et syllabes" packs={byType("themes")} />
      <PackList heading="Toutes les fiches d'une lettre" packs={fichePacks.filter((p) => p.slug.startsWith("pack-lettre-"))} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
