import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { phonicsSkills, getPhonicsSkill } from "@/lib/phonics-data";
import { buildBreadcrumbJsonLd, buildLearningResourceJsonLd } from "@/lib/json-ld";
import { alternatesFor } from "@/lib/i18n/routes";

export function englishSkillParams(): string[] {
  return phonicsSkills.map((s) => s.slug);
}

export function skillMetadataEn(slug: string): Metadata {
  const skill = getPhonicsSkill(slug);
  if (!skill) return {};
  return {
    title: skill.title,
    description: skill.summary,
    alternates: alternatesFor("en", "/phonics/[skill]", { skill: skill.slug }),
  };
}

export default function SkillEn({ slug }: { slug: string }) {
  const skill = getPhonicsSkill(slug);
  if (!skill) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://alphabes.com" },
    { name: "Phonics", url: "https://alphabes.com/phonics" },
    { name: skill.title, url: `https://alphabes.com/phonics/${skill.slug}` },
  ]);

  const learningResourceJsonLd = buildLearningResourceJsonLd({
    title: skill.title,
    description: skill.description,
    url: `https://alphabes.com/phonics/${skill.slug}`,
    skills: [skill.title],
    ageLevelLabel: "Preschool & Kindergarten",
  });

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

      <section className="mt-8">
        <h2 className="font-display font-bold text-lg">How to practice at home</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-chalkboard/80">
          {skill.practice.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8 rounded-block bg-crayon-yellow/15 p-6">
        <h2 className="font-display font-bold text-lg">Watch out for</h2>
        <p className="mt-2 text-chalkboard/80">{skill.watchOut}</p>
      </section>

      <Link
        href="/worksheets/phonics"
        className="mt-8 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Practice with a Worksheet
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
