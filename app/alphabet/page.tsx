import Link from "next/link";
import type { Metadata } from "next";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { wordEmojis } from "@/lib/wordEmojis";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const BASE_URL = "https://alphabes.com";

const title = "Learn the Alphabet A–Z: Letters, Sounds & Worksheets";
const description =
  "Learn the alphabet from A to Z with letter sounds, uppercase and lowercase letters, tracing practice, phonics activities, and free printable worksheets for preschool and kindergarten.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/alphabet` },
  openGraph: { title, description, url: `${BASE_URL}/alphabet` },
};

const letters = getAllLetterSlugs();

type LearnCard = { title: string; description: string; href: string };

const learnCards: LearnCard[] = [
  {
    title: "Letter Recognition",
    description: "Learn to identify uppercase and lowercase letters.",
    href: "/worksheets/letter-recognition",
  },
  {
    title: "Letter Sounds",
    description: "Connect letters with their common sounds.",
    href: "/phonics/letter-sounds",
  },
  {
    title: "Uppercase and Lowercase",
    description: "Learn that the same letter can appear in uppercase and lowercase forms.",
    href: "/worksheets/uppercase-letters",
  },
  {
    title: "Letter Tracing",
    description: "Practice forming letters through guided tracing activities.",
    href: "/worksheets/letter-tracing",
  },
  {
    title: "Beginning Sounds",
    description: "Match letters with words that begin with each sound.",
    href: "/phonics/beginning-sounds",
  },
  {
    title: "Early Phonics",
    description: "Build foundational phonics skills for early reading.",
    href: "/phonics",
  },
];

const worksheetCategoryLinks: LearnCard[] = [
  { title: "Alphabet Worksheets", description: "The full A-Z worksheet library.", href: "/worksheets/alphabet" },
  { title: "Letter Tracing", description: "Dotted-guide tracing for every letter.", href: "/worksheets/letter-tracing" },
  { title: "Uppercase Practice", description: "Focused uppercase-letter pages.", href: "/worksheets/uppercase-letters" },
  { title: "Lowercase Practice", description: "Focused lowercase-letter pages.", href: "/worksheets/lowercase-letters" },
  { title: "Letter Recognition", description: "Find-and-circle recognition practice.", href: "/worksheets/letter-recognition" },
  { title: "Beginning Sounds", description: "Picture-and-sound matching pages.", href: "/worksheets/beginning-sounds-practice" },
  { title: "Letter Coloring", description: "Coloring pages built around each letter.", href: "/worksheets/letter-coloring" },
  { title: "Letter Writing", description: "Extended handwriting practice.", href: "/worksheets/alphabet-writing-practice" },
  { title: "Letter Matching", description: "Match each letter to a picture.", href: "/worksheets/letter-picture-matching" },
];

const activityLinks = [
  { title: "Find the Letter", href: "/games/find-the-letter" },
  { title: "Match Letter and Picture", href: "/games/match-letter-picture" },
  { title: "Beginning Sound", href: "/games/beginning-sound" },
  { title: "Letter Tracing", href: "/games/letter-tracing" },
  { title: "Alphabet Quiz", href: "/games/alphabet-quiz" },
  { title: "Letter Coloring", href: "/worksheets/letter-coloring" },
];

const popularResources = [
  { title: "Alphabet Worksheets", href: "/worksheets/alphabet" },
  { title: "Letter Tracing Worksheets", href: "/worksheets/letter-tracing" },
  { title: "Phonics Lessons", href: "/phonics" },
  { title: "Beginning Sounds Practice", href: "/phonics/beginning-sounds" },
  { title: "Alphabet Games", href: "/games" },
  { title: "Alphabet Activities", href: "/activities" },
  { title: "Blog", href: "/blog" },
  { title: "Letter A Lesson", href: "/alphabet/a" },
];

