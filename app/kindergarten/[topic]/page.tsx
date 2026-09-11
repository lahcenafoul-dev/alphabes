import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { kindergartenTopics, getKindergartenTopic } from "@/lib/kindergarten-data";
import { buildBreadcrumbJsonLd, buildLearningResourceJsonLd } from "@/lib/json-ld";

const BASE_URL = "https://alphabes.com";

type Props = { params: { topic: string } };

export function generateStaticParams() {
  return kindergartenTopics.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const topic = getKindergartenTopic(params.topic);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.summary,
    alternates: { canonical: `${BASE_URL}/kindergarten/${topic.slug}` },
  };
}

export default function KindergartenTopicPage({ params }: Props) {
  const topic = getKindergartenTopic(params.topic);
  if (!topic) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Kindergarten", url: `${BASE_URL}/kindergarten` },
    { name: topic.title, url: `${BASE_URL}/kindergarten/${topic.slug}` },
  ]);

  const learningResourceJsonLd = buildLearningResourceJsonLd({
    title: topic.title,
    description: topic.description,
    url: `${BASE_URL}/kindergarten/${topic.slug}`,
    skills: [topic.title],
    ageLevelLabel: "Kindergarten",
  });

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/kindergarten">Kindergarten</Link> /</li>
          <li aria-current="page" className="font-bold">{topic.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{topic.title}</h1>
      <p className="mt-3 text-chalkboard/70">{topic.description}</p>

      <section className="mt-8 rounded-block bg-crayon-purple/10 p-6">
        <h2 className="font-display font-bold text-lg">Tips</h2>
        <ul className="mt-3 space-y-2 text-chalkboard/80">
          {topic.tips.map((tip) => (
            <li key={tip}>• {tip}</li>
          ))}
        </ul>
      </section>

      <Link
        href={topic.relatedHref}
        className="mt-8 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
      >
        {topic.relatedLabel}
      </Link>

      <p className="mt-6">
        <Link href="/kindergarten" className="font-bold underline">
          Back to the Kindergarten Learning Hub
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
