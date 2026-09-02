import type { Metadata } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Printable and on-screen alphabet flashcards for letter and vocabulary practice.",
  alternates: { canonical: "https://alphabes.com/flashcards" },
};

export default function FlashcardsPage() {
  const letters = getAllLetterSlugs();
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Flashcards</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Flip through letter flashcards to practice recognition, or print a set for offline use.
      </p>
      <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {letters.map((l) => (
          <div key={l} className="letter-block bg-crayon-yellow aspect-[3/4] text-3xl">
            {l.toUpperCase()}
          </div>
        ))}
      </div>
    </main>
  );
}