const faqItems = [
  {
    question: "What is the best way to teach the alphabet?",
    answer:
      "Combine a few methods rather than relying on one: say each letter's name and sound together, trace its shape, and connect it to a familiar word or picture. Short, repeated practice tends to work better than long, one-time lessons.",
  },
  {
    question: "When should children start learning letters?",
    answer:
      "Many children start recognizing letters around age 2 to 3, with most preschoolers actively learning letter names and shapes between ages 3 and 4.",
  },
  {
    question: "Should children learn uppercase or lowercase letters first?",
    answer:
      "Most children find uppercase letters easier to recognize first because their shapes are more visually distinct, so many programs introduce uppercase before lowercase.",
  },
  {
    question: "How can children practice letter sounds?",
    answer:
      "Pair each letter with a simple, familiar word that starts with its sound, like A for apple, and practice saying the sound out loud before naming the letter itself.",
  },
  {
    question: "Are alphabet worksheets useful for preschool?",
    answer:
      "Yes. Worksheets give preschoolers repeated, hands-on practice with letter shapes and beginning sounds, which reinforces what they're learning through games and books.",
  },
  {
    question: "How can I help my child practice letters at home?",
    answer:
      "Keep it short and low-pressure: point out letters on signs and packaging, trace a letter together, or print one worksheet at a time instead of a whole workbook in one sitting.",
  },
  {
    question: "What should children learn after recognizing the alphabet?",
    answer:
      "Once letter recognition is solid, most children move into letter sounds and beginning sounds, then start blending those sounds into simple CVC words like cat or dog.",
  },
];

