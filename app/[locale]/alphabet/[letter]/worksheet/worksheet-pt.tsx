import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ListenButton from "@/components/ListenButton";
import TracingCanvas from "@/components/TracingCanvas";
import { cursivaFont } from "@/lib/fonts/cursive-pt";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { CEDILHA_SLUG, getPortugueseLetter } from "@/lib/letters-pt";

export function worksheetMetadataPt(param: string): Metadata {
  const l = getPortugueseLetter(param);
  if (!l) return {};
  const name = l.slug === CEDILHA_SLUG ? "O Ç" : `Letra ${l.upper}`;
  const title = `${name}: atividade de traçado em letra bastão, de forma e cursiva`;
  const description = `Trace ${l.slug === CEDILHA_SLUG ? "o Ç" : `a letra ${l.upper} ${l.lower}`} na tela, com o dedo ou o mouse, em letra bastão, de forma ou cursiva nas linhas de caligrafia, e ouça o nome da letra.`;
  return {
    title,
    description,
    alternates: alternatesFor("pt", "/alphabet/[letter]/worksheet", { letter: l.slug }),
    openGraph: { title, description, url: absoluteUrl("pt", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  };
}

export default function WorksheetPt({ letter }: { letter: string }) {
  // The page only renders letters listed by portugueseLetterParams().
  const l = getPortugueseLetter(letter)!;
  const word = l.words[0];
  const pair = `${l.upper} ${l.lower}`;
  const short = l.slug === CEDILHA_SLUG ? "O Ç" : `Letra ${l.upper}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Alfabeto", url: absoluteUrl("pt", "/alphabet") },
    { name: short, url: absoluteUrl("pt", "/alphabet/[letter]", { letter: l.slug }) },
    { name: "Atividade de traçado", url: absoluteUrl("pt", "/alphabet/[letter]/worksheet", { letter: l.slug }) },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/alphabet">Alfabeto</Link> /</li>
          <li>
            <Link href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}>{short}</Link> /
          </li>
          <li aria-current="page" className="font-bold">Atividade</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">
        {l.slug === CEDILHA_SLUG ? "O" : "A letra"} {pair}: atividade de traçado
      </h1>
      <p className="mt-2 text-chalkboard/70">
        Ouça a letra e trace com o dedo ou com o mouse: em letra bastão, como na educação infantil,
        em letra de forma minúscula ou em letra cursiva.
      </p>

      <div className="mt-10 grid gap-6 rounded-block border border-chalkboard/20 p-8 text-center sm:grid-cols-4 sm:items-center">
        <div>
          <div className="text-7xl font-extrabold text-crayon-blue/40 select-none">{l.upper}</div>
          <p className="mt-1 text-sm text-chalkboard/60">letra bastão</p>
        </div>
        <div>
          <div className="text-7xl font-extrabold text-crayon-blue/40 select-none">{l.lower}</div>
          <p className="mt-1 text-sm text-chalkboard/60">letra de forma</p>
        </div>
        <div>
          <div className={`text-5xl leading-[6rem] text-crayon-blue/60 select-none ${cursivaFont.className}`}>{pair}</div>
          <p className="mt-1 text-sm text-chalkboard/60">letra cursiva</p>
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
          Eu traço a letra
        </h2>
        <p className="mt-1 text-sm text-chalkboard/60">
          Escolha o tipo de letra e siga os pontinhos com o dedo ou com o mouse. Na cursiva, as linhas
          são as do caderno de caligrafia.
        </p>
        <TracingCanvas
          prints={[
            { text: l.upper, label: "Bastão" },
            { text: l.lower, label: "Forma" },
          ]}
          cursive={{ text: pair, fontFamily: cursivaFont.style.fontFamily, ruling: "caligrafia" }}
          labels={{
            clear: "🔄 Apagar e começar de novo",
            styleGroup: "Tipo de letra",
            cursive: "Cursiva",
            canvas: `Espaço para traçar ${l.slug === CEDILHA_SLUG ? "o Ç" : `a letra ${l.upper}`}`,
          }}
        />
      </section>

      <div className="mt-6 flex flex-wrap gap-4">
        <ListenButton
          locale="pt"
          text={`${l.nameSpoken}. ${word.withArticle}.`}
          className="rounded-block bg-crayon-blue text-white px-6 py-3 font-bold"
        >
          🔊 Ouvir
        </ListenButton>
      </div>

      <p className="mt-10">
        <Link
          href={{ pathname: "/alphabet/[letter]", params: { letter: l.slug } }}
          className="font-display font-bold text-crayon-blue hover:underline"
        >
          ← Toda a lição {l.slug === CEDILHA_SLUG ? "do Ç" : `da letra ${l.upper}`}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
