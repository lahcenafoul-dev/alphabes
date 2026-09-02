import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { phonicsSkills, getPhonicsSkill } from "@/lib/phonics-data";

type Props = { params: { skill: string } };

export function generateStaticParams() {
  return phonicsSkills.map((s) => ({ skill: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const skill = getPhonicsSkill(params.skill);
  if (!skill) return {};
  return {
    title: skill.title,
    description: skill.summary,
    alternates: { canonical: `https://alphabes.com/phonics/${skill.slug}` },
  };
}

export default function PhonicsSkillPage({ params }: Props) {
  const skill = getPhonicsSkill(params.skill);
  if (!skill) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://alphabes.com" },
      { "@type": "ListItem", position: 2, name: "Phonics", item: "https://alphabes.com/phonics" },
      { "@type": "ListItem", position: 3, name: skill.title, item: `https://alphabes.com/phonics/${skill.slug}` },
    ],
  };

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/phonics">Phonics</Link> /</li>
          <li aria-current="page" className="font-bold">{skill.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{skill.title}</h1>
      <p className="mt-3 text-chalkboard/70">{skill.description}</p>

      <section className="mt-8 rounded-block bg-crayon-blue/10 p-6">
        <h2 className="font-display font-bold text-lg">Examples</h2>
        <ul className="mt-3 space-y-2 text-chalkboard/80">
          {skill.examples.map((ex) => (
            <li key={ex}>• {ex}</li>
          ))}
        </ul>
      </section>

      <Link
        href="/worksheets/phonics"
        className="mt-8 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Practice with a Worksheet
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
