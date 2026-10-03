import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { SILABA_GROUPS, portugueseSyllablePages } from "@/lib/silabas-pt";

const title = "As sílabas: alfabetização com as famílias silábicas";
const description =
  "As vogais, os encontros vocálicos, as famílias silábicas (ba, be, bi, bo, bu), os dígrafos (ch, lh, nh, rr, ss, qu, gu), os sons nasais e as sílabas complexas. Com palavras para ouvir, frases e jogos.";

export const phonicsMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/phonics"),
  openGraph: { title, description, url: absoluteUrl("pt", "/phonics") },
};

const steps = [
  { n: 1, title: "Ouvir as sílabas", blurb: "Bater palmas para os pedacinhos das palavras: bor-bo-le-ta.", slug: "contar-silabas" },
  { n: 2, title: "As vogais", blurb: "a, e, i, o, u, e os encontros: ai, ei, oi.", slug: "vogais" },
  { n: 3, title: "As letras", blurb: "O nome e o som de cada letra, de A a Z.", href: "/alphabet" as const },
  { n: 4, title: "Famílias silábicas", blurb: "Uma consoante com cada vogal: ba, be, bi, bo, bu.", slug: "familias-silabicas" },
  { n: 5, title: "Dígrafos e nasais", blurb: "ch, lh, nh, rr, ss; ão, an, em.", slug: "ch" },
  { n: 6, title: "Sílabas complexas", blurb: "pra, flor, mar, escola, sol.", slug: "encontros-com-r" },
];

const faq = [
  {
    question: "O que são as famílias silábicas?",
    answer:
      "São os grupos de sílabas formados por uma consoante com cada vogal: a família do B é ba, be, bi, bo, bu. É o jeito mais comum de alfabetizar no Brasil: primeiro as vogais e os encontros vocálicos, depois as famílias, e por fim os dígrafos, os sons nasais e as sílabas complexas.",
  },
  {
    question: "Em que ordem se ensinam as famílias?",
    answer:
      "Cada escola tem a sua ordem. Muitas começam por P, B, T e D, outras por M, L e F, que com as vogais já formam muitas palavras (pato, bola, mala, foca). As letras com mais de um som (c, g, r, s, x) e o h vêm depois. Se você conhece a ordem da escola da criança, siga-a.",
  },
  {
    question: "Com que idade a criança aprende a ler?",
    answer:
      "Os jogos de ouvido e as vogais começam na educação infantil, por volta dos 4 ou 5 anos. A maioria das crianças aprende a ler sílabas e palavras no 1º ano, por volta dos 6 anos, e ganha fluência no 2º ano. A Base Nacional Comum Curricular prevê a alfabetização até o fim do 2º ano.",
  },
  {
    question: "Como praticar em casa?",
    answer:
      "Dez minutos por dia bastam. Revejam a página da semana: ouçam as sílabas, leiam as palavras e a frase, e brinquem com o exercício. Depois procurem essas sílabas numa história ou nas placas da rua.",
  },
];

export default function PhonicsPt() {
  const url = absoluteUrl("pt", "/phonics");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Sílabas", url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "As sílabas do português",
    description,
    url,
    inLanguage: "pt-BR",
    educationalLevel: "Educação infantil e 1º ano",
    learningResourceType: "Lesson",
    teaches: "As vogais, as famílias silábicas, os dígrafos, os sons nasais e as sílabas complexas do português",
    typicalAgeRange: "4-8",
    isAccessibleForFree: true,
  };
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
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li aria-current="page" className="font-bold">Sílabas</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          As sílabas: aprender a ler passo a passo
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          A alfabetização segue um caminho: as vogais, as famílias silábicas (ba, be, bi, bo, bu),
          depois os dígrafos como ch, lh e nh, os sons nasais como ão e an, e as sílabas complexas,
          como pra e flor. Cada página pode ser ouvida em voz alta, com palavras e figuras, uma frase
          para ler e um jogo.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "vogais" } }}
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Começar pelas vogais
          </Link>
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "familias-silabicas" } }}
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors"
          >
            Montar sílabas
          </Link>
        </div>
      </header>

      <section className="mt-16" aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-3xl font-bold">
          O caminho da leitura
        </h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Os passos seguem mais ou menos esta ordem, da educação infantil ao 2º ano. Cada criança
          avança no seu ritmo.
        </p>
        <ol className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step) => (
            <li key={step.n}>
              <Link
                href={step.href ?? { pathname: "/phonics/[skill]", params: { skill: step.slug! } }}
                className="block h-full rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
              >
                <span className="letter-block bg-crayon-purple flex h-10 w-10 items-center justify-center text-base" aria-hidden="true">
                  {step.n}
                </span>
                <p className="mt-3 font-display font-bold text-sm">{step.title}</p>
                <p className="mt-1 text-xs text-chalkboard/70">{step.blurb}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SILABA_GROUPS.map((group) => (
        <section key={group.id} className="mt-16" aria-labelledby={`group-${group.id}`}>
          <h2 id={`group-${group.id}`} className="text-3xl font-bold">
            {group.title}
          </h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">{group.blurb}</p>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portugueseSyllablePages
              .filter((p) => p.group === group.id)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={{ pathname: "/phonics/[skill]", params: { skill: p.slug } }}
                    className="flex h-full gap-4 rounded-block border border-chalkboard/10 bg-paper p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors"
                  >
                    <span className="letter-block bg-crayon-blue h-14 min-w-14 px-2 text-2xl shrink-0" aria-hidden="true">
                      {p.short}
                    </span>
                    <span>
                      <span className="block font-display font-bold">{p.title}</span>
                      <span className="mt-1 block text-sm text-chalkboard/70">{p.summary}</span>
                      <span className="mt-2 inline-block rounded-full bg-crayon-yellow/25 px-2 py-0.5 text-xs font-bold">
                        {p.level}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Dicas para a família
        </h2>
        <ol className="mt-6 space-y-3 list-decimal list-inside text-chalkboard/80 max-w-3xl">
          <li>Uma família de cada vez: fiquem alguns dias com ba, be, bi, bo, bu antes de passar para a próxima.</li>
          <li>Diga o som, não o nome da letra: “mmm”, e não “eme”.</li>
          <li>Batam palmas para as sílabas das palavras: to-ma-te, três palmas.</li>
          <li>Revejam sempre o que já aprenderam, principalmente os pares parecidos (pato e prato, caro e carro, sono e sonho).</li>
          <li>Sessões curtas e alegres: dez minutos está ótimo.</li>
          <li>
            Se a criança ainda hesita com alguma letra, revejam a página dela no{" "}
            <Link href="/alphabet" className="font-bold underline">
              alfabeto
            </Link>
            .
          </li>
        </ol>
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

      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">Vamos ler?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Comecem pelas vogais ou revejam antes as letras do alfabeto.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href={{ pathname: "/phonics/[skill]", params: { skill: "vogais" } }}
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            As vogais
          </Link>
          <Link
            href="/alphabet"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            O alfabeto
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
