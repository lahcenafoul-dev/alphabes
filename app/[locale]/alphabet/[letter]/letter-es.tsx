import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { cursivaFont } from "@/lib/fonts/cursive-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import {
  TILDE_SLUG,
  getSpanishLetter,
  spanishNeighbors,
  type SpanishLetter,
  type SpanishWord,
} from "@/lib/letters-es";

/** «be» (also «be larga», «be grande»): the name line under the title. */
function nameLine(l: SpanishLetter): string {
  const others = l.otherNames?.length ? ` (también: ${l.otherNames.map((n) => `«${n}»`).join(", ")})` : "";
  return `«${l.name}»${others}`;
}

export function letterMetadataEs(param: string): Metadata {
  const l = getSpanishLetter(param);
  if (!l) return {};
  const [w1, w2] = l.words;
  const title = `La letra ${l.upper}: sonido, sílabas, palabras y trazo`;
  const description = `Aprende la letra ${l.upper} ${l.lower}: su nombre («${l.name}»), su sonido, palabras como ${w1.word.toLowerCase()} y ${w2.word.toLowerCase()} para escuchar, y una ficha de trazo en letra script y cursiva.`;
  const url = absoluteUrl("es", "/alphabet/[letter]", { letter: l.slug });
  return {
    title,
    description,
    alternates: alternatesFor("es", "/alphabet/[letter]", { letter: l.slug }),
    openGraph: { title, description, url },
  };
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-paper px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-block border-2 border-chalkboard/20 bg-paper px-5 py-2.5 font-display font-bold hover:border-crayon-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

function WordCard({ w }: { w: SpanishWord }) {
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
        locale="es"
        text={w.withArticle}
        ariaLabel={`Escuchar: ${w.withArticle}`}
        className="mt-2 text-sm font-bold text-crayon-blue underline underline-offset-2"
      >
        🔊 Escuchar
      </ListenButton>
    </li>
  );
}

export default function LetterEs({ letter }: { letter: string }) {
  // The page only renders letters listed by spanishLetterParams().
  const l = getSpanishLetter(letter)!;
  const { prev, next } = spanishNeighbors(l.slug);
  const url = absoluteUrl("es", "/alphabet/[letter]", { letter: l.slug });
  const related = (l.related ?? []).map((slug) => (slug === TILDE_SLUG ? null : getSpanishLetter(slug)!));
  const faq = [{ question: `¿Cómo suena la letra ${l.upper}?`, answer: l.sound }, l.faq];

  const lessonJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `La letra ${l.upper}`,
    inLanguage: "es",
    educationalLevel: "Preescolar",
    learningResourceType: "Lesson",
    teaches: `Reconocer la letra ${l.upper}, su nombre, su sonido y sus sílabas`,
    isAccessibleForFree: true,
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Abecedario", url: absoluteUrl("es", "/alphabet") },
    { name: `Letra ${l.upper}`, url },
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
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/alphabet">Abecedario</Link> /</li>
          <li aria-current="page" className="font-bold">Letra {l.upper}</li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        <div className="letter-block bg-crayon-blue w-24 h-24 text-5xl shrink-0">{l.upper}</div>
        <div>
          <h1 className="text-4xl font-extrabold">
            La letra {l.upper} {l.lower}
          </h1>
          <p className="mt-1 text-chalkboard/70">
            Se llama {nameLine(l)} · Sonido: {l.ipa} · {l.kind === "vocal" ? "una vocal" : "una consonante"}
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        <ListenButton locale="es" text={l.nameSpoken} rate={0.7} className={primaryButton}>
          🔊 El nombre de la letra
        </ListenButton>
        <ListenButton locale="es" text={l.soundSpoken} rate={0.75} className={secondaryButton}>
          🔊 {l.kind === "vocal" ? "El sonido" : "Sus sílabas"}
        </ListenButton>
      </div>

      <p className="mt-6 text-lg text-chalkboard/80 max-w-2xl">{l.sound}</p>

      <section className="mt-10" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-2xl font-bold">
          Tres maneras de escribirla
        </h2>
        <ul className="mt-4 grid grid-cols-3 gap-4 max-w-xl">
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className="block text-5xl font-extrabold">{l.upper}</span>
            <span className="mt-2 block text-sm text-chalkboard/70">Mayúscula</span>
          </li>
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className="block text-5xl font-extrabold">{l.lower}</span>
            <span className="mt-2 block text-sm text-chalkboard/70">Minúscula</span>
          </li>
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className={`block text-4xl leading-[3rem] ${cursivaFont.className}`}>
              {l.upper} {l.lower}
            </span>
            <span className="mt-2 block text-sm text-chalkboard/70">Cursiva</span>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="words-heading">
        <h2 id="words-heading" className="text-2xl font-bold">
          Palabras con {l.upper}
        </h2>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {l.words.map((w) => (
            <WordCard key={w.word} w={w} />
          ))}
        </ul>
        {l.wordsInside && (
          <>
            <h3 className="mt-6 font-display font-bold text-lg">También dentro de las palabras</h3>
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
          Para mamá y papá
        </h2>
        <p className="mt-2 text-chalkboard/80">{l.tip}</p>
      </section>

      <section className="mt-10" aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="text-2xl font-bold">
          A practicar
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: l.slug } }}
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">✏️ Trazar la letra {l.upper}</p>
            <p className="mt-1 text-sm text-chalkboard/70">
              En la pantalla, con el dedo o el ratón, en letra script o cursiva.
            </p>
          </Link>
          <Link
            href="/flashcards"
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">🖼️ Las tarjetas del abecedario</p>
            <p className="mt-1 text-sm text-chalkboard/70">Todas las palabras de la A a la Z, con dibujos, para escuchar.</p>
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold">
            Descubre también
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <li key={r?.slug ?? TILDE_SLUG}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: r?.slug ?? TILDE_SLUG } }}
                  className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                >
                  {r ? `La letra ${r.upper}` : "La tilde y la diéresis"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Preguntas frecuentes
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

      <nav aria-label="Letra anterior y siguiente" className="mt-12 flex justify-between text-sm">
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: prev.slug } }} className="font-display font-bold">
          ← Letra {prev.upper}
        </Link>
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: next.slug } }} className="font-display font-bold">
          Letra {next.upper} →
        </Link>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
