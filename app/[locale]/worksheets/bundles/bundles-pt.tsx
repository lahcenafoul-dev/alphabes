import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ATIVIDADE_CATEGORIES, atividadePacks, type AtividadeCategoryGroup, type AtividadePack } from "@/lib/atividades-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const title = "Pacotes de atividades para imprimir (PDF grátis)";
const description =
  "Várias atividades num só PDF: o alfabeto completo, todas as atividades de uma letra, as famílias silábicas ou um tipo de atividade de A a Z. Grátis, para a educação infantil e o 1º ano.";

export const bundlesMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/worksheets/bundles"),
  openGraph: { title, description, url: absoluteUrl("pt", "/worksheets/bundles") },
};

function PackList({ heading, packs }: { heading: string; packs: AtividadePack[] }) {
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
              <span className="mt-1 block text-xs text-chalkboard/60">{p.atividades.length} atividades</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function BundlesPt() {
  const byGroup = (group: AtividadeCategoryGroup) =>
    ATIVIDADE_CATEGORIES.filter((c) => c.group === group).map((c) => atividadePacks.find((p) => p.slug === `pacote-${c.slug}`)!);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Atividades", url: absoluteUrl("pt", "/worksheets") },
    { name: "Pacotes", url: absoluteUrl("pt", "/worksheets/bundles") },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/worksheets">Atividades</Link> /</li>
          <li aria-current="page" className="font-bold">Pacotes</li>
        </ol>
      </nav>
      <h1 className="mt-4 text-4xl font-extrabold">Os pacotes de atividades</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Várias atividades juntas num só PDF, para imprimir de uma vez: prático para preparar a semana ou as cópias da turma.
      </p>

      <PackList heading="O alfabeto completo" packs={atividadePacks.filter((p) => p.slug === "pacote-alfabeto-completo")} />
      <PackList heading="Um tipo de atividade, de A a Z" packs={byGroup("letras")} />
      <PackList heading="As sílabas" packs={byGroup("silabas")} />
      <PackList heading="Números, formas, cores e palavras frequentes" packs={byGroup("temas")} />
      <PackList heading="Todas as atividades de uma letra" packs={atividadePacks.filter((p) => p.slug.startsWith("pacote-letra-"))} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
