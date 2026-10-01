import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { spanishLetters } from "@/lib/letters-es";

const title = "Tarjetas del abecedario: palabras con dibujos para escuchar";
const description =
  "Tarjetas gratis para aprender el abecedario: para cada letra, de la A a la Z con la Ñ, palabras con dibujos que el niño puede escuchar en español.";

export const flashcardsMetadataEs: Metadata = {
  title,
  description,
  alternates: alternatesFor("es", "/flashcards"),
  openGraph: { title, description, url: absoluteUrl("es", "/flashcards") },
};

const cardColors = ["bg-crayon-yellow/30", "bg-crayon-blue/15", "bg-crayon-green/20", "bg-crayon-red/15", "bg-crayon-purple/15"];

export default function FlashcardsEs() {
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-extrabold">Las tarjetas del abecedario</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Una palabra, un dibujo, una letra. Toca una tarjeta para escuchar la palabra y busquen juntos
        la sílaba con la que empieza. Hay por lo menos dos palabras para cada una de las 27 letras.
      </p>

      <nav aria-label="Ir a una letra" className="mt-6 flex flex-wrap gap-1.5">
        {spanishLetters.map((l) => (
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
        {spanishLetters.map((l, i) => (
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
                La lección →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...l.words, ...(l.wordsInside ?? [])].map((w) => (
                <li key={w.word}>
                  <ListenButton
                    locale="es"
                    text={w.withArticle}
                    ariaLabel={`${w.withArticle}, con la letra ${l.upper}. Escuchar.`}
                    className={`flex w-full flex-col items-center gap-1 rounded-block ${cardColors[i % cardColors.length]} p-4 shadow-block hover:shadow-blockHover transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue`}
                  >
                    <span className="text-5xl" aria-hidden="true">{w.emoji}</span>
                    <span className="mt-1 font-display text-xl font-bold">{w.word}</span>
                    <span className="text-sm text-chalkboard/70">{w.withArticle}</span>
                    <span className="mt-1 text-xs font-bold text-crayon-blue" aria-hidden="true">🔊 Escuchar</span>
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
