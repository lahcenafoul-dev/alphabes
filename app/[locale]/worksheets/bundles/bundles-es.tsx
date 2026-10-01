import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FICHA_CATEGORIES, fichaPacks, type FichaCategoryGroup, type FichaPack } from "@/lib/fichas-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Paquetes de fichas para imprimir (PDF gratis)";
const description =
  "Varias fichas en un solo PDF: el abecedario completo, todas las fichas de una letra, las sílabas o un tipo de ficha de la A a la Z. Gratis, para preescolar y primero de primaria.";

export const bundlesMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/worksheets/bundles"),
  openGraph: { title, description, url: absoluteUrl("es", "/worksheets/bundles") },
};

function PackList({ heading, packs }: { heading: string; packs: FichaPack[] }) {
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
              <span className="mt-1 block text-xs text-chalkboard/60">{p.fichas.length} fichas</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BundlesEs() {
  const byGroup = (group: FichaCategoryGroup) =>
    FICHA_CATEGORIES.filter((c) => c.group === group).map((c) => fichaPacks.find((p) => p.slug === `paquete-${c.slug}`)!);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Fichas", url: absoluteUrl("es", "/worksheets") },
    { name: "Paquetes", url: absoluteUrl("es", "/worksheets/bundles") },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/worksheets">Fichas</Link> /</li>
          <li aria-current="page" className="font-bold">Paquetes</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">Los paquetes de fichas</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Varias fichas juntas en un solo PDF, para imprimir de una vez: práctico para preparar la semana o las copias del
        grupo.
      </p>

      <PackList heading="El abecedario completo" packs={fichaPacks.filter((p) => p.slug === "paquete-abecedario-completo")} />
      <PackList heading="Un tipo de ficha, de la A a la Z" packs={byGroup("letras")} />
      <PackList heading="Las sílabas" packs={byGroup("silabas")} />
      <PackList heading="Números, figuras, colores y palabras frecuentes" packs={byGroup("temas")} />
      <PackList heading="Todas las fichas de una letra" packs={fichaPacks.filter((p) => p.slug.startsWith("paquete-letra-"))} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
