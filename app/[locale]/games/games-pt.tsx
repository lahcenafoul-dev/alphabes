import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { portugueseGames } from "@/lib/jogos-pt";

const title = "Jogos educativos para aprender o alfabeto e as sílabas";
const description =
  "Seis jogos grátis em português para a educação infantil e o 1º ano: encontrar letras, ligar a letra à figura, a sílaba inicial, traçar letras em cursiva, o quiz do alfabeto e bater palmas para as sílabas.";

export const gamesMetadataPt: Metadata = {
  title,
  description,
  alternates: alternatesFor("pt", "/games"),
  openGraph: { title, description, url: absoluteUrl("pt", "/games") },
};

const tips = [
  "Nas primeiras vezes, joguem juntos: leiam a instrução com a criança e mostrem onde tocar.",
  "De cinco a dez minutos bastam. É melhor um jogo curto todo dia do que uma sessão longa.",
  "Errar não tem problema: o jogo diz o nome do que foi tocado, e assim também se aprende.",
  "O som usa a voz em português do aparelho: aumente o volume e, se não ouvir nada, siga as dicas que aparecem para instalar uma voz.",
];

export default function GamesPt() {
  const url = absoluteUrl("pt", "/games");
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Jogos", url },
  ]);
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Jogos educativos AlphaBes",
    itemListElement: portugueseGames.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: absoluteUrl("pt", "/games/[slug]", { slug: g.slug }),
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li aria-current="page" className="font-bold">Jogos</li>
        </ol>
      </nav>

      <h1 className="mt-6 text-4xl font-extrabold">Jogos para aprender as letras e as sílabas</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">
        Seis jogos curtos em português, para jogar em qualquer tela, inclusive no celular: reconhecer as letras,
        ouvir as sílabas e praticar a escrita. As instruções podem ser ouvidas: não é preciso saber ler para jogar.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {portugueseGames.map((g) => (
          <div key={g.slug} className="flex flex-col rounded-block border border-chalkboard/10 p-6 shadow-block">
            <p className="text-4xl" aria-hidden="true">
              {g.emoji}
            </p>
            <h2 className="mt-3 font-display font-bold text-lg">{g.title}</h2>
            <p className="mt-2 text-sm text-chalkboard/70">{g.description}</p>
            <div className="mt-auto pt-4 flex items-center justify-between gap-2">
              <span className="flex flex-wrap gap-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${g.isPremium ? "bg-crayon-purple/20 text-crayon-purple" : "bg-crayon-green/20 text-crayon-green"}`}
                >
                  {g.isPremium ? "Pro" : "Grátis"}
                </span>
                <span className="inline-block rounded-full bg-crayon-yellow/25 px-3 py-1 text-xs font-bold">{g.age}</span>
              </span>
              <Link
                href={{ pathname: "/games/[slug]", params: { slug: g.slug } }}
                className="shrink-0 rounded-block bg-chalkboard text-paper font-display font-bold px-4 py-2 text-sm shadow-block hover:shadow-blockHover transition"
              >
                ▶ Jogar
              </Link>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="text-3xl font-bold">
          Dicas para a família
        </h2>
        <ul className="mt-6 space-y-3 list-disc list-inside text-chalkboard/80 max-w-3xl">
          {tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-6 text-chalkboard/80 max-w-3xl">
          Para continuar, revejam cada letra no{" "}
          <Link href="/alphabet" className="font-bold underline">
            alfabeto
          </Link>
          , ouçam{" "}
          <Link href="/phonics" className="font-bold underline">
            as sílabas
          </Link>{" "}
          ou imprimam uma{" "}
          <Link href="/worksheets" className="font-bold underline">
            atividade
          </Link>
          .
        </p>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </main>
  );
}
