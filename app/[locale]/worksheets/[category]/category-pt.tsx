import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FicheCard, FichePreview, PdfButtons } from "@/components/fiches/FicheParts";
import {
  ATIVIDADE_CATEGORIES,
  atividadeNeighbors,
  atividadesForLetter,
  atividadesInCategory,
  getAtividade,
  getAtividadeCategory,
  getAtividadePack,
  getSyllableSheet,
  type Atividade,
  type AtividadeCategory,
} from "@/lib/atividades-pt";
import { SITE_URL, absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { CEDILHA_SLUG, getPortugueseLetter } from "@/lib/letters-pt";
import { getPortugueseSyllablePage } from "@/lib/silabas-pt";

export function categoryMetadataPt(slug: string): Metadata {
  const url = absoluteUrl("pt", "/worksheets/[category]", { category: slug });
  const alternates = alternatesFor("pt", "/worksheets/[category]", { category: slug });
  const category = getAtividadeCategory(slug);
  if (category) {
    const title = `${category.name}: atividades grátis para imprimir`;
    return { title, description: category.description, alternates, openGraph: { title, description: category.description, url } };
  }
  const a = getAtividade(slug);
  if (!a) return {};
  const title = `${a.title} | Atividade em PDF grátis`;
  return { title, description: a.description, alternates, openGraph: { title, description: a.description, url, images: [SITE_URL + a.preview] } };
}

export default function CategoryPt({ slug }: { slug: string }) {
  const category = getAtividadeCategory(slug);
  if (category) return <CategoryView category={category} />;
  // The page only renders params listed by atividadeCategoryParams().
  return <AtividadeView atividade={getAtividade(slug)!} />;
}

function Breadcrumb({ items }: { items: { label: string; category?: string }[] }) {
  return (
    <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60 print:hidden">
      <ol className="flex flex-wrap gap-2">
        <li><Link href="/">Início</Link> /</li>
        <li><Link href="/worksheets">Atividades</Link> /</li>
        {items.map((item, i) =>
          i < items.length - 1 && item.category ? (
            <li key={item.label}>
              <Link href={{ pathname: "/worksheets/[category]", params: { category: item.category } }}>{item.label}</Link> /
            </li>
          ) : (
            <li key={item.label} aria-current="page" className="font-bold">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

function CategoryView({ category }: { category: AtividadeCategory }) {
  const items = atividadesInCategory(category.slug);
  const pack = getAtividadePack(`pacote-${category.slug}`);
  const url = absoluteUrl("pt", "/worksheets/[category]", { category: category.slug });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Atividades", url: absoluteUrl("pt", "/worksheets") },
    { name: category.name, url },
  ]);
  const others = ATIVIDADE_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name }]} />
      <h1 className="mt-4 text-4xl font-extrabold">{category.name}: atividades para imprimir</h1>
      <p className="mt-3 text-lg text-chalkboard/70 max-w-3xl">{category.intro}</p>
      <p className="mt-3 text-sm text-chalkboard/60">
        {items.length} atividades · {category.level} · {category.skills.join(", ")}
      </p>
      {pack && (
        <Link
          href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: pack.slug } }}
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Imprimir tudo: o pacote de {items.length} atividades →
        </Link>
      )}

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((a) => (
          <FicheCard key={a.slug} fiche={a} locale="pt" />
        ))}
      </ul>

      <section className="mt-16" aria-labelledby="other-heading">
        <h2 id="other-heading" className="text-2xl font-bold">
          Outras atividades
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {others.map((c) => (
            <li key={c.slug}>
              <Link
                href={{ pathname: "/worksheets/[category]", params: { category: c.slug } }}
                className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold text-sm hover:border-crayon-blue transition-colors"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-block bg-chalkboard/5 p-3">
      <dt className="text-xs text-chalkboard/60">{label}</dt>
      <dd className="font-display font-bold">{value}</dd>
    </div>
  );
}

function AtividadeView({ atividade: a }: { atividade: Atividade }) {
  const category = getAtividadeCategory(a.category)!;
  const { prev, next } = atividadeNeighbors(a.slug);
  const letter = a.letter ? getPortugueseLetter(a.letter) : undefined;
  const ofLetter = letter?.slug === CEDILHA_SLUG ? "do Ç" : `da letra ${letter?.upper}`;
  const syllablePages = a.syllables ? getSyllableSheet(a.syllables)!.pages.map((p) => getPortugueseSyllablePage(p)!) : [];
  const siblings = letter ? atividadesForLetter(letter.slug).filter((x) => x.slug !== a.slug) : [];
  const url = absoluteUrl("pt", "/worksheets/[category]", { category: a.slug });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Atividades", url: absoluteUrl("pt", "/worksheets") },
    { name: category.name, url: absoluteUrl("pt", "/worksheets/[category]", { category: category.slug }) },
    { name: a.label, url },
  ]);
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: a.title,
    description: a.description,
    url,
    inLanguage: "pt-BR",
    educationalLevel: a.level,
    learningResourceType: "Worksheet",
    teaches: a.skills.join(", "),
    isAccessibleForFree: true,
    image: SITE_URL + a.preview,
    encoding: { "@type": "MediaObject", contentUrl: SITE_URL + a.pdf, encodingFormat: "application/pdf" },
  };

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <Breadcrumb items={[{ label: category.name, category: category.slug }, { label: a.label }]} />

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">{a.title}</h1>
          <p className="mt-3 text-chalkboard/70">{a.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <InfoItem label="Nível" value={a.level} />
            <InfoItem label="Tipo de atividade" value={category.name} />
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2">
            {a.skills.map((s) => (
              <li key={s} className="rounded-full bg-crayon-blue/10 text-crayon-blue px-3 py-1 text-xs font-bold">
                {s}
              </li>
            ))}
          </ul>

          <section className="mt-6 rounded-block bg-crayon-yellow/15 p-5" aria-labelledby="instrucao-heading">
            <h2 id="instrucao-heading" className="font-display font-bold">
              A instrução
            </h2>
            <p className="mt-1 text-chalkboard/80">{a.instrucao}</p>
          </section>

          <div className="mt-6">
            <PdfButtons pdf={a.pdf} fileName={`alphabes-${a.slug}.pdf`} locale="pt" />
          </div>
          <p className="mt-3 text-sm text-chalkboard/60">
            PDF A4 grátis. Imprima em 100 % (tamanho real) para que as linhas mantenham as medidas.
          </p>

          {letter && (
            <p className="mt-6">
              <Link href={{ pathname: "/alphabet/[letter]", params: { letter: letter.slug } }} className="font-bold underline">
                A lição {ofLetter}
              </Link>
              {" · "}
              <Link href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: letter.slug } }} className="font-bold underline">
                Traçar a letra na tela
              </Link>
            </p>
          )}
          {syllablePages.length > 0 && (
            <p className="mt-6">
              {syllablePages.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && " · "}
                  <Link href={{ pathname: "/phonics/[skill]", params: { skill: p.slug } }} className="font-bold underline">
                    {p.title}, para ouvir
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>

        <div>
          <FichePreview fiche={a} eager locale="pt" />
        </div>
      </div>

      {letter && (
        <section className="mt-12" aria-labelledby="siblings-heading">
          <h2 id="siblings-heading" className="text-2xl font-bold">
            As outras atividades {ofLetter}
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {siblings.map((x) => (
              <li key={x.slug}>
                <Link
                  href={{ pathname: "/worksheets/[category]", params: { category: x.slug } }}
                  className="block h-full rounded-block border border-chalkboard/10 bg-paper p-3 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
                >
                  <FichePreview fiche={x} locale="pt" />
                  <p className="mt-2 text-center font-display font-bold text-sm">{getAtividadeCategory(x.category)!.name}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `pacote-letra-${letter.slug}` } }}
            className="mt-4 inline-block font-display font-bold text-crayon-purple hover:underline"
          >
            Todas as atividades {ofLetter} num só PDF →
          </Link>
        </section>
      )}

      <nav aria-label="Atividade anterior e próxima" className="mt-12 flex justify-between gap-4 text-sm print:hidden">
        {prev ? (
          <Link href={{ pathname: "/worksheets/[category]", params: { category: prev.slug } }} className="font-display font-bold">
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        <Link href={{ pathname: "/worksheets/[category]", params: { category: category.slug } }} className="font-display font-bold">
          {category.name}
        </Link>
        {next ? (
          <Link href={{ pathname: "/worksheets/[category]", params: { category: next.slug } }} className="font-display font-bold text-right">
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceJsonLd) }} />
    </main>
  );
}
