import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { cursivaFont } from "@/lib/fonts/cursive-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import {
  ACENTOS_SLUG,
  CEDILHA_SLUG,
  getPortugueseLetter,
  portugueseNeighbors,
  type PortugueseLetter,
  type PortugueseWord,
} from "@/lib/letters-pt";

// The syllable page (lib/silabas-pt.ts) that practises each letter; k, w and
// y have none (they only appear in names and borrowed words).
const SYLLABLE_PAGE: Record<string, { skill: string; label: string }> = {
  a: { skill: "vogais", label: "As vogais" },
  e: { skill: "vogais", label: "As vogais" },
  i: { skill: "vogais", label: "As vogais" },
  o: { skill: "vogais", label: "As vogais" },
  u: { skill: "vogais", label: "As vogais" },
  c: { skill: "c-e-cedilha", label: "ca, ce, ci e o ç" },
  "c-cedilha": { skill: "c-e-cedilha", label: "ca, ce, ci e o ç" },
  q: { skill: "qu", label: "que, qui, qua" },
  g: { skill: "g-e-j", label: "ga, ge, gi e o j" },
  j: { skill: "g-e-j", label: "ga, ge, gi e o j" },
  h: { skill: "h-inicial", label: "O h no começo da palavra" },
  l: { skill: "al-el-il-ol-ul", label: "O l no fim da sílaba" },
  m: { skill: "am-em-im-om-um", label: "am, em, im, om, um" },
  n: { skill: "an-en-in-on-un", label: "an, en, in, on, un" },
  r: { skill: "rr", label: "O r forte e o rr" },
  s: { skill: "ss", label: "O ss e o s com som de z" },
  z: { skill: "ss", label: "O ss e o s com som de z" },
  x: { skill: "x", label: "Os sons do x" },
};
const NO_SYLLABLES = new Set(["k", "w", "y"]);

/** “bê”, or “dáblio” (também: “dábliu”, “vê duplo”): the name line under the title. */
function nameLine(l: PortugueseLetter): string {
  const others = l.otherNames?.length ? ` (também: ${l.otherNames.map((n) => `“${n}”`).join(", ")})` : "";
  return `“${l.name}”${others}`;
}

/** "A letra B", but "O Ç", which isn't a letter of its own. */
function heading(l: PortugueseLetter): string {
  return l.slug === CEDILHA_SLUG ? `O ${l.upper} ${l.lower} (cê-cedilha)` : `A letra ${l.upper} ${l.lower}`;
}

