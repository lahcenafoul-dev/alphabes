import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { ACENTOS_SLUG, CEDILHA_SLUG, acentoGroups } from "@/lib/letters-pt";

const title = "Os acentos e o til: á, â, ã, é, ê, ó, ô, õ explicados para crianças";
const description =
  "O acento agudo (café, avó), o circunflexo (bebê, avô), o til do som nasal (mão, limões) e o à, explicados para crianças e famílias, com palavras para ouvir.";

export const acentosMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/alphabet/[letter]", { letter: ACENTOS_SLUG }),
  openGraph: { title, description, url: absoluteUrl("pt", "/alphabet/[letter]", { letter: ACENTOS_SLUG }) },
};

const faq = [
  {
    question: "O á é uma letra diferente do a?",
    answer:
      "Não. O alfabeto tem 26 letras, e as vogais com acento ou com til não são letras novas. O acento mostra a sílaba mais forte e, no é e no ó, o som aberto; o til mostra o som nasal.",
  },
  {
    question: "Com que idade a criança aprende a acentuar?",
    answer:
      "Na educação infantil ela já vê os acentos no próprio nome e em palavras como mamãe, papai e avó. As regras de acentuação são estudadas mais tarde, a partir do 2º e do 3º ano, quando a criança já separa bem as sílabas.",
  },
  {
    question: "As letras maiúsculas levam acento?",
    answer: "Sim. As maiúsculas levam acento e til como as minúsculas: ÁGUA, AVÔ, MAMÃE. Isso ajuda a ler a palavra do jeito certo.",
  },
];

export default function AcentosPt() {
  const url = absoluteUrl("pt", "/alphabet/[letter]", { letter: ACENTOS_SLUG });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Alfabeto", url: absoluteUrl("pt", "/alphabet") },
    { name: "Os acentos e o til", url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/alphabet">Alfabeto</Link> /</li>
          <li aria-current="page" className="font-bold">Os acentos e o til</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Os acentos e o til</h1>
      <p className="mt-4 text-lg text-chalkboard/80 max-w-2xl">
        Os sinais em cima das vogais não criam letras novas. Eles mostram qual sílaba se diz com
        mais força, se o e e o o têm som aberto ou fechado, e se o som passa pelo nariz.
      </p>

      <div className="mt-10 space-y-6">
        {acentoGroups.map((group) => (
          <article key={group.id} className="rounded-block border border-chalkboard/10 bg-paper p-6 shadow-block">
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="font-display text-4xl font-extrabold text-crayon-blue" aria-hidden="true">
                {group.marks}
              </span>
              <h2 className="font-display text-xl font-bold">{group.title}</h2>
            </div>
            <p className="mt-2 text-chalkboard/80">{group.explanation}</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {group.examples.map((ex) => (
                <li key={ex.text}>
                  <ListenButton
                    locale="pt"
                    text={ex.text}
                    ariaLabel={`Ouvir: ${ex.text}`}
                    className="inline-flex items-center gap-2 rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                  >
                    <span aria-hidden="true">{ex.emoji}</span> {ex.text} <span aria-hidden="true">🔊</span>
                  </ListenButton>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-block bg-crayon-purple/10 p-6" aria-labelledby="cedilha-heading">
        <h2 id="cedilha-heading" className="text-2xl font-bold">
          E a cedilha?
        </h2>
        <p className="mt-2 text-chalkboard/80">
          A “cobrinha” embaixo do ç não é um acento: é a cedilha. Ela muda o som do c para [s] antes
          de a, o e u, como em maçã e palhaço.
        </p>
        <Link
          href={{ pathname: "/alphabet/[letter]", params: { letter: CEDILHA_SLUG } }}
          className="mt-4 inline-block font-display font-bold text-crayon-blue hover:underline"
        >
          O Ç (cê-cedilha) →
        </Link>
      </section>

      <section className="mt-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Perguntas frequentes
        </h2>
        <dl className="mt-4 space-y-5">
          {faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-12">
        <Link href="/alphabet" className="font-display font-bold text-crayon-blue hover:underline">
          ← Voltar ao alfabeto
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
