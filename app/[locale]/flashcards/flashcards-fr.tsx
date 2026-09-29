import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { frenchLetters } from "@/lib/letters-fr";

const title = "Imagier de l'alphabet : des mots en images à écouter";
const description =
  "Un imagier gratuit pour apprendre l'alphabet : pour chaque lettre, de A à Z et avec les accents, des mots illustrés que l'enfant peut écouter en français.";

export const flashcardsMetadataFr: Metadata = {
  title,
  description,
  alternates: alternatesFor("fr", "/flashcards"),
  openGraph: { title, description, url: absoluteUrl("fr", "/flashcards") },
};

const cardColors = ["bg-crayon-yellow/30", "bg-crayon-blue/15", "bg-crayon-green/20", "bg-crayon-red/15", "bg-crayon-purple/15"];

export default function FlashcardsFr() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">L&apos;imagier de l&apos;alphabet</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Un mot, une image, une lettre. Touchez une carte pour entendre le mot, puis cherchez
        ensemble le son de la lettre au début du mot. Les mots vont par deux pour chaque lettre,
        accents compris.
      </p>

      <nav aria-label="Aller à une lettre" className="mt-6 flex flex-wrap gap-1.5">
        {frenchLetters.map((l) => (
          <a
            key={l.slug}
            href={`#lettre-${l.slug}`}
            className="flex h-9 min-w-9 items-center justify-center rounded-block border border-chalkboard/15 px-2 font-display font-bold hover:border-crayon-blue"
          >
            {l.upper}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-10">
        {frenchLetters.map((l, i) => (
          <section key={l.slug} id={`lettre-${l.slug}`} aria-labelledby={`titre-${l.slug}`} className="scroll-mt-6">
            <div className="flex items-center gap-3">
              <span className="letter-block bg-crayon-blue h-12 w-12 text-2xl" aria-hidden="true">
                {l.upper}
              </span>
              <h2 id={`titre-${l.slug}`} className="text-2xl font-bold">
                {l.upper} {l.lower}
              </h2>
              <Link
                href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                className="ml-auto text-sm font-display font-bold text-crayon-blue hover:underline"
              >
                La leçon →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {l.words.map((w) => (
                <li key={w.word}>
                  <ListenButton
                    text={w.withArticle}
                    ariaLabel={`${w.withArticle}, avec la lettre ${l.upper}. Écouter.`}
                    className={`flex w-full flex-col items-center gap-1 rounded-block ${cardColors[i % cardColors.length]} p-4 shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue`}
                  >
                    <span className="text-5xl" aria-hidden="true">{w.emoji}</span>
                    <span className="mt-1 font-display text-xl font-bold">{w.word}</span>
                    <span className="text-sm text-chalkboard/70">{w.withArticle}</span>
                    <span className="mt-1 text-xs font-bold text-crayon-blue" aria-hidden="true">🔊 Écouter</span>
                  </ListenButton>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
