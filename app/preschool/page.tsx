import Link from "next/link";
import type { Metadata } from "next";
import { preschoolTopics } from "@/lib/preschool-data";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const BASE_URL = "https://alphabes.com";

const title = "Preschool Learning Activities: Alphabet, Tracing & Phonics";
const description =
  "Age-appropriate preschool learning activities from AlphaBes: letter recognition, tracing, coloring, and beginning sounds, with links to every relevant resource on the site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${BASE_URL}/preschool` },
  openGraph: { title, description, url: `${BASE_URL}/preschool` },
};

const faqItems = [
  {
    question: "What age is \"preschool\" for learning purposes?",
    answer:
      "On AlphaBes, preschool generally means roughly ages 3 to 4, when a child is starting to notice letters and sounds but isn't expected to read or write independently yet.",
  },
  {
    question: "Do preschoolers need to know all their letters before starting phonics?",
    answer:
      "No. Letter recognition and early phonics, like noticing a beginning sound, can develop side by side. A preschooler doesn't need to know the whole alphabet before hearing that \"ball\" starts with a b sound.",
  },
  {
    question: "Is it okay if a preschooler colors outside the lines or traces messily?",
    answer:
      "Yes. At this age the value is in the hand-muscle practice and repetition, not a tidy result. Precision tends to improve on its own with more practice.",
  },
  {
    question: "What's the difference between this Preschool Hub and the Alphabet and Phonics hubs?",
    answer:
      "The Alphabet and Phonics hubs cover those subjects in full, for every age. This Preschool Hub pulls together only the parts of each that are appropriate for preschool-aged children, plus preschool-specific guidance on things like tracing readiness and coloring.",
  },
  {
    question: "Are AlphaBes preschool resources free?",
    answer:
      "Yes. The activities and worksheets linked from this page are part of the free AlphaBes library, with more available through the Pro plan.",
  },
];

export default function PreschoolPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Preschool", url: `${BASE_URL}/preschool` },
  ]);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${BASE_URL}/preschool`,
  };

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Preschool Learning Activities",
    description,
    url: `${BASE_URL}/preschool`,
    educationalLevel: "Preschool",
    learningResourceType: "Lesson",
    teaches: "Letter recognition, tracing readiness, coloring, and beginning sounds for preschool-aged children",
    typicalAgeRange: "3-4",
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
          <li aria-current="page" className="font-bold">Preschool</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Preschool Learning Activities
        </h1>
        <p className="mt-4 text-lg text-chalkboard/70">
          At preschool age, learning stays hands-on and low-pressure: recognizing letters,
          practicing early sounds, and building the fine motor skills that later support writing.
          This hub gathers the AlphaBes resources best suited to that stage.
        </p>
      </header>

      <section className="mt-16" aria-labelledby="ready-heading">
        <h2 id="ready-heading" className="text-3xl font-bold">What Preschoolers Are Ready For</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          Most preschoolers are building letter recognition, learning to say a few letter sounds,
          and developing the pencil control needed for tracing, well before they're expected to
          read or write on their own. Short, playful sessions work better than long lessons at
          this age.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-3xl font-bold">Preschool Learning Topics</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-5">
          {preschoolTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/preschool/${topic.slug}`}
              className="rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              <h3 className="font-display font-bold text-xl">{topic.title}</h3>
              <p className="mt-2 text-sm text-chalkboard/70">{topic.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-3xl font-bold">More Preschool Resources</h2>
        <p className="mt-2 text-chalkboard/70 max-w-2xl">
          For the full letter-by-letter lessons and phonics skills, visit the hubs those subjects
          live in.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li>
            <Link href="/alphabet#preschool-heading" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Alphabet Learning for Preschool
            </Link>
          </li>
          <li>
            <Link href="/phonics#preschool-heading" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Phonics for Preschool
            </Link>
          </li>
          <li>
            <Link href="/worksheets/letter-recognition" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Letter Recognition Worksheets
            </Link>
          </li>
          <li>
            <Link href="/games" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Alphabet Games
            </Link>
          </li>
          <li>
            <Link href="/activities" className="rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors">
              Hands-On Activities
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Frequently Asked Questions About Preschool Learning
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