export function letterMetadataPt(param: string): Metadata {
  const l = getPortugueseLetter(param);
  if (!l) return {};
  const [w1, w2] = l.words;
  const name = l.slug === CEDILHA_SLUG ? "O Ç (cê-cedilha)" : `A letra ${l.upper}`;
  const title = `${name}: som, família silábica, palavras e traçado`;
  const description = `Aprenda ${l.slug === CEDILHA_SLUG ? "o Ç" : `a letra ${l.upper} ${l.lower}`}: o nome (“${l.name}”), o som, palavras como ${w1.word.toLowerCase()} e ${w2.word.toLowerCase()} para ouvir e o traçado em letra bastão, de forma e cursiva.`;
  const url = absoluteUrl("pt", "/alphabet/[letter]", { letter: l.slug });
  return {
    title,
    description,
    alternates: alternatesFor("pt", "/alphabet/[letter]", { letter: l.slug }),
    openGraph: { title, description, url },
  };
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-paper px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-block border-2 border-chalkboard/20 bg-paper px-5 py-2.5 font-display font-bold hover:border-crayon-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

function WordCard({ w }: { w: PortugueseWord }) {
  return (
    <li className="rounded-block bg-paper border border-chalkboard/10 p-4 text-center shadow-block">
      <div
        className="mx-auto h-16 w-16 rounded-full bg-crayon-green/20 flex items-center justify-center text-4xl"
        role="img"
        aria-label={w.word}
      >
        {w.emoji}
      </div>
      <p className="mt-2 font-display font-bold text-lg">{w.word}</p>
      <p className="text-sm text-chalkboard/60">{w.withArticle}</p>
      <ListenButton
        locale="pt"
        text={w.withArticle}
        ariaLabel={`Ouvir: ${w.withArticle}`}
        className="mt-2 text-sm font-bold text-crayon-blue underline underline-offset-2"
      >
        🔊 Ouvir
      </ListenButton>
    </li>
  );
}

export default function LetterPt({ letter }: { letter: string }) {
  // The page only renders letters listed by portugueseLetterParams().
  const l = getPortugueseLetter(letter)!;
  const { prev, next } = portugueseNeighbors(l.slug);
  const url = absoluteUrl("pt", "/alphabet/[letter]", { letter: l.slug });
  const related = (l.related ?? []).map((slug) => (slug === ACENTOS_SLUG ? null : getPortugueseLetter(slug)!));
  const cedilha = l.slug === CEDILHA_SLUG;
  const faq = [{ question: `Qual é o som ${cedilha ? "do Ç" : `da letra ${l.upper}`}?`, answer: l.sound }, l.faq];
  const short = (x: PortugueseLetter) => (x.slug === CEDILHA_SLUG ? "O Ç" : `Letra ${x.upper}`);
  const syllables = NO_SYLLABLES.has(l.slug)
    ? null
    : (SYLLABLE_PAGE[l.slug] ?? { skill: "familias-silabicas", label: `A família do ${l.upper}` });

  const lessonJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: heading(l),
    inLanguage: "pt-BR",
    educationalLevel: "Educação infantil",
    learningResourceType: "Lesson",
    teaches: `Reconhecer ${cedilha ? "o Ç" : `a letra ${l.upper}`}, o nome, o som e a família silábica`,
    isAccessibleForFree: true,
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Alfabeto", url: absoluteUrl("pt", "/alphabet") },
    { name: short(l), url },
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

  const forms = [
    { sample: l.upper, label: "Letra bastão", cursive: false },
    { sample: l.lower, label: "Letra de forma minúscula", cursive: false },
    { sample: l.upper, label: "Cursiva maiúscula", cursive: true },
    { sample: l.lower, label: "Cursiva minúscula", cursive: true },
  ];

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/alphabet">Alfabeto</Link> /</li>
          <li aria-current="page" className="font-bold">{short(l)}</li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        <div className="letter-block bg-crayon-blue w-24 h-24 text-5xl shrink-0">{l.upper}</div>
        <div>
          <h1 className="text-4xl font-extrabold">{heading(l)}</h1>
          <p className="mt-1 text-chalkboard/70">
            Nome: {nameLine(l)} · Som: {l.ipa} · {l.kind === "vogal" ? "uma vogal" : "uma consoante"}
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        <ListenButton locale="pt" text={l.nameSpoken} rate={0.7} className={primaryButton}>
          🔊 O nome da letra
        </ListenButton>
        <ListenButton locale="pt" text={l.soundSpoken} rate={0.75} className={secondaryButton}>
          🔊 {l.kind === "vogal" ? "O som" : "A família silábica"}
        </ListenButton>
      </div>

      <p className="mt-6 text-lg text-chalkboard/80 max-w-2xl">{l.sound}</p>

      <section className="mt-10" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-2xl font-bold">
          Os quatro tipos de letra
        </h2>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
          {forms.map((f) => (
            <li key={f.label} className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
              <span
                className={`block text-5xl ${f.cursive ? `leading-[4.5rem] ${cursivaFont.className}` : "font-extrabold leading-[4.5rem]"}`}
              >
                {f.sample}
              </span>
              <span className="mt-2 block text-sm text-chalkboard/70">{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="words-heading">
        <h2 id="words-heading" className="text-2xl font-bold">
          Palavras com {l.upper}
        </h2>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {l.words.map((w) => (
            <WordCard key={w.word} w={w} />
          ))}
        </ul>
        {l.wordsInside && (
          <>
            <h3 className="mt-6 font-display font-bold text-lg">Também no meio das palavras</h3>
            <ul className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {l.wordsInside.map((w) => (
                <WordCard key={w.word} w={w} />
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="tip-heading">
        <h2 id="tip-heading" className="text-2xl font-bold">
          Para a família
        </h2>
        <p className="mt-2 text-chalkboard/80">{l.tip}</p>
      </section>

      <section className="mt-10" aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="text-2xl font-bold">
          Vamos praticar
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: l.slug } }}
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">✏️ Traçar {cedilha ? "o Ç" : `a letra ${l.upper}`}</p>
            <p className="mt-1 text-sm text-chalkboard/70">
              Na tela, com o dedo ou o mouse, em letra bastão, de forma ou cursiva.
            </p>
          </Link>
          <Link
            href="/flashcards"
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">🖼️ Os cartões do alfabeto</p>
            <p className="mt-1 text-sm text-chalkboard/70">Todas as palavras de A a Z, com figuras, para ouvir.</p>
          </Link>
          {syllables && (
            <Link
              href={{ pathname: "/phonics/[skill]", params: { skill: syllables.skill } }}
              className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition sm:col-span-2"
            >
              <p className="font-display font-bold">🗣️ Para ler: {syllables.label}</p>
              <p className="mt-1 text-sm text-chalkboard/70">Sílabas para ouvir, palavras e uma frase para ler.</p>
            </Link>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold">
            Conheça também
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <li key={r?.slug ?? ACENTOS_SLUG}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: r?.slug ?? ACENTOS_SLUG } }}
                  className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                >
                  {r ? (r.slug === CEDILHA_SLUG ? "O Ç (cê-cedilha)" : `A letra ${r.upper}`) : "Os acentos e o til"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="faq-heading">
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

      <nav aria-label="Letra anterior e próxima" className="mt-12 flex justify-between text-sm">
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: prev.slug } }} className="font-display font-bold">
          ← {short(prev)}
        </Link>
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: next.slug } }} className="font-display font-bold">
          {short(next)} →
        </Link>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
