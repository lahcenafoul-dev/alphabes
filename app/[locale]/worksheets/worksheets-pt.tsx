import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { FichePreview } from "@/components/fiches/FicheParts";
import { ATIVIDADE_CATEGORIES, atividades, atividadesInCategory, getAtividade, type AtividadeCategoryGroup } from "@/lib/atividades-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { CEDILHA_SLUG, portugueseLetters } from "@/lib/letters-pt";

const title = "Atividades para imprimir grátis: alfabeto, letra cursiva e sílabas";
const description = `${atividades.length} atividades de alfabetização grátis em PDF para a educação infantil e o 1º ano: letra bastão, letra de forma, letra cursiva com caligrafia, famílias silábicas, números no quadriculado, formas e cores.`;

export const worksheetsMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/worksheets"),
  openGraph: { title, description, url: absoluteUrl("pt", "/worksheets") },
};

const faq = [
  {
    question: "As atividades são grátis mesmo?",
    answer: "Sim. Todas as atividades e todos os pacotes desta página podem ser baixados e impressos de graça, sem criar uma conta.",
  },
  {
    question: "Em que tamanho elas são impressas?",
    answer:
      "Cada atividade é um PDF no tamanho A4, pronto para imprimir em preto e branco. Para que as linhas de caligrafia mantenham as medidas, imprima em 100 % (tamanho real). Em papel carta, escolha “ajustar à página” se as margens forem cortadas.",
  },
  {
    question: "Que letra cursiva vocês usam?",
    answer:
      "Uma letra cursiva escolar brasileira (Playwrite BR), com as letras ligadas como se aprende na escola, nas linhas do caderno de caligrafia: as letras pequenas ficam entre a linha pontilhada e a linha de base, e as maiúsculas e as letras altas sobem até a linha de cima.",
  },
  {
    question: "Para que idade elas são?",
    answer:
      "Dos 3 aos 8 anos, da educação infantil ao 2º ano. Cada atividade indica o nível: colorir e formas para os pequenos; letra bastão na educação infantil; letra cursiva, famílias silábicas e palavras no 1º e no 2º ano.",
  },
];

function CategoryCard({ slug }: { slug: string }) {
  const c = ATIVIDADE_CATEGORIES.find((x) => x.slug === slug)!;
  const items = atividadesInCategory(slug);
  return (
    <li>
      <Link
        href={{ pathname: "/worksheets/[category]", params: { category: c.slug } }}
        className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
      >
        <div className="w-24 shrink-0">
          <FichePreview fiche={items[0]} locale="pt" />
        </div>
        <div>
          <p className="font-display font-bold text-lg">{c.name}</p>
          <p className="mt-1 text-sm text-chalkboard/70">{c.description}</p>
          <p className="mt-2 text-xs font-bold text-chalkboard/60">
            {items.length} atividades · {c.level}
          </p>
        </div>
      </Link>
    </li>
  );
}

const inGroup = (group: AtividadeCategoryGroup) => ATIVIDADE_CATEGORIES.filter((c) => c.group === group);

export default function WorksheetsPt() {
  const url = absoluteUrl("pt", "/worksheets");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Atividades", url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  const hero = getAtividade("letra-a-cursiva")!;

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li aria-current="page" className="font-bold">Atividades</li>
        </ol>
      </nav>

      <header className="mt-6 grid gap-8 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Atividades de alfabetização para imprimir</h1>
          <p className="mt-4 text-lg text-chalkboard/70 max-w-2xl">
            {atividades.length} atividades grátis em PDF: as 26 letras e o Ç em letra bastão, de forma e cursiva com
            caligrafia, a sílaba inicial das palavras, uma atividade para cada família silábica e cada dígrafo, os números
            no quadriculado, as formas e as cores. Imprima uma atividade ou um pacote inteiro de uma vez.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "familias-silabicas" } }}
              className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
            >
              Famílias silábicas
            </Link>
            <Link
              href={{ pathname: "/worksheets/[category]", params: { category: "letra-cursiva" } }}
              className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              Letra cursiva
            </Link>
            <Link
              href="/worksheets/bundles"
              className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              Os pacotes em PDF
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <FichePreview fiche={hero} eager locale="pt" />
        </div>
      </header>

      <section className="mt-16" aria-labelledby="letters-heading">
        <h2 id="letters-heading" className="text-3xl font-bold">
          As atividades das letras
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Sete atividades para cada uma das 26 letras e para o Ç: da letra bastão aos 4 anos às palavras em letra cursiva no
          1º ano.
        </p>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("letras").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
        <h3 className="mt-10 font-display font-bold text-xl">Todas as atividades de uma letra</h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {portugueseLetters.map((l) => (
            <li key={l.slug}>
              <Link
                href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `pacote-letra-${l.slug}` } }}
                aria-label={l.slug === CEDILHA_SLUG ? "As atividades do Ç" : `As atividades da letra ${l.upper}`}
                className="letter-block bg-crayon-blue h-11 w-11 text-xl"
              >
                {l.upper}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="syllables-heading">
        <h2 id="syllables-heading" className="text-3xl font-bold">
          As sílabas
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Uma atividade para cada família silábica (ba, be, bi, bo, bu…), cada dígrafo, os sons nasais e as sílabas
          complexas, na ordem da alfabetização. Cada uma acompanha a sua página de{" "}
          <Link href="/phonics" className="font-bold underline">
            sílabas
          </Link>
          , com som.
        </p>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("silabas").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="themes-heading">
        <h2 id="themes-heading" className="text-3xl font-bold">
          Números, formas, cores e palavras frequentes
        </h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-4">
          {inGroup("temas").map((c) => (
            <CategoryCard key={c.slug} slug={c.slug} />
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-block bg-crayon-purple/10 p-8" aria-labelledby="packs-heading">
        <h2 id="packs-heading" className="text-3xl font-bold">
          Imprimir tudo de uma vez
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Os pacotes juntam várias atividades num só PDF: todas as atividades de uma letra, todo o alfabeto em letra
          cursiva ou o alfabeto completo para a sala de aula.
        </p>
        <Link
          href="/worksheets/bundles"
          className="mt-6 inline-block rounded-block bg-crayon-purple text-white font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Ver os pacotes
        </Link>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Perguntas frequentes
        </h2>
        <dl className="mt-6 space-y-6">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold text-lg">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
