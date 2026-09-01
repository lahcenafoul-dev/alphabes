import Link from "next/link";
import type { Metadata } from "next";
import { getAllLetterSlugs } from "@/lib/letters-data";

export const metadata: Metadata = {
  title: "AlphaBes — Learn Letters. Learn Sounds. Learn English.",
  description:
    "Make learning ABCs fun with interactive alphabet lessons, phonics practice, printable worksheets, and games for children ages 3-8.",
  alternates: { canonical: "https://alphabes.com" },
};

const letters = getAllLetterSlugs();

const blockColors = [
  "bg-crayon-red",
  "bg-crayon-blue",
  "bg-crayon-yellow",
  "bg-crayon-green",
  "bg-crayon-purple",
];

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What ages is AlphaBes designed for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AlphaBes is designed for children ages 3 to 8, covering letter recognition through early phonics and CVC words.",
        },
      },
      {
        "@type": "Question",
        name: "Is AlphaBes free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AlphaBes offers a free plan with basic alphabet lessons, selected worksheets, and basic games. A Pro subscription unlocks the full library.",
        },
      },
    ],
  };

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Make Learning ABCs Fun!
            </h1>
            <p className="mt-5 text-lg md:text-xl text-paper/80 max-w-md">
              Learn letters, sounds, words and phonics through fun interactive
              activities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
              >
                Start Learning Free
              </Link>
              <Link
                href="/worksheets"
                className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition"
              >
                Explore Worksheets
              </Link>
            </div>
          </div>

          {/* Signature element: shelf of wooden alphabet blocks */}
          <div
            className="grid grid-cols-6 gap-2 md:gap-3"
            role="img"
            aria-label="Shelf of wooden alphabet blocks from A to Z"
          >
            {letters.map((l, i) => (
              <div
                key={l}
                className="letter-block aspect-square text-xl md:text-2xl"
              >
                {l.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1. Learn the Alphabet */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Learn the Alphabet</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Every letter has its own lesson: the uppercase and lowercase form,
          its sound with audio playback, and real example words.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <Link
              key={l}
              href={`/alphabet/${l}`}
              className={`letter-block aspect-square text-lg ${blockColors[i % blockColors.length]}`}
              aria-label={`Letter ${l.toUpperCase()} lesson`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Practice Phonics */}
      <section className="bg-crayon-blue/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Practice Phonics</h2>
          <p className="mt-2 text-chalkboard/70 max-w-2xl">
            Build reading skills step by step: letter sounds, beginning
            sounds, CVC words, and blending.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Letter Sounds", href: "/phonics/letter-sounds" },
              { title: "Beginning Sounds", href: "/phonics/beginning-sounds" },
              { title: "CVC Words", href: "/phonics/cvc-words" },
              { title: "Blending", href: "/phonics/blending" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-block bg-paper p-5 shadow-block hover:shadow-blockHover transition font-display font-bold"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Free Printable Worksheets */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Free Printable Worksheets</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Alphabet, tracing, phonics, coloring, and handwriting worksheets,
          ready to print at home or in the classroom.
        </p>
        <Link
          href="/worksheets"
          className="mt-6 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
        >
          Browse Worksheets
        </Link>
      </section>

      {/* 4. Fun Learning Games */}
      <section className="bg-crayon-yellow/15">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold">Fun Learning Games</h2>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Find the Letter",
              "Match Letter and Picture",
              "Beginning Sound",
              "Letter Tracing",
              "Alphabet Quiz",
            ].map((title) => (
              <div
                key={title}
                className="rounded-block bg-paper p-5 shadow-block font-display font-bold text-center"
              >
                {title}
              </div>
            ))}
          </div>
          <Link
            href="/games"
            className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            Play Now
          </Link>
        </div>
      </section>

      {/* 5. Parent Dashboard */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold">Parent Dashboard</h2>
          <p className="mt-2 text-chalkboard/70">
            Track your child&apos;s alphabet, phonics, and vocabulary
            progress, see completed lessons, and get a recommended next step.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition"
          >
            View Dashboard
          </Link>
        </div>
        <div className="rounded-block bg-chalkboard text-paper p-6 shadow-block">
          <p className="font-display font-bold text-lg">This week</p>
          <ul className="mt-3 space-y-2 text-paper/80 text-sm">
            <li>12 lessons completed</li>
            <li>Alphabet: 18 / 26 letters</li>
            <li>Next up: Letter S — beginning sounds</li>
          </ul>
        </div>
      </section>

      {/* 6. Premium Membership */}
      <section className="bg-chalkboard text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold">AlphaBes Pro</h2>
          <p className="mt-2 text-paper/70 max-w-xl mx-auto">
            Unlock every worksheet, game, and phonics lesson, plus progress
            tracking and printable bundles.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-block bg-paper text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Monthly</p>
              <p className="mt-2 text-3xl font-extrabold">$7.99<span className="text-base font-normal">/mo</span></p>
            </div>
            <div className="rounded-block bg-crayon-yellow text-chalkboard p-6 w-64 shadow-block">
              <p className="font-display font-bold text-xl">Annual</p>
              <p className="mt-2 text-3xl font-extrabold">$59<span className="text-base font-normal">/yr</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 inline-block rounded-block bg-crayon-green px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            See Full Pricing
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-display font-bold text-lg">
              What ages is AlphaBes designed for?
            </dt>
            <dd className="mt-1 text-chalkboard/70">
              AlphaBes is designed for children ages 3 to 8, covering letter
              recognition through early phonics and CVC words.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-lg">
              Is AlphaBes free to use?
            </dt>
            <dd className="mt-1 text-chalkboard/70">
              Yes. The free plan includes basic alphabet lessons, selected
              worksheets, and basic games. Pro unlocks the full library.
            </dd>
          </div>
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
