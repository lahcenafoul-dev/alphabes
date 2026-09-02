import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Games",
  description: "Five simple educational games for practicing letters and sounds: Find the Letter, Match Letter and Picture, Beginning Sound, Letter Tracing, and Alphabet Quiz.",
  alternates: { canonical: "https://alphabes.com/games" },
};

const games = [
  { slug: "find-the-letter", title: "Find the Letter", description: "Spot the target letter among a grid of letters as fast as you can.", isPremium: false },
  { slug: "match-letter-picture", title: "Match Letter and Picture", description: "Match each letter to the picture that starts with its sound.", isPremium: false },
  { slug: "beginning-sound", title: "Beginning Sound", description: "Listen to a word and choose the letter that matches its first sound.", isPremium: true },
  { slug: "letter-tracing", title: "Letter Tracing", description: "Trace uppercase and lowercase letters on screen with your finger or mouse.", isPremium: true },
  { slug: "alphabet-quiz", title: "Alphabet Quiz", description: "A quick multiple-choice quiz covering letter names and sounds.", isPremium: true },
];

export default function GamesPage() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Fun Learning Games</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Five games that work on desktop and mobile, built to reinforce letter recognition and phonics.
      </p>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {games.map((g) => (
          <div key={g.slug} className="rounded-block border border-chalkboard/10 p-6 shadow-block">
            <h2 className="font-display font-bold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{g.description}</p>
            <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${g.isPremium ? "bg-crayon-purple/20 text-crayon-purple" : "bg-crayon-green/20 text-crayon-green"}`}>
              {g.isPremium ? "Pro" : "Free"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-chalkboard/50">
        Interactive gameplay is coming soon — each game above will become a playable activity in this space.
      </p>
    </main>
  );
}
