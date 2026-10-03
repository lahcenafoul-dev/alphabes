import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { CEDILHA_SLUG, portugueseLetters } from "@/lib/letters-pt";

const title = "Cartões do alfabeto: palavras com figuras para ouvir";
const description =
  "Cartões grátis para aprender o alfabeto: para cada letra, de A a Z, e para o Ç, palavras com figuras que a criança pode ouvir em português.";

export const flashcardsMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/flashcards"),
  openGraph: { title, description, url: absoluteUrl("pt", "/flashcards") },
};

const cardColors = ["bg-crayon-yellow/30", "bg-crayon-blue/15", "bg-crayon-green/20", "bg-crayon-red/15", "bg-crayon-purple/15"];

export default function FlashcardsPt() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Os cartões do alfabeto</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Uma palavra, uma figura, uma letra. Toque num cartão para ouvir a palavra e procurem juntos
        a sílaba com que ela começa. Há pelo menos duas palavras para cada uma das 26 letras e para o
        Ç.
      </p>

      <nav aria-label="Ir para uma letra" className="mt-6 flex flex-wrap gap-1.5">
        {portugueseLetters.map((l) => (
          <a
            key={l.slug}
            href={`#letra-${l.slug}`}
            className="flex h-9 min-w-9 items-center justify-center rounded-block border border-chalkboard/15 px-2 font-display font-bold hover:border-crayon-blue"
          >
            {l.upper}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-10">
        {portugueseLetters.map((l, i) => (
          <section key={l.slug} id={`letra-${l.slug}`} aria-labelledby={`titulo-${l.slug}`} className="scroll-mt-6">
            <div className="flex items-center gap-3">
              <span className="letter-block bg-crayon-blue h-12 w-12 text-2xl" aria-hidden="true">
                {l.upper}
              </span>
              <h2 id={`titulo-${l.slug}`} className="text-2xl font-bold">
                {l.upper} {l.lower}
              </h2>
              <Link
                href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
                className="ml-auto text-sm font-display font-bold text-crayon-blue hover:underline"
              >
                A lição →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...l.words, ...(l.wordsInside ?? [])].map((w) => (
                <li key={w.word}>
                  <ListenButton
                    locale="pt"
                    text={w.withArticle}
                    ariaLabel={`${w.withArticle}, com ${l.slug === CEDILHA_SLUG ? "o Ç" : `a letra ${l.upper}`}. Ouvir.`}
                    className={`flex w-full flex-col items-center gap-1 rounded-block ${cardColors[i % cardColors.length]} p-4 shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue`}
                  >
                    <span className="text-5xl" aria-hidden="true">{w.emoji}</span>
                    <span className="mt-1 font-display text-xl font-bold">{w.word}</span>
                    <span className="text-sm text-chalkboard/70">{w.withArticle}</span>
                    <span className="mt-1 text-xs font-bold text-crayon-blue" aria-hidden="true">🔊 Ouvir</span>
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
