import Link from "next/link";
import type { Metadata } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";

export const metadata: Metadata = {
  title: "Learn the Alphabet A-Z",
  description:
    "Explore every letter from A to Z with sounds, example words, tracing, and printable worksheets.",
  alternates: { canonical: "https://alphabes.com/alphabet" },
};

export default function AlphabetIndexPage() {
  const letters = getAllLetterSlugs();
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Learn the Alphabet</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Pick a letter to start its lesson: sound, example words, and
        activities.
      </p>
      <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
        {letters.map((l) => (
          <Link
            key={l}
            href={`/alphabet/${l}`}
            className="letter-block bg-crayon-blue aspect-square text-lg"
          >
            {l.toUpperCase()}
          </Link>
        ))}
      </div>
    </main>
  );
}
