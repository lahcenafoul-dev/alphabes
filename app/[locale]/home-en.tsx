import Link from "next/link";
import type { Metadata } from "next";
import OwlHome, { type HomeCopy } from "@/components/home/OwlHome";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { alternatesFor } from "@/lib/i18n/routes";

const title = "Free Alphabet Worksheets & Activities for Kids | AlphaBes";
const description =
  "Free printable alphabet worksheets, letter tracing activities, and phonics practice for preschool and kindergarten. Interactive lessons and games for ages 3-8.";

export const homeMetadataEn: Metadata = {
  title,
  description,
  alternates: alternatesFor("en", "/"),
  openGraph: { title, description, url: "https://alphabes.com" },
};

const letters = getAllLetterSlugs();

const blockColors = [
  "text-owl-purple",
  "text-[#C2185B]",
  "text-owl-green-dark",
  "text-[#B9520E]",
  "text-owl-ink",
];

// The words of the "Owl Quiz" design (components/home/OwlHome.tsx).
const copy: HomeCopy = {
  nav: { games: "Games", worksheets: "Worksheets", stories: "Stories", parents: "Parents", join: "Join free" },
  headline: { line1: "Little minds,", big: "big", after: "s." },
  intro:
    "Our friendly owl guides children aged 3–8 through letters, sounds and first words, one playful question at a time.",
  play: "Play for free",
  howItWorks: "Watch how it works",
  speaks: "Speaks",
  quiz: {
    label: "Owl quiz",
    question: "Which one starts with",
    roundLabel: "Question {n} of {total}",
    allDone: "All done",
    stars: "Stars: {score}",
    hearLetter: "Hear the letter {letter}",
    hint: "Tap the letter to hear it, then pick a picture.",
    right: "Yes! {word} starts with {letter}.",
    next: "Next",
    wrong: "Almost! Listen again and try another one.",
    tryAgainSpoken: "Try again",
    finalTitle: "Hoot hoot! You're a letter star.",
    playAgain: "Play again",
  },
  features: {
    title: "Everything a little reader needs",
    intro: "Games on screen, practice on paper, stories at bedtime.",
    letters: ["Letters & sounds", "Hear every letter name and sound, spoken clearly."],
    tracing: ["Tracing", "Draw each letter with a finger, stroke by stroke."],
    worksheets: ["Worksheets", "Print tracing, coloring and number pages."],
    stories: ["Story time", "Short picture stories to read together."],
  },
  path: {
    title: "A clear path from A to Z",
    steps: [
      ["Meet the letter", "Name, sound and a picture word."],
      ["Play a quick game", "Questions that check it stuck."],
      ["Trace and print", "Practice writing on screen and paper."],
      ["Read a story", "Put the new letters to use."],
    ],
  },
  parents: {
    title: "Built for parents, too",
    text: "A profile for each child, progress you can see at a glance, and the next worksheet ready to print.",
    cta: "Create a free account",
  },
  footer: { ages: "© AlphaBes · Ages 3–8", languages: "Languages", legal: "About AlphaBes" },
};

export default function HomeEn() {
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
      {
        "@type": "Question",
        name: "Do I need to print worksheets in color?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Every worksheet is designed to print clearly in black and white, so a home printer or a school photocopier works fine.",
        },
      },
      {
        "@type": "Question",
        name: "What is a CVC word?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A CVC word is a consonant-vowel-consonant word like cat, dog, or sun. These short, consistent words are usually a child's first readable words once letter sounds are solid.",
        },
      },
    ],
  };

  return (
    <OwlHome locale="en" copy={copy}>
      {/* Intro: the text of the former hero */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Free Alphabet Worksheets &amp; Activities for Kids</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Learn letters A-Z, letter sounds, and tracing with free
          printable worksheets, phonics practice, and fun interactive
          activities for preschool and kindergarten, ages 3-8.
        </p>
        <Link href="/worksheets" className="mt-6 owl-btn owl-btn-purple">
          Explore Worksheets
        </Link>
      </section>

      {/* 1. Learn the Alphabet */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Learn the Alphabet</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Every letter has its own lesson: the uppercase and lowercase form,
          its sound with audio playback, and real example words.
        </p>
        <div className="mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {letters.map((l, i) => (
            <Link
              key={l}
              href={`/alphabet/${l}`}
              className={`owl-letter aspect-square text-3xl md:text-4xl ${blockColors[i % blockColors.length]}`}
              aria-label={`Letter ${l.toUpperCase()} lesson`}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Practice Phonics */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Practice Phonics</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
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
                className="owl-card"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Free Printable Worksheets */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Free Alphabet Worksheets</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          AlphaBes has 260+ free printable alphabet worksheets covering every letter A-Z: tracing,
          coloring, handwriting, letter recognition, and beginning sounds. They&apos;re built for
          parents, homeschool families, and preschool and kindergarten teachers who want printable
          PDF worksheets they can hand a child right away, without extra prep.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/worksheets"
            className="owl-btn owl-btn-purple"
          >
            Browse Worksheets
          </Link>
          <Link href="/blog" className="font-display font-bold text-owl-purple hover:underline">
            Read our tips for teaching the alphabet →
          </Link>
        </div>
      </section>

      {/* 3b. Letter Tracing */}
      <section className="bg-owl-mint">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Letter Tracing</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Every letter has its own uppercase and lowercase tracing worksheet, with dotted guides
            a child follows before writing the letter independently. Cursive tracing practice is
            also available for every letter once print handwriting feels solid.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/worksheets/tracing"
              className="owl-btn owl-btn-ink"
            >
              Letter Tracing Worksheets
            </Link>
            <Link
              href="/worksheets/letter-cursive"
              className="owl-btn owl-btn-outline"
            >
              Cursive Tracing Worksheets
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Fun Learning Games */}
      <section className="bg-owl-cream">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Fun Learning Games</h2>
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
                className="owl-card text-center"
              >
                {title}
              </div>
            ))}
          </div>
          <Link
            href="/games"
            className="mt-6 owl-btn owl-btn-ink"
          >
            Play Now
          </Link>
        </div>
      </section>

      {/* 4b. Printable PDF Worksheets */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Printable PDF Worksheets</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          Every worksheet is a print-ready PDF: preview it on screen, then print or download it in
          one click. No account is required for the free worksheets, so a teacher can print a
          class set the night before, or a parent can grab one worksheet on the way out the door.
        </p>
      </section>

      {/* 4c. Preschool & Kindergarten Activities */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Preschool &amp; Kindergarten Activities</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
            Beyond worksheets, AlphaBes has hands-on activities, flashcards, and games sized for
            preschool and kindergarten attention spans.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Link href="/preschool" className="owl-card">
              Preschool Hub
            </Link>
            <Link href="/kindergarten" className="owl-card">
              Kindergarten Hub
            </Link>
            <Link href="/activities" className="owl-card">
              Activities
            </Link>
            <Link href="/flashcards" className="owl-card">
              Flashcards
            </Link>
            <Link href="/worksheets/coloring" className="owl-card">
              Coloring Worksheets
            </Link>
          </div>
        </div>
      </section>

      {/* 4d. Popular Worksheets */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Popular Worksheets</h2>
        <p className="mt-3 text-lg leading-relaxed text-owl-muted max-w-2xl">
          A few favorites parents and teachers come back to.
        </p>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Letter A Tracing Worksheet", href: "/worksheets/letter-a-tracing" },
            { title: "Alphabet Writing Practice", href: "/worksheets/alphabet-writing-practice" },
            { title: "Beginning Sounds Worksheets", href: "/worksheets/beginning-sounds-practice" },
            { title: "CVC Words Worksheets", href: "/worksheets/cvc-words" },
            { title: "Sight Words Worksheets", href: "/worksheets/sight-words" },
            { title: "Shape Tracing Worksheets", href: "/worksheets/shapes" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="owl-card"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Parent Dashboard */}
      <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Parent Dashboard</h2>
          <p className="mt-3 text-lg leading-relaxed text-owl-muted">
            Track your child&apos;s alphabet, phonics, and vocabulary
            progress, see completed lessons, and get a recommended next step.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 owl-btn owl-btn-purple"
          >
            View Dashboard
          </Link>
        </div>
        <div className="rounded-3xl bg-owl-ink text-white p-6">
          <p className="font-display font-bold text-lg">This week</p>
          <ul className="mt-3 space-y-2 text-[#C9C3EE] text-sm">
            <li>12 lessons completed</li>
            <li>Alphabet: 18 / 26 letters</li>
            <li>Next up: Letter S — beginning sounds</li>
          </ul>
        </div>
      </section>

      {/* 6. Premium Membership */}
      <section className="bg-owl-ink text-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">AlphaBes Pro</h2>
          <p className="mt-3 text-lg text-[#C9C3EE] max-w-xl mx-auto">
            Unlock every worksheet, game, and phonics lesson, plus progress
            tracking and printable bundles.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <div className="rounded-3xl bg-white text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Monthly</p>
              <p className="mt-2 text-3xl font-extrabold">$7.99<span className="text-base font-normal">/mo</span></p>
            </div>
            <div className="rounded-3xl bg-owl-sun text-owl-ink p-6 w-64">
              <p className="font-display font-bold text-xl">Annual</p>
              <p className="mt-2 text-3xl font-extrabold">$59<span className="text-base font-normal">/yr</span></p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-8 owl-btn owl-btn-sun"
          >
            See Full Pricing
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Frequently Asked Questions</h2>
        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-display font-bold text-lg">
              What ages is AlphaBes designed for?
            </dt>
            <dd className="mt-1 leading-relaxed text-owl-muted">
              AlphaBes is designed for children ages 3 to 8, covering letter
              recognition through early phonics and CVC words.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-lg">
              Is AlphaBes free to use?
            </dt>
            <dd className="mt-1 leading-relaxed text-owl-muted">
              Yes. The free plan includes basic alphabet lessons, selected
              worksheets, and basic games. Pro unlocks the full library.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-lg">
              Do I need to print worksheets in color?
            </dt>
            <dd className="mt-1 leading-relaxed text-owl-muted">
              No. Every worksheet is designed to print clearly in black and
              white, so a home printer or a school photocopier works fine.
            </dd>
          </div>
          <div>
            <dt className="font-display font-bold text-lg">
              What is a CVC word?
            </dt>
            <dd className="mt-1 leading-relaxed text-owl-muted">
              A CVC word is a consonant-vowel-consonant word like cat, dog, or
              sun. These short, consistent words are usually a child&apos;s
              first readable words once letter sounds are solid.
            </dd>
          </div>
        </dl>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </OwlHome>
  );
}
