import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AlphaBes",
  description: "AlphaBes teaches children ages 3-8 letters, phonics, and early reading skills.",
  alternates: { canonical: "https://alphabes.com/about" },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">About AlphaBes</h1>
      <div className="mt-6 space-y-4 text-chalkboard/80 leading-relaxed">
        <p>
          AlphaBes was built to make the earliest stage of reading — letters and their sounds —
          approachable for children ages 3 to 8, and for the parents and teachers guiding them.
        </p>
        <p>
          Every lesson pairs a letter with its sound, real example words, and hands-on activities
          like tracing and beginning-sound practice, so a child works with the same letter in
          several different ways before moving on.
        </p>
        <p>
          The site is designed to work well on phones and tablets, since that's often where young
          children practice, and to keep the interface simple enough that a child can navigate
          much of it independently once a parent has helped them get started.
        </p>
      </div>
    </main>
  );
}