export default function AlphabetIndexPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Alphabet", url: `${BASE_URL}/alphabet` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/alphabet`,
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Learn the Alphabet A-Z",
    description,
    url: `${BASE_URL}/alphabet`,
    educationalLevel: "Preschool-Kindergarten",
    learningResourceType: "Lesson",
    teaches: "Letter recognition, letter sounds, tracing, and early phonics for the alphabet A-Z",
    typicalAgeRange: "3-6",
    isAccessibleForFree: true,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li aria-current="page" className="font-bold">Alphabet</li>
        </ol>
      </nav>

      {/* Hero */}
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Learn the Alphabet A–Z: Letters, Sounds &amp; Printable Activities
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Help your child learn letters from A to Z with interactive lessons, letter sounds,
          tracing practice, phonics activities, and printable worksheets designed for preschool
          and kindergarten learners.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/alphabet/a"
            className="rounded-block bg-crayon-blue text-paper font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
          >
            Explore Letters A–Z
          </Link>
          <Link
            href="/worksheets"
            className="rounded-block border-2 border-chalkboard/20 px-6 py-3 font-display font-bold hover:border-crayon-blue transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
          >
            Browse Free Worksheets
          </Link>
        </div>
      </header>

      {/* Learn Every Letter A-Z */}
      <section className="mt-16" aria-labelledby="az-heading">
        <h2 id="az-heading" className="text-3xl font-bold">Learn Every Letter A–Z</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Tap any letter to open its full lesson: sound, example words, tracing, and worksheets.
        </p>
        <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {letters.map((l) => {
            const content = getLetterContent(l)!;
            const word = content.exampleWords[0]?.word ?? content.uppercase;
            const secondWord = content.exampleWords[1]?.word;
            const emoji = wordEmojis[word] || "📦";
            const wordsLabel = secondWord ? `${word} and ${secondWord}` : word;
            return (
              <li key={l}>
                <Link
                  href={`/alphabet/${l}`}
                  aria-label={`Learn Letter ${content.uppercase}: ${content.uppercase} is for ${wordsLabel}`}
                  className="group block h-full rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
                >
                  <span
                    className="letter-block bg-crayon-blue mx-auto flex aspect-square w-16 items-center justify-center text-2xl"
                    aria-hidden="true"
                  >
                    {content.uppercase}{content.lowercase}
                  </span>
                  <span className="mt-3 block text-2xl" role="img" aria-label={wordsLabel}>
                    {emoji}
                  </span>
                  <p className="mt-2 font-display font-bold text-sm">
                    {content.uppercase} is for {word}
                    {secondWord ? `, ${secondWord}` : ""}
                  </p>
                  <span className="mt-2 inline-block text-xs font-bold text-crayon-blue group-hover:underline">
                    Learn Letter {content.uppercase} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* What Kids Learn */}
      <section className="mt-16" aria-labelledby="learn-heading">
        <h2 id="learn-heading" className="text-3xl font-bold">What Kids Learn From the Alphabet</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {learnCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-block border border-chalkboard/10 p-5 shadow-block hover:shadow-blockHover hover:border-crayon-blue transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              <h3 className="font-display font-bold text-lg">{card.title}</h3>
              <p className="mt-2 text-sm text-chalkboard/70">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Uppercase and Lowercase */}
      <section className="mt-16 bg-crayon-blue/10 rounded-block p-8" aria-labelledby="case-heading">
        <h2 id="case-heading" className="text-3xl font-bold">Uppercase and Lowercase Letters</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Children learn to recognize both uppercase and lowercase forms of each letter and
          understand that they represent the same letter.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {["a", "b", "c", "d"].map((l) => {
            const content = getLetterContent(l)!;
            return (
              <span
                key={l}
                className="letter-block bg-paper flex aspect-square w-16 items-center justify-center text-xl"
              >
                {content.uppercase} {content.lowercase}
              </span>
            );
          })}
        </div>
        <p className="mt-6">
          <Link href="/worksheets/uppercase-letters" className="font-display font-bold text-crayon-blue hover:underline">
            Practice Uppercase &amp; Lowercase Letters →
          </Link>
          <span className="text-chalkboard/60 text-sm">
            {" "}(or focus on <Link href="/worksheets/lowercase-letters" className="underline">lowercase letters</Link>)
          </span>
        </p>
      </section>

      {/* Letter Sounds / Phonics */}
      <section className="mt-16" aria-labelledby="sounds-heading">
        <h2 id="sounds-heading" className="text-3xl font-bold">Learn Letter Sounds</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Every letter has at least one common sound, and connecting a letter to its sound is one
          of the biggest steps toward reading. Sounds aren't always one-to-one — some letters make
          more than one sound depending on the word — but starting with the most common sound
          gives a child a reliable foundation.
        </p>
        <ul className="mt-4 flex flex-wrap gap-4 text-chalkboard/80 font-display font-bold">
          <li>A → apple</li>
          <li>B → ball</li>
          <li>C → cat</li>
        </ul>
        <Link
          href="/phonics"
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore Phonics Activities
        </Link>
      </section>

      {/* Letter Tracing */}
      <section className="mt-16 bg-crayon-green/10 rounded-block p-8" aria-labelledby="tracing-heading">
        <h2 id="tracing-heading" className="text-3xl font-bold">Practice Letter Tracing</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Tracing helps a child practice the motor skills behind letter formation before writing
          independently. Guided dotted letters build muscle memory for the shape of each letter.
        </p>
        <ul className="mt-4 space-y-1">
          <li>
            <Link href="/worksheets/letter-tracing" className="font-display font-bold text-crayon-blue hover:underline">
              Letter Tracing Worksheets
            </Link>
          </li>
          <li>
            <Link href="/worksheets/alphabet-writing-practice" className="font-display font-bold text-crayon-blue hover:underline">
              Handwriting Worksheets
            </Link>
          </li>
          <li>
            <Link href="/alphabet/a/worksheet" className="font-display font-bold text-crayon-blue hover:underline">
              Try the online tracing tool on any letter's page
            </Link>
          </li>
        </ul>
        <Link
          href="/worksheets/letter-tracing"
          className="mt-6 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore Letter Tracing Worksheets
        </Link>
      </section>

      {/* Free Alphabet Worksheets */}
      <section className="mt-16" aria-labelledby="worksheets-heading">
        <h2 id="worksheets-heading" className="text-3xl font-bold">Free Alphabet Worksheets</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          AlphaBes provides printable practice for every stage of learning a letter, from first
          recognizing its shape to writing it independently. Preview any worksheet on screen, then
          print or download it as a PDF.
        </p>
        <ul className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {worksheetCategoryLinks.map((w) => (
            <li key={w.href}>
              <Link
                href={w.href}
                className="block rounded-block border border-chalkboard/10 p-4 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
              >
                <span className="font-display font-bold text-sm">{w.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/worksheets"
          className="mt-6 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Explore All Alphabet Worksheets
        </Link>
      </section>

      {/* Preschool */}
      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="preschool-heading">
        <h2 id="preschool-heading" className="text-3xl font-bold">Alphabet Learning for Preschool</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Preschool alphabet learning focuses on the basics: recognizing letter shapes, saying
          letter names out loud, and noticing the beginning sound of a word. Tracing, coloring,
          and matching letters to their pictures build fine motor skills and letter-sound
          association without formal lessons. Our guide on{" "}
          <Link href="/blog/how-to-teach-the-alphabet-to-preschoolers" className="font-bold underline">
            how to teach the alphabet to preschoolers
          </Link>{" "}
          has more low-pressure ideas.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/activities"
            className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Explore Preschool Alphabet Activities
          </Link>
          <Link href="/preschool" className="font-display font-bold text-crayon-blue hover:underline self-center">
            Visit the Preschool Learning Hub →
          </Link>
        </div>
      </section>

      {/* Kindergarten */}
      <section className="mt-16 bg-crayon-purple/10 rounded-block p-8" aria-labelledby="kindergarten-heading">
        <h2 id="kindergarten-heading" className="text-3xl font-bold">Alphabet Learning for Kindergarten</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          By kindergarten, most children are refining uppercase and lowercase recognition and
          moving into independent writing, phonics, and beginning sounds as they prepare for early
          reading. Word-picture matching and short worksheet sets help bridge letter knowledge
          into reading readiness. See our ideas for{" "}
          <Link href="/blog/alphabet-activities-for-kindergarten" className="font-bold underline">
            alphabet activities for kindergarten
          </Link>{" "}
          for hands-on ways to reinforce it.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/worksheets/alphabet-writing-practice"
            className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Explore Kindergarten Writing Worksheets
          </Link>
          <Link href="/kindergarten" className="font-display font-bold text-crayon-blue hover:underline self-center">
            Visit the Kindergarten Learning Hub →
          </Link>
        </div>
      </section>

      {/* Fun Alphabet Activities */}
      <section className="mt-16" aria-labelledby="activities-heading">
        <h2 id="activities-heading" className="text-3xl font-bold">Fun Alphabet Activities for Kids</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {activityLinks.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-block border border-chalkboard/10 p-5 text-center shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors font-display font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              {a.title}
            </Link>
          ))}
        </div>
        <Link
          href="/games"
          className="mt-6 inline-block rounded-block bg-crayon-blue text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
        >
          Play All Alphabet Games
        </Link>
      </section>

      {/* How to Help Your Child Learn */}
      <section className="mt-16" aria-labelledby="howto-heading">
        <h2 id="howto-heading" className="text-3xl font-bold">How to Help Your Child Learn the Alphabet</h2>
        <ol className="mt-6 space-y-4 list-decimal list-inside text-chalkboard/80">
          <li>Practice a few letters at a time rather than the whole alphabet at once.</li>
          <li>Say the letter name and its sound together, out loud, every time.</li>
          <li>Use pictures and familiar words to make each letter memorable.</li>
          <li>
            Practice uppercase and lowercase forms together using{" "}
            <Link href="/worksheets/uppercase-letters" className="font-bold underline">
              uppercase &amp; lowercase worksheets
            </Link>
            .
          </li>
          <li>
            Use{" "}
            <Link href="/worksheets/letter-tracing" className="font-bold underline">
              letter tracing worksheets
            </Link>{" "}
            regularly to build handwriting muscle memory.
          </li>
          <li>
            Mix in{" "}
            <Link href="/games" className="font-bold underline">
              alphabet games
            </Link>{" "}
            and songs so practice doesn't feel like a chore.
          </li>
          <li>
            Review previously learned letters often — see{" "}
            <Link href="/blog" className="font-bold underline">
              our blog
            </Link>{" "}
            for more ideas.
          </li>
        </ol>
      </section>

      {/* Popular Alphabet Resources */}
      <section className="mt-16" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="text-3xl font-bold">Popular Alphabet Resources</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {popularResources.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors"
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Frequently Asked Questions About Learning the Alphabet
        </h2>
        <dl className="mt-6 space-y-6">
          {faqItems.map((item) => (
            <div key={item.question}>
              <dt className="font-display font-bold text-lg">{item.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Final CTA */}
      <section className="mt-16 bg-chalkboard text-paper rounded-block p-10 text-center">
        <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
        <p className="mt-2 text-paper/70 max-w-xl mx-auto">
          Pick a letter and start the first lesson, or browse the full worksheet library.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/alphabet/a"
            className="rounded-block bg-crayon-yellow text-chalkboard font-display font-bold px-6 py-3 shadow-block hover:shadow-blockHover transition-shadow"
          >
            Start with Letter A
          </Link>
          <Link
            href="/worksheets"
            className="rounded-block border-2 border-paper/40 px-6 py-3 font-display font-bold hover:border-paper transition-colors"
          >
            Browse Worksheets
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
