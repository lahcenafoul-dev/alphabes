import { alphabetData, getLetterData } from "@/lib/alphabet-data";
import WorksheetClient from "@/components/WorksheetClient";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TracingCanvas from "@/components/TracingCanvas";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
type Props = {
  params: { letter: string };
};

export function generateStaticParams() {
  return alphabetData.map((l) => ({ letter: l.letter }));
}

export function generateMetadata({ params }: Props): Metadata {
  const data = getLetterData(params.letter);
  if (!data) return {};
  const { letter, word } = data;
  const upper = letter.toUpperCase();
  const title = `Letter ${upper} Worksheet — Trace, Listen & Print`;
  const description = `Free printable letter ${upper}${letter} worksheet: trace the letter, listen to its sound, and learn the word "${word}". Download as PDF.`;
  return {
    title,
    description,
    alternates: { canonical: `https://alphabes.com/alphabet/${letter}/worksheet` },
    openGraph: { title, description, url: `https://alphabes.com/alphabet/${letter}/worksheet` },
  };
}

export default function LetterWorksheetPage({ params }: Props) {
  const data = getLetterData(params.letter);
  if (!data) return notFound();

  const { letter, word, emoji } = data;
  const upper = letter.toUpperCase();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://alphabes.com" },
    { name: "Alphabet", url: "https://alphabes.com/worksheets/alphabet" },
    { name: `Letter ${upper}`, url: `https://alphabes.com/alphabet/${letter}/worksheet` },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/worksheets/alphabet">Alphabet</Link> /</li>
          <li aria-current="page" className="font-bold">Letter {upper}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">Letter {upper}{letter} Worksheet</h1>
      <p className="mt-2 text-chalkboard/70">
        Trace the letter, listen to its sound, and learn a new word!
      </p>

      <div className="mt-10 rounded-block border border-chalkboard/20 p-8 text-center">
        <div className="text-8xl font-extrabold text-crayon-blue/30 select-none">
          {upper}{letter}
        </div>
        <div className="mt-4 text-6xl">{emoji}</div>
        <p className="mt-2 text-2xl font-display font-bold">{word}</p>
      </div>

      <div className="mt-8">
  <h2 className="text-xl font-bold">Practice tracing</h2>
  <p className="mt-1 text-sm text-chalkboard/60">
    Use your mouse or finger to trace the letter below.
  </p>
  <TracingCanvas letter={letter} />
</div>

      <WorksheetClient letter={letter} word={word} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}