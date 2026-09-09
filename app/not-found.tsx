import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="flex justify-center gap-3" aria-hidden="true">
        {["4", "0", "4"].map((char, i) => (
          <div key={i} className="letter-block bg-crayon-yellow h-20 w-20 text-4xl">
            {char}
          </div>
        ))}
      </div>

      <h1 className="mt-8 text-3xl font-extrabold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-chalkboard/70">
        The page you&apos;re looking for may have moved or no longer exists. Here are some good
        places to start instead:
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Go Home
        </Link>
        <Link
          href="/worksheets"
          className="rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
        >
          Browse Worksheets
        </Link>
        <Link
          href="/alphabet"
          className="rounded-block border-2 border-chalkboard/20 font-display font-bold px-5 py-2.5 hover:border-crayon-blue transition"
        >
          Explore the Alphabet
        </Link>
      </div>
    </main>
  );
}
