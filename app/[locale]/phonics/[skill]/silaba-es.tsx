import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import MarkedWord from "@/components/sons/MarkedWord";
import SoundHunt from "@/components/sons/SoundHunt";
import SyllableBuilder from "@/components/sons/SyllableBuilder";
import SyllableClap from "@/components/silabas/SyllableClap";
import WordBuilder from "@/components/silabas/WordBuilder";
import { FicheCard } from "@/components/fiches/FicheParts";
import { fichasForSyllablePage } from "@/lib/fichas-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import {
  ES_BUILDER_CONSONANTS,
  ES_BUILDER_VOWELS,
  getSpanishSyllablePage,
  syllablePageNeighbors,
  type SpanishSyllablePage,
} from "@/lib/silabas-es";
import { plainWord, type SoundWord } from "@/lib/sons-fr";

export function syllableMetadataEs(slug: string): Metadata {
  const p = getSpanishSyllablePage(slug);
  if (!p) return {};
  const url = absoluteUrl("es", "/phonics/[skill]", { skill: p.slug });
  return {
    title: p.metaTitle,
    description: p.summary,
    alternates: alternatesFor("es", "/phonics/[skill]", { skill: p.slug }),
    openGraph: { title: p.metaTitle, description: p.summary, url },
  };
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-paper px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

function WordCard({ w, marks }: { w: SoundWord; marks: SpanishSyllablePage["marks"] }) {
  return (
    <li className="rounded-block bg-paper border border-chalkboard/10 p-4 text-center shadow-block">
      <div
        className="mx-auto h-16 w-16 rounded-full bg-crayon-green/20 flex items-center justify-center text-4xl"
        role="img"
        aria-label={plainWord(w.word)}
      >
        {w.emoji}
      </div>
      <p className="mt-2 font-display font-bold text-2xl">
        <MarkedWord word={w.word} marks={marks} />
      </p>
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

function pageLink(slug: string) {
  return { pathname: "/phonics/[skill]" as const, params: { skill: slug } };
}

export default function SilabaEs({ slug }: { slug: string }) {
  // The page only renders slugs listed in lib/silabas-es.ts.
  const p = getSpanishSyllablePage(slug)!;
  const { prev, next } = syllablePageNeighbors(p.slug);
  const url = absoluteUrl("es", "/phonics/[skill]", { skill: p.slug });
  const related = p.related.map((r) => getSpanishSyllablePage(r)!);
  const sheets = fichasForSyllablePage(p.slug);

  const lessonJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: p.title,
    description: p.summary,
    url,
    inLanguage: "es",
    educationalLevel: p.level,
    learningResourceType: "Lesson",
    teaches: p.summary,
    isAccessibleForFree: true,
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Sílabas", url: absoluteUrl("es", "/phonics") },
    { name: p.title, url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faq.map((f) => ({
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
          <li><Link href="/phonics">Sílabas</Link> /</li>
          <li aria-current="page" className="font-bold">{p.title}</li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        <div className="letter-block bg-crayon-purple h-24 min-w-24 px-4 text-5xl shrink-0" aria-hidden="true">
          {p.short}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">{p.title}</h1>
          <p className="mt-1 text-chalkboard/70">{p.level}</p>
        </div>
      </header>

      <div className="mt-6">
        <ListenButton locale="es" text={p.spoken} rate={0.75} className={primaryButton}>
          🔊 Escuchar
        </ListenButton>
      </div>

      <p className="mt-6 text-lg text-chalkboard/80 max-w-2xl">{p.intro}</p>

      {p.rules && (
        <section className="mt-8 rounded-block bg-crayon-blue/10 p-6" aria-labelledby="rules-heading">
          <h2 id="rules-heading" className="text-2xl font-bold">
            {p.rules.length > 1 ? "Las reglas" : "La regla"}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-chalkboard/80">
            {p.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {p.tiles && (
        <section className="mt-10" aria-labelledby="tiles-heading">
          <h2 id="tiles-heading" className="text-2xl font-bold">
            Escucha y lee
          </h2>
          <div className="mt-4 space-y-5">
            {p.tiles.map((group) => (
              <div key={group.title}>
                <h3 className="font-display font-bold text-chalkboard/70">{group.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-3">
                  {group.items.map((t) => (
                    <li key={t.label}>
                      <ListenButton
                        locale="es"
                        text={t.spoken ?? t.label}
                        rate={0.7}
                        ariaLabel={`Escuchar: ${t.label}`}
                        className="min-w-16 rounded-block border-2 border-chalkboard/15 bg-paper px-4 py-2 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
                      >
                        <span className="block font-display font-bold text-2xl">{t.label}</span>
                        {t.note && <span className="block text-xs text-chalkboard/70">{t.note}</span>}
                      </ListenButton>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {p.builder && (
        <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="builder-heading">
          <h2 id="builder-heading" className="text-2xl font-bold">
            Forma una sílaba
          </h2>
          <div className="mt-3">
            <SyllableBuilder locale="es" consonants={ES_BUILDER_CONSONANTS} vowels={ES_BUILDER_VOWELS} />
          </div>
        </section>
      )}

      {p.clap && (
        <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="clap-heading">
          <h2 id="clap-heading" className="text-2xl font-bold">
            ¡A aplaudir!
          </h2>
          <div className="mt-3">
            <SyllableClap words={p.clap} />
          </div>
        </section>
      )}

      {p.words && (
        <section className="mt-10" aria-labelledby="words-heading">
          <h2 id="words-heading" className="text-2xl font-bold">
            {p.words.some((w) => w.word.includes("|")) ? "Palabras para leer, sílaba por sílaba" : "Palabras para practicar"}
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {p.words.map((w) => (
              <WordCard key={w.word} w={w} marks={p.marks} />
            ))}
          </ul>
        </section>
      )}

      {p.build && (
        <section className="mt-10 rounded-block bg-crayon-blue/10 p-6" aria-labelledby="build-heading">
          <h2 id="build-heading" className="text-2xl font-bold">
            Arma la palabra
          </h2>
          <div className="mt-3">
            <WordBuilder words={p.build} />
          </div>
        </section>
      )}

      {p.sentence && (
        <section className="mt-10 rounded-block border-2 border-dashed border-chalkboard/15 p-6" aria-labelledby="sentence-heading">
          <h2 id="sentence-heading" className="text-2xl font-bold">
            Leo una oración
          </h2>
          <p className="mt-3 font-display text-2xl">{p.sentence}</p>
          <ListenButton
            locale="es"
            text={p.sentence}
            rate={0.75}
            ariaLabel="Escuchar la oración"
            className="mt-3 text-sm font-bold text-crayon-blue underline underline-offset-2"
          >
            🔊 Escuchar la oración
          </ListenButton>
        </section>
      )}

      {p.hunt && (
        <section className="mt-10 rounded-block bg-crayon-green/10 p-6" aria-labelledby="hunt-heading">
          <h2 id="hunt-heading" className="text-2xl font-bold">
            ¡Te toca!
          </h2>
          <div className="mt-3">
            <SoundHunt hunt={p.hunt} locale="es" />
          </div>
        </section>
      )}

      {sheets.length > 0 && (
        <section className="mt-10" aria-labelledby="fichas-heading">
          <h2 id="fichas-heading" className="text-2xl font-bold">
            {sheets.length > 1 ? "Las fichas para imprimir" : "La ficha para imprimir"}
          </h2>
          <p className="mt-1 text-chalkboard/70">
            Las sílabas para leer, palabras partidas en sílabas y sílabas para escribir en cursiva, en una hoja A4.
          </p>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {sheets.map((f) => (
              <FicheCard key={f.slug} fiche={f} locale="es" />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="tip-heading">
        <h2 id="tip-heading" className="text-2xl font-bold">
          Para mamá y papá
        </h2>
        <p className="mt-2 text-chalkboard/80">{p.tip}</p>
      </section>

      <section className="mt-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-2xl font-bold">
          Descubre también
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={pageLink(r.slug)}
                className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
              >
                {r.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/alphabet"
              className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
            >
              El abecedario
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Preguntas frecuentes
        </h2>
        <dl className="mt-4 space-y-5">
          {p.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-label="Página anterior y siguiente" className="mt-12 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link href={pageLink(prev.slug)} className="font-display font-bold">
            ← {prev.title}
          </Link>
        ) : (
          <Link href="/phonics" className="font-display font-bold">
            ← Todas las sílabas
          </Link>
        )}
        {next ? (
          <Link href={pageLink(next.slug)} className="font-display font-bold text-right">
            {next.title} →
          </Link>
        ) : (
          <Link href="/phonics" className="font-display font-bold text-right">
            Todas las sílabas →
          </Link>
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
