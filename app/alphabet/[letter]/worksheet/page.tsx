import { alphabetData, getLetterData } from "@/lib/alphabet-data";
import WorksheetClient from "@/components/WorksheetClient";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { letter: string };
};

export function generateStaticParams() {
  return alphabetData.map((l) => ({ letter: l.letter }));
}

export default function LetterWorksheetPage({ params }: Props) {
  const data = getLetterData(params.letter);
  if (!data) return notFound();

  const { letter, word, emoji } = data;
  const upper = letter.toUpperCase();

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav className="text-sm text-chalkboard/60">
        <Link href="/">Home</Link> / <Link href="/worksheets/alphabet">Alphabet</Link> / Letter {upper}
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
        <div className="mt-4 flex gap-4 text-5xl font-extrabold text-chalkboard/20 select-none">
          <span>{upper}</span>
          <span>{upper}</span>
          <span>{upper}</span>
          <span>{letter}</span>
          <span>{letter}</span>
          <span>{letter}</span>
        </div>
      </div>

      <WorksheetClient letter={letter} word={word} emoji={emoji} />
    </main>
  );
}