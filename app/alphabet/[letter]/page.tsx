import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { speak } from "@/lib/speech";
import { wordEmojis } from "@/lib/wordEmojis";
type Props = { params: { letter: string } };

export function generateStaticParams() {
  return getAllLetterSlugs().map((letter) => ({ letter }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getLetterContent(params.letter);
  if (!content) return {};
  const title = `Letter ${content.uppercase} — Sound, Words & Activities`;
  const description = `Teach the letter ${content.uppercase}${content.lowercase}: its sound ${content.ipa || ""}, example words, tracing, and a printable worksheet.`.trim();
  return {
    title,
    description,
    alternates: { canonical: `https://alphabes.com/alphabet/${content.slug}` },
    openGraph: { title, description, url: `https://alphabes.com/alphabet/${content.slug}` },
  };
}

function neighbor(slug: string, dir: -1 | 1): string | null {
  const all = getAllLetterSlugs();
  const idx = all.indexOf(slug);
  const nextIdx = idx + dir;
  return all[nextIdx] ?? null;
}

export default function LetterPage({ params }: Props) {
  const content = getLetterContent(params.letter);
  if (!content) notFound();

  const prev = neighbor(content.slug, -1);
  const next = neighbor(content.slug, 1);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `Letter ${content.uppercase} lesson`,
    educationalLevel: "Preschool-Kindergarten",
    learningResourceType: "Lesson",
    teaches: `Recognizing and sounding out the letter ${content.uppercase}`,
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://alphabes.com" },
      { "@type": "ListItem", position: 2, name: "Alphabet", item: "https://alphabes.com/alphabet" },
      { "@type": "ListItem", position: 3, name: `Letter ${content.uppercase}`, item: `https://alphabes.com/alphabet/${content.slug}` },
    ],
  };

  const faqJsonLd = content.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/alphabet">Alphabet</Link> /</li>
          <li aria-current="page" className="font-bold">Letter {content.uppercase}</li>
        </ol>
      </nav>

      <header className="mt-6 flex items-center gap-6">
        <div className="letter-block bg-crayon-blue w-24 h-24 text-5xl shrink-0">
          {content.uppercase}
        </div>
        <div>
          <h1 className="text-4xl font-extrabold">
            Letter {content.uppercase} {content.lowercase}
          </h1>
          {content.ipa && (
            <p className="mt-1 text-chalkboard/70">
              Sound: {content.phonicsSound} {content.ipa}
            </p>
          )}
        </div>
      </header>

      <button
        type="button"
        onClick={() => speak(content.uppercase)}
        className="mt-6 inline-flex items-center gap-2 rounded-block bg-crayon-yellow px-5 py-2.5 font-display font-bold shadow-block hover:shadow-blockHover transition"
        aria-label={`Listen and repeat the letter ${content.uppercase} sound`}
        data-audio-src={`/audio/letters/${content.slug}.mp3`}
      >
        🔊 Listen &amp; Repeat
      </button>

      {content.exampleWords.length > 0 && (
        <section className="mt-10" aria-labelledby="words-heading">
          <h2 id="words-heading" className="text-2xl font-bold">
            Example Words
          </h2>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {content.exampleWords.map((w) => (
              <li
                key={w.word}
                className="rounded-block bg-paper border border-chalkboard/10 p-4 text-center shadow-block"
              >
                <div
                  className="mx-auto h-16 w-16 rounded-full bg-crayon-gr... flex items-center justify-center text-4xl"
                  role="img"
                  aria-label={w.imageAlt}                  
>
  {wordEmojis[w.word] || "📦"}
</div>
              
                <p className="mt-2 font-display font-bold">{w.word}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10" aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="text-2xl font-bold">
          Activities
        </h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <ActivityCard
            title="Letter Recognition"
            description={`Find every ${content.uppercase} and ${content.lowercase} on the screen.`}
          />
          <ActivityCard
            title="Tracing"
            description={`Trace the uppercase and lowercase ${content.uppercase}.`}
          />
          <ActivityCard
            title="Beginning Sound"
            description={`Listen and pick the pictures that start with ${content.phonicsSound}.`}
          />
          <ActivityCard
            title="Coloring Worksheet"
            description={`Color a page featuring the letter ${content.uppercase}.`}
          />
        </div>
      </section>

      <section className="mt-10 rounded-block bg-crayon-green/10 p-6">
        <h2 className="text-2xl font-bold">Printable Worksheet</h2>
        <p className="mt-2 text-chalkboard/70">
          A tracing and coloring worksheet for the letter {content.uppercase}.
        </p>
        <Link
          href={`/worksheets/alphabet#${content.slug}`}
          className="mt-4 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Get the Worksheet
        </Link>
      </section>

      {content.faq.length > 0 && (
        <section className="mt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold">
            FAQ
          </h2>
          <dl className="mt-4 space-y-5">
            {content.faq.map((f) => (
              <div key={f.question}>
                <dt className="font-display font-bold">{f.question}</dt>
                <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <nav className="mt-12 flex justify-between text-sm">
        {prev ? (
          <Link href={`/alphabet/${prev}`} className="font-display font-bold">
            ← Letter {prev.toUpperCase()}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/alphabet/${next}`} className="font-display font-bold">
            Letter {next.toUpperCase()} →
          </Link>
        ) : <span />}
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </main>
  );
}

function ActivityCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-block border border-chalkboard/10 p-4">
      <p className="font-display font-bold">{title}</p>
      <p className="mt-1 text-sm text-chalkboard/70">{description}</p>
    </div>
  );
}
