import Link from "next/link";
import type { Metadata } from "next";
import { phonicsSkills } from "@/lib/phonics-data";

export const metadata: Metadata = {
  title: "Phonics",
  description: "Build reading skills step by step: letter sounds, beginning sounds, CVC words, and blending.",
  alternates: { canonical: "https://alphabes.com/phonics" },
};

export default function PhonicsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Phonics</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Four core skills take a child from letter sounds to reading full words.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {phonicsSkills.map((skill) => (
          <Link
            key={skill.slug}
            href={`/phonics/${skill.slug}`}
            className="rounded-block border border-chalkboard/10 p-6 shadow-block hover:shadow-blockHover transition"
          >
            <h2 className="font-display font-bold text-xl">{skill.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{skill.summary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
