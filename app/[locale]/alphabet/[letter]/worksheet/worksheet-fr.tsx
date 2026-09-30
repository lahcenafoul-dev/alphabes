import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import FicheActions from "@/components/FicheActions";
import TracingCanvas from "@/components/TracingCanvas";
import { cursiveFont } from "@/lib/fonts/cursive";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getFrenchLetter } from "@/lib/letters-fr";

export function worksheetMetadataFr(param: string): Metadata {
  const l = getFrenchLetter(param);
  if (!l) return {};
  const title = `Lettre ${l.upper} : fiche de tracé en script et en cursive`;
  const description = `Tracer la lettre ${l.upper} ${l.lower} à l'écran, au doigt ou à la souris, en script ou en cursive, écouter son son et télécharger une fiche PDF gratuite à imprimer.`;
  return {
    title,
    description,
    alternates: alternatesFor("fr", "/alphabet/[letter]/worksheet", { letter: l.slug }),
    openGraph: { title, description, url: absoluteUrl("fr", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  };
}

export default function WorksheetFr({ letter }: { letter: string }) {
  // The page only renders letters listed by frenchLetterParams().
  const l = getFrenchLetter(letter)!;
  const word = l.words[0];
  const pair = `${l.upper} ${l.lower}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Alphabet", url: absoluteUrl("fr", "/alphabet") },
    { name: `Lettre ${l.upper}`, url: absoluteUrl("fr", "/alphabet/[letter]", { letter: l.slug }) },
    { name: "Fiche de tracé", url: absoluteUrl("fr", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/alphabet">Alphabet</Link> /</li>
          <li>
            <Link href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}>Lettre {l.upper}</Link> /
          </li>
          <li aria-current="page" className="font-bold">Fiche</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">La lettre {pair} : fiche de tracé</h1>
      <p className="mt-2 text-chalkboard/70">
        Écoute la lettre, trace-la avec le doigt ou la souris, puis imprime la fiche pour t&apos;entraîner
        au crayon.
      </p>

      <div className="mt-10 grid gap-6 rounded-block border border-chalkboard/20 p-8 text-center sm:grid-cols-3 sm:items-center">
        <div>
          <div className="text-7xl font-extrabold text-crayon-blue/40 select-none">{pair}</div>
          <p className="mt-1 text-sm text-chalkboard/60">en script</p>
        </div>
        <div>
          <div className={`text-6xl leading-[6rem] text-crayon-blue/60 select-none ${cursiveFont.className}`}>{pair}</div>
          <p className="mt-1 text-sm text-chalkboard/60">en cursive</p>
        </div>
        <div>
          <div className="text-6xl" role="img" aria-label={word.word}>
            {word.emoji}
          </div>
          <p className="mt-2 text-2xl font-display font-bold">{word.word}</p>
        </div>
      </div>

      <section className="mt-8" aria-labelledby="trace-heading">
        <h2 id="trace-heading" className="text-xl font-bold">
          Je trace la lettre
        </h2>
        <p className="mt-1 text-sm text-chalkboard/60">
          Choisis l&apos;écriture, puis suis les pointillés avec le doigt ou la souris. En cursive, les
          lignes sont celles du cahier.
        </p>
        <TracingCanvas
          text={pair}
          cursive={{ text: pair, fontFamily: cursiveFont.style.fontFamily }}
          labels={{
            clear: "🔄 Effacer et recommencer",
            styleGroup: "Écriture",
            script: "Script",
            cursive: "Cursive",
            canvas: `Zone de tracé de la lettre ${l.upper}`,
          }}
        />
      </section>

      <FicheActions slug={l.slug} spoken={`${l.nameSpoken}. ${word.withArticle}.`} />
      <p className="mt-3 text-sm text-chalkboard/60">
        Toutes les fiches de la lettre {l.upper} (reconnaissance, coloriage, mots…) sont sur{" "}
        <Link
          href={{ pathname: "/worksheets/bundles/[bundleSlug]", params: { bundleSlug: `pack-lettre-${l.slug}` } }}
          className="font-bold underline"
        >
          la page de ses fiches
        </Link>
        .
      </p>

      <p className="mt-10">
        <Link
          href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
          className="font-display font-bold text-crayon-blue hover:underline"
        >
          ← Toute la leçon sur la lettre {l.upper}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
