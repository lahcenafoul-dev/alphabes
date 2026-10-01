import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import TracingCanvas from "@/components/TracingCanvas";
import { cursivaFont } from "@/lib/fonts/cursive-es";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getSpanishLetter } from "@/lib/letters-es";

export function worksheetMetadataEs(param: string): Metadata {
  const l = getSpanishLetter(param);
  if (!l) return {};
  const title = `Letra ${l.upper}: ficha de trazo en letra script y cursiva`;
  const description = `Traza la letra ${l.upper} ${l.lower} en la pantalla, con el dedo o el ratón, en letra script o cursiva sobre doble raya, y escucha su nombre y sus sílabas.`;
  return {
    title,
    description,
    alternates: alternatesFor("es", "/alphabet/[letter]/worksheet", { letter: l.slug }),
    openGraph: { title, description, url: absoluteUrl("es", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  };
}

export default function WorksheetEs({ letter }: { letter: string }) {
  // The page only renders letters listed by spanishLetterParams().
  const l = getSpanishLetter(letter)!;
  const word = l.words[0];
  const pair = `${l.upper} ${l.lower}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: "Abecedario", url: absoluteUrl("es", "/alphabet") },
    { name: `Letra ${l.upper}`, url: absoluteUrl("es", "/alphabet/[letter]", { letter: l.slug }) },
    { name: "Ficha de trazo", url: absoluteUrl("es", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Inicio</Link> /</li>
          <li><Link href="/alphabet">Abecedario</Link> /</li>
          <li>
            <Link href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}>Letra {l.upper}</Link> /
          </li>
          <li aria-current="page" className="font-bold">Ficha</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">La letra {pair}: ficha de trazo</h1>
      <p className="mt-2 text-chalkboard/70">
        Escucha la letra y trázala con el dedo o con el ratón, en letra script o en cursiva.
      </p>

      <div className="mt-10 grid gap-6 rounded-block border border-chalkboard/20 p-8 text-center sm:grid-cols-3 sm:items-center">
        <div>
          <div className="text-7xl font-extrabold text-crayon-blue/40 select-none">{pair}</div>
          <p className="mt-1 text-sm text-chalkboard/60">en letra script</p>
        </div>
        <div>
          <div className={`text-6xl leading-[6rem] text-crayon-blue/60 select-none ${cursivaFont.className}`}>{pair}</div>
          <p className="mt-1 text-sm text-chalkboard/60">en cursiva</p>
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
          Trazo la letra
        </h2>
        <p className="mt-1 text-sm text-chalkboard/60">
          Elige el tipo de letra y sigue los puntos con el dedo o con el ratón. En cursiva, las líneas
          son las de la doble raya del cuaderno.
        </p>
        <TracingCanvas
          text={pair}
          cursive={{ text: pair, fontFamily: cursivaFont.style.fontFamily, ruling: "doble-raya" }}
          labels={{
            clear: "🔄 Borrar y volver a empezar",
            styleGroup: "Tipo de letra",
            script: "Script",
            cursive: "Cursiva",
            canvas: `Espacio para trazar la letra ${l.upper}`,
          }}
        />
      </section>

      <div className="mt-6 flex flex-wrap gap-4">
        <ListenButton
          locale="es"
          text={`${l.nameSpoken}. ${word.withArticle}.`}
          className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold"
        >
          🔊 Escuchar
        </ListenButton>
      </div>

      <p className="mt-10">
        <Link
          href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
          className="font-display font-bold text-crayon-blue hover:underline"
        >
          ← Toda la lección de la letra {l.upper}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
