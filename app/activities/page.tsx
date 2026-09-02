import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities",
  description: "Hands-on alphabet and phonics activities for home or classroom use.",
  alternates: { canonical: "https://alphabes.com/activities" },
};

const activities = [
  { title: "Letter Recognition", description: "Find and circle a target letter across a page of mixed letters." },
  { title: "Tracing Practice", description: "Trace dotted uppercase and lowercase letters." },
  { title: "Beginning Sound Sort", description: "Sort picture cards by their beginning sound." },
  { title: "Coloring by Letter", description: "Color a scene where each section is labeled with a letter." },
];

export default function ActivitiesPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Activities</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Simple, screen-optional activities that pair with any letter lesson.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 gap-5">
        {activities.map((a) => (
          <div key={a.title} className="rounded-block border border-chalkboard/10 p-6 shadow-block">
            <h2 className="font-display font-bold text-lg">{a.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{a.description}</p>
          </div>
        ))}
      </div>
      <Link
        href="/worksheets"
        className="mt-8 inline-block rounded-block bg-crayon-green text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition"
      >
        Get Printable Versions
      </Link>
    </main>
  );
}
