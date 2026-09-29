import type { Metadata } from "next";
import Link from "next/link";
import { games } from "@/lib/games-data";

export const metadata: Metadata = {
  title: "Learning Games",
  description: "Five simple educational games for practicing letters and sounds: Find the Letter, Match Letter and Picture, Beginning Sound, Letter Tracing, and Alphabet Quiz.",
  alternates: { canonical: "https://alphabes.com/games" },
};

export default function GamesPage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Fun Learning Games</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Five games that work on desktop and mobile, built to reinforce letter recognition and phonics.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {games.map((g) => (
          <div key={g.slug} className="rounded-block border border-chalkboard/10 p-6 shadow-block">
            <h2 className="font-display font-bold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{g.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${g.isPremium ? "bg-crayon-purple/20 text-crayon-purple" : "bg-crayon-green/20 text-crayon-green"}`}>
                {g.isPremium ? "Pro" : "Free"}
              </span>
              <Link
                href={`/games/${g.slug}`}
                className="rounded-block bg-chalkboard text-paper font-display font-bold px-4 py-2 text-sm shadow-block hover:shadow-blockHover transition"
              >
                ▶ Play
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
