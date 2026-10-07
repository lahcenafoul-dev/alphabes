import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ClientOnly from "@/components/games/ClientOnly";
import { gameAreaMinHeight } from "@/components/games/game-area";
import PremiumGameTeaser from "@/components/billing/PremiumGameTeaser";
import EncontreALetra from "@/components/jogos-pt/EncontreALetra";
import LetraEFigura from "@/components/jogos-pt/LetraEFigura";
import BataPalmas from "@/components/jogos-pt/BataPalmas";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { getPortugueseGame, portugueseGames } from "@/lib/jogos-pt";

export function gameMetadataPt(slug: string): Metadata {
  const g = getPortugueseGame(slug);
  if (!g) return {};
  const title = g.isPremium
    ? `${g.title}: jogo educativo para aprender a ler`
    : `${g.title}: jogo educativo grátis para aprender a ler`;
  return {
    title,
    description: g.description,
    alternates: alternatesFor("pt", "/games/[slug]", { slug: g.slug }),
    openGraph: { title, description: g.description, url: absoluteUrl("pt", "/games/[slug]", { slug: g.slug }) },
  };
}

// The free games only; premium ones are played on the play page.
function GameBody({ slug }: { slug: string }) {
  switch (slug) {
    case "encontre-a-letra":
      return <EncontreALetra />;
    case "letra-e-figura":
      return <LetraEFigura />;
    case "bata-palmas":
      return <BataPalmas />;
    default:
      return null;
  }
}

export default function GamePt({ slug }: { slug: string }) {
  // The page only renders games listed in lib/jogos-pt.ts.
  const g = getPortugueseGame(slug)!;
  const url = absoluteUrl("pt", "/games/[slug]", { slug: g.slug });
  const others = portugueseGames.filter((o) => o.slug !== g.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Início", url: absoluteUrl("pt", "/") },
    { name: "Jogos", url: absoluteUrl("pt", "/games") },
    { name: g.title, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: g.title,
    description: g.description,
    url,
    inLanguage: "pt-BR",
    learningResourceType: "Game",
    educationalLevel: "Educação infantil e 1º ano",
    typicalAgeRange: g.age.replace(" anos", "").replace(" a ", "-"),
    isAccessibleForFree: !g.isPremium,
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <nav aria-label="Caminho de navegação" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Início</Link> /</li>
          <li><Link href="/games">Jogos</Link> /</li>
          <li aria-current="page" className="font-bold">{g.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">
        <span aria-hidden="true">{g.emoji} </span>
        {g.title}
      </h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{g.description}</p>

      {g.isPremium ? (
        <PremiumGameTeaser locale="pt" slug={g.slug} />
      ) : (
        <div className={`mt-8 rounded-block border border-chalkboard/10 p-4 sm:p-6 shadow-block ${gameAreaMinHeight(g.slug)}`}>
          <ClientOnly fallback={<p className="text-chalkboard/50">Carregando o jogo…</p>}>
            <GameBody slug={g.slug} />
          </ClientOnly>
        </div>
      )}

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="parents-heading">
        <h2 id="parents-heading" className="font-display font-bold text-lg">
          Para a família
        </h2>
        <p className="mt-2 text-chalkboard/80">{g.forParents}</p>
        <p className="mt-2 text-sm text-chalkboard/60">Idade recomendada: de {g.age}.</p>
      </section>

      <section className="mt-10" aria-labelledby="others-heading">
        <h2 id="others-heading" className="font-display font-bold text-lg">
          Mais jogos
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={{ pathname: "/games/[slug]", params: { slug: o.slug } }}
                className="inline-block rounded-block border border-chalkboard/15 px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors"
              >
                <span aria-hidden="true">{o.emoji} </span>
                {o.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
