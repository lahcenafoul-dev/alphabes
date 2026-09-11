import Link from "next/link";
import type { Metadata } from "next";
import { kindergartenTopics } from "@/lib/kindergarten-data";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const BASE_URL = "https://alphabes.com";

const title = "Kindergarten Learning Activities: Sight Words, Writing & Phonics";
const description =
  "Age-appropriate kindergarten learning activities from AlphaBes: sight words, independent handwriting, and phonics, with links to every relevant resource on the site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/kindergarten` },
  openGraph: { title, description, url: `${BASE_URL}/kindergarten` },
};

const faqItems = [
  {
    question: "What age is \"kindergarten\" for learning purposes?",
    answer:
      "On AlphaBes, kindergarten generally means roughly ages 5 to 6, when a child is moving from letter recognition into phonics, independent writing, and early reading.",
  },
  {
    question: "Should a kindergartner already know all the letter sounds?",
    answer:
      "Many do, but it varies. Kindergarten is often when letter sounds get reinforced and connected into blending and CVC words, so a child doesn't need to have every sound mastered on day one.",
  },
  {
    question: "What's the difference between this Kindergarten Hub and the Alphabet and Phonics hubs?",
    answer:
      "The Alphabet and Phonics hubs cover those subjects in full, for every age. This Kindergarten Hub pulls together only the parts appropriate for kindergarten-aged children, plus kindergarten-specific topics like sight words and independent handwriting.",
  },
  {
    question: "How many sight words should a kindergartner know?",
    answer:
      "This varies by curriculum and child, but many kindergarten programs introduce a small, growing list of common words over the school year rather than expecting a fixed number all at once.",
  },
  {
    question: "Are AlphaBes kindergarten resources free?",
    answer:
      "Yes. The activities and worksheets linked from this page are part of the free AlphaBes library, with more available through the Pro plan.",
  },
];

export default function KindergartenPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Kindergarten", url: `${BASE_URL}/kindergarten` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/kindergarten`,
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Kindergarten Learning Activities",
    description,
    url: `${BASE_URL}/kindergarten`,
    educationalLevel: "Kindergarten",
    learningResourceType: "Lesson",
    teaches: "Sight words, independent handwriting, and phonics for kindergarten-aged children",
    typicalAgeRange: "5-6",
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
          <li aria-current="page" className="font-bold">Kindergarten</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Kindergarten Learning Activities
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          Kindergarten builds on letter recognition with sight words, independent writing, and
          phonics skills that lead toward early reading. This hub gathers the AlphaBes resources
          best suited to that stage.
        </p>
      </header>

      <section className="mt-16" aria-labelledby="ready-heading">
        <h2 id="ready-heading" className="text-3xl font-bold">What Kindergartners Are Ready For</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Most kindergartners are refining uppercase and lowercase recognition, learning to write
          letters independently instead of only tracing, and combining letter sounds into simple
          CVC words. A small, growing list of sight words rounds out the early-reading toolkit.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-3xl font-bold">Kindergarten Learning Topics</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {kindergartenTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/kindergarten/${topic.slug}`}
              className="rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              <h3 className="font-display font-bold text-xl">{topic.title}</h3>
              <p className="mt-2 text-sm text-chalkboard/70">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-crayon-purple/10 rounded-block p-8" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-3xl font-bold">More Kindergarten Resources</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          For the full letter-by-letter lessons and phonics skills, visit the hubs those subjects
          live in.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li>
            <Link href="/alphabet#kindergarten-heading" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Alphabet Learning for Kindergarten
            </Link>
          </li>
          <li>
            <Link href="/phonics#kindergarten-heading" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Phonics for Kindergarten
            </Link>
          </li>
          <li>
            <Link href="/worksheets/cvc-words" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              CVC Word Worksheets
            </Link>
          </li>
          <li>
            <Link href="/worksheets/alphabet-writing-practice" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Writing Practice Worksheets
            </Link>
          </li>
          <li>
            <Link href="/games" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Alphabet Games
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Frequently Asked Questions About Kindergarten Learning
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
