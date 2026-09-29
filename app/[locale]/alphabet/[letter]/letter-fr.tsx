import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { cursiveFont } from "@/lib/fonts/cursive";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import {
  ACCENTS_SLUG,
  frenchNeighbors,
  getFrenchLetter,
  isAccentLetter,
  type FrenchLetter,
  type FrenchWord,
} from "@/lib/letters-fr";

/** "B", or "É (e accent aigu)" for a letter with an accent: used in titles. */
function letterLabel(l: FrenchLetter): string {
  return isAccentLetter(l) ? `${l.upper} (${l.name})` : l.upper;
}

export function letterMetadataFr(param: string): Metadata {
  const l = getFrenchLetter(param);
  if (!l) return {};
  const [w1, w2] = l.words;
  const title = `La lettre ${letterLabel(l)} : son, mots et tracé`;
  const description = `Apprendre la lettre ${l.upper} ${l.lower} : son nom (« ${l.name} »), le son ${l.ipa}, des mots comme ${w1.word.toLowerCase()} et ${w2.word.toLowerCase()}, et une fiche de tracé en script et en cursive.`;
  const url = absoluteUrl("fr", "/alphabet/[letter]", { letter: l.slug });
  return {
    title,
    description,
    alternates: alternatesFor("fr", "/alphabet/[letter]", { letter: l.slug }),
    openGraph: { title, description, url },
  };
}

const primaryButton =
  "inline-flex items-center gap-2 rounded-block bg-crayon-blue text-paper px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-block border-2 border-chalkboard/20 bg-paper px-5 py-2.5 font-display font-bold hover:border-crayon-blue transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

function WordCard({ w }: { w: FrenchWord }) {
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
        text={w.withArticle}
        ariaLabel={`Écouter : ${w.withArticle}`}
        className="mt-2 text-sm font-bold text-crayon-blue underline underline-offset-2"
      >
        🔊 Écouter
      </ListenButton>
    </li>
  );
}

export default function LetterFr({ letter }: { letter: string }) {
  // The page only renders letters listed by frenchLetterParams().
  const l = getFrenchLetter(letter)!;
  const { prev, next } = frenchNeighbors(l.slug);
  const url = absoluteUrl("fr", "/alphabet/[letter]", { letter: l.slug });
  const related = (l.related ?? []).map((slug) => (slug === ACCENTS_SLUG ? null : getFrenchLetter(slug)!));
  const faq = [{ question: `Quel son fait la lettre ${l.upper} ?`, answer: l.sound }, l.faq];

  const lessonJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `La lettre ${letterLabel(l)}`,
    inLanguage: "fr",
    educationalLevel: "Maternelle",
    learningResourceType: "Lesson",
    teaches: `Reconnaître la lettre ${l.upper}, son nom et son son`,
    isAccessibleForFree: true,
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Alphabet", url: absoluteUrl("fr", "/alphabet") },
    { name: `Lettre ${l.upper}`, url },
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
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/alphabet">Alphabet</Link> /</li>
          <li aria-current="page" className="font-bold">Lettre {l.upper}</li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-wrap items-center gap-6">
        <div className="letter-block bg-crayon-blue w-24 h-24 text-5xl shrink-0">{l.upper}</div>
        <div>
          <h1 className="text-4xl font-extrabold">
            La lettre {l.upper} {l.lower}
          </h1>
          <p className="mt-1 text-chalkboard/70">
            {isAccentLetter(l) ? "On dit" : "Son nom"} : « {l.name} » · Son : {l.ipa} ·{" "}
            {l.kind === "voyelle" ? "une voyelle" : "une consonne"}
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-3">
        <ListenButton text={l.nameSpoken} rate={0.7} className={primaryButton}>
          🔊 Le nom de la lettre
        </ListenButton>
        <ListenButton text={l.soundSpoken} rate={0.75} className={secondaryButton}>
          🔊 Le son
        </ListenButton>
      </div>

      <p className="mt-6 text-lg text-chalkboard/80 max-w-2xl">{l.sound}</p>

      <section className="mt-10" aria-labelledby="forms-heading">
        <h2 id="forms-heading" className="text-2xl font-bold">
          Les trois façons de l&apos;écrire
        </h2>
        <ul className="mt-4 grid grid-cols-3 gap-4 max-w-xl">
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className="block text-5xl font-extrabold">{l.upper}</span>
            <span className="mt-2 block text-sm text-chalkboard/70">Capitale</span>
          </li>
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className="block text-5xl font-extrabold">{l.lower}</span>
            <span className="mt-2 block text-sm text-chalkboard/70">Script</span>
          </li>
          <li className="rounded-block border border-chalkboard/10 bg-paper p-4 text-center shadow-block">
            <span className={`block text-4xl leading-[3rem] ${cursiveFont.className}`}>
              {l.upper} {l.lower}
            </span>
            <span className="mt-2 block text-sm text-chalkboard/70">Cursive</span>
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="words-heading">
        <h2 id="words-heading" className="text-2xl font-bold">
          Des mots avec {l.upper}
        </h2>
        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {l.words.map((w) => (
            <WordCard key={w.word} w={w} />
          ))}
        </ul>
        {l.wordsInside && (
          <>
            <h3 className="mt-6 font-display font-bold text-lg">On l&apos;entend aussi au milieu des mots</h3>
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
          Bon à savoir pour les parents
        </h2>
        <p className="mt-2 text-chalkboard/80">{l.tip}</p>
      </section>

      <section className="mt-10" aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="text-2xl font-bold">
          S&apos;entraîner
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Link
            href={{ pathname: "/alphabet/[letter]/worksheet", params: { letter: l.slug } }}
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">✏️ Tracer la lettre {l.upper}</p>
            <p className="mt-1 text-sm text-chalkboard/70">
              À l&apos;écran, au doigt ou à la souris, en script ou en cursive. Fiche PDF à imprimer.
            </p>
          </Link>
          <Link
            href="/flashcards"
            className="block rounded-block border border-chalkboard/10 p-4 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition"
          >
            <p className="font-display font-bold">🖼️ L&apos;imagier de l&apos;alphabet</p>
            <p className="mt-1 text-sm text-chalkboard/70">
              Tous les mots de A à Z, en images, à écouter.
            </p>
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-bold">
            À découvrir aussi
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {related.map((r) => (
              <li key={r?.slug ?? ACCENTS_SLUG}>
                <Link
                  href={{ pathname: "/alphabet/[letter]", params: { letter: r?.slug ?? ACCENTS_SLUG } }}
                  className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 font-display font-bold hover:border-crayon-blue transition-colors"
                >
                  {r ? `La lettre ${r.upper}` : "Les accents"}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-2xl font-bold">
          Questions fréquentes
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

      <nav aria-label="Lettre précédente et suivante" className="mt-12 flex justify-between text-sm">
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: prev.slug } }} className="font-display font-bold">
          ← Lettre {prev.upper}
        </Link>
        <Link href={{ pathname: "/alphabet/[letter]", params: { letter: next.slug } }} className="font-display font-bold">
          Lettre {next.upper} →
        </Link>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
