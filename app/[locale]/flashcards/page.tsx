import type { Metadata } from "next";
import Link from "next/link";
import { alphabetData } from "@/lib/alphabet-data";
import SpeakButton from "@/components/SpeakButton";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Printable and on-screen alphabet flashcards for letter and vocabulary practice.",
  alternates: { canonical: "https://alphabes.com/flashcards" },
};

export default function FlashcardsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Flashcards</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Flip through letter flashcards to practice recognition, or print a set for offline use.
      </p>
      <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {alphabetData.map(({ letter, word, emoji }) => (
          <div
            key={letter}
            className="letter-block bg-crayon-yellow aspect-[3/4] flex-col gap-1 p-2 text-center"
          >
            <Link
              href={`/alphabet/${letter}`}
              className="flex flex-col items-center gap-1"
              aria-label={`Letter ${letter.toUpperCase()}: ${word}. View the lesson.`}
            >
              <span className="text-3xl font-extrabold">{letter.toUpperCase()}</span>
              <span className="text-2xl" aria-hidden="true">
                {emoji}
              </span>
              <span className="text-xs font-display font-bold">{word}</span>
            </Link>
            <SpeakButton
              text={`${letter.toUpperCase()}. ${word}.`}
              ariaLabel={`Listen to letter ${letter.toUpperCase()} and the word ${word}`}
              className="mt-1 text-xs underline underline-offset-2"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
