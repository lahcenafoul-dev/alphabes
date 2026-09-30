import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import MarkedWord from "@/components/sons/MarkedWord";
import SoundHunt from "@/components/sons/SoundHunt";
import SyllableBuilder from "@/components/sons/SyllableBuilder";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { ficheForSound } from "@/lib/fiches-fr";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getFrenchSound, plainWord, soundNeighbors, type FrenchSound, type SoundWord } from "@/lib/sons-fr";

export function soundMetadataFr(slug: string): Metadata {
  const s = getFrenchSound(slug);
  if (!s) return {};
  const url = absoluteUrl("fr", "/phonics/[skill]", { skill: s.slug });
  return {
    title: s.metaTitle,
    description: s.summary,
    alternates: alternatesFor("fr", "/phonics/[skill]", { skill: s.slug }),
    openGraph: { title: s.metaTitle, description: s.summary, url },
  };
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-paper px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

function WordCard({ w, marks }: { w: SoundWord; marks: FrenchSound["marks"] }) {
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
        text={w.withArticle}
        ariaLabel={`Écouter : ${w.withArticle}`}
        className="mt-2 text-sm font-bold text-crayon-blue underline underline-offset-2"
      >
        🔊 Écouter
      </ListenButton>
    </li>
  );
}

function soundLink(slug: string) {
  return { pathname: "/phonics/[skill]" as const, params: { skill: slug } };
}

export default function SoundFr({ slug }: { slug: string }) {
  // The page only renders sounds listed in lib/sons-fr.ts.
  const s = getFrenchSound(slug)!;
  const { prev, next } = soundNeighbors(s.slug);
  const url = absoluteUrl("fr", "/phonics/[skill]", { skill: s.slug });
  const related = s.related.map((r) => getFrenchSound(r)!);
  const fiche = ficheForSound(s.slug);
  const subtitle = [s.spellings, s.ipa && `Son : ${s.ipa}`, s.level].filter(Boolean).join(" · ");

  const lessonJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: s.title,
    description: s.summary,
    url,
    inLanguage: "fr",
    educationalLevel: s.level,
    learningResourceType: "Lesson",
    teaches: s.summary,
    isAccessibleForFree: true,
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Les sons", url: absoluteUrl("fr", "/phonics") },
    { name: s.title, url },
  ]);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/phonics">Les sons</Link> /</li>
          <li aria-current="page" className="font-bold">{s.title}</li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        <div className="letter-block bg-crayon-purple h-24 min-w-24 px-4 text-5xl shrink-0" aria-hidden="true">
          {s.short}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">{s.title}</h1>
          <p className="mt-1 text-chalkboard/70">{subtitle}</p>
        </div>
      </header>

      <div className="mt-6">
        <ListenButton text={s.soundSpoken} rate={0.75} className={primaryButton}>
          🔊 Écouter
        </ListenButton>
      </div>

      <p className="mt-6 text-lg text-chalkboard/80 max-w-2xl">{s.intro}</p>

      {s.rules && (
        <section className="mt-8 rounded-block bg-crayon-blue/10 p-6" aria-labelledby="rules-heading">
          <h2 id="rules-heading" className="text-2xl font-bold">
            {s.rules.length > 1 ? "Les règles" : "La règle"}
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-chalkboard/80">
            {s.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {s.tiles && (
        <section className="mt-10" aria-labelledby="tiles-heading">
          <h2 id="tiles-heading" className="text-2xl font-bold">
            {s.tiles.title}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {s.tiles.items.map((t) => (
              <li key={t.label}>
                <ListenButton
                  text={t.spoken ?? t.label}
                  rate={0.7}
                  ariaLabel={`Écouter : ${t.label}`}
                  className="min-w-16 rounded-block border-2 border-chalkboard/15 bg-paper px-4 py-2 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
                >
                  <span className="block font-display font-bold text-2xl">{t.label}</span>
                  {t.note && <span className="block text-xs text-chalkboard/70">{t.note}</span>}
                </ListenButton>
              </li>
            ))}
          </ul>
        </section>
      )}

      {s.builder && (
        <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="builder-heading">
          <h2 id="builder-heading" className="text-2xl font-bold">
            Fabrique une syllabe
          </h2>
          <div className="mt-3">
            <SyllableBuilder />
          </div>
        </section>
      )}

      {s.words && (
        <section className="mt-10" aria-labelledby="words-heading">
          <h2 id="words-heading" className="text-2xl font-bold">
            {s.builder ? "Des mots à lire, syllabe par syllabe" : "Des mots pour s'entraîner"}
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {s.words.map((w) => (
              <WordCard key={w.word} w={w} marks={s.marks} />
            ))}
          </ul>
        </section>
      )}

      {s.sentence && (
        <section className="mt-10 rounded-block border-2 border-dashed border-chalkboard/15 p-6" aria-labelledby="sentence-heading">
          <h2 id="sentence-heading" className="text-2xl font-bold">
            Je lis une phrase
          </h2>
          <p className="mt-3 font-display text-2xl">{s.sentence}</p>
          <ListenButton
            text={s.sentence}
            rate={0.75}
            ariaLabel="Écouter la phrase"
            className="mt-3 text-sm font-bold text-crayon-blue underline underline-offset-2"
          >
            🔊 Écouter la phrase
          </ListenButton>
        </section>
      )}

      {s.hunt && (
        <section className="mt-10 rounded-block bg-crayon-green/10 p-6" aria-labelledby="hunt-heading">
          <h2 id="hunt-heading" className="text-2xl font-bold">
            À toi de jouer
          </h2>
          <div className="mt-3">
            <SoundHunt hunt={s.hunt} />
          </div>
        </section>
      )}

      {fiche && (
        <section className="mt-10 flex flex-wrap items-center gap-4 rounded-block border border-chalkboard/10 p-5" aria-labelledby="fiche-heading">
          <div>
            <h2 id="fiche-heading" className="text-2xl font-bold">
              La fiche à imprimer
            </h2>
            <p className="mt-1 text-chalkboard/70">Les mots à lire, la phrase et des mots à écrire en cursive, sur une page A4.</p>
          </div>
          <Link
            href={{ pathname: "/worksheets/[category]", params: { category: fiche.slug } }}
            className="rounded-block bg-crayon-green text-white px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            Voir la fiche
          </Link>
        </section>
      )}

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="tip-heading">
        <h2 id="tip-heading" className="text-2xl font-bold">
          Bon à savoir pour les parents
        </h2>
        <p className="mt-2 text-chalkboard/80">{s.tip}</p>
      </section>

      <section className="mt-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="text-2xl font-bold">
          À découvrir aussi
        </h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {related.map((r) => (
            <li key={r.slug}>
              <Link
                href={soundLink(r.slug)}
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
              L&apos;alphabet
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Questions fréquentes
        </h2>
        <dl className="mt-4 space-y-5">
          {s.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-label="Son précédent et suivant" className="mt-12 flex justify-between gap-4 text-sm">
        {prev ? (
          <Link href={soundLink(prev.slug)} className="font-display font-bold">
            ← {prev.title}
          </Link>
        ) : (
          <Link href="/phonics" className="font-display font-bold">
            ← Tous les sons
          </Link>
        )}
        {next ? (
          <Link href={soundLink(next.slug)} className="font-display font-bold text-right">
            {next.title} →
          </Link>
        ) : (
          <Link href="/phonics" className="font-display font-bold text-right">
            Tous les sons →
          </Link>
        )}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
