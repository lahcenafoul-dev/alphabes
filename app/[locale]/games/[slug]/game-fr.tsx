import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import ClientOnly from "@/components/games/ClientOnly";
import PremiumGameTeaser from "@/components/billing/PremiumGameTeaser";
import TrouveLaLettre from "@/components/games-fr/TrouveLaLettre";
import LettreEtImage from "@/components/games-fr/LettreEtImage";
import { frenchGames, getFrenchGame } from "@/lib/games-fr";
import { absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

export function gameMetadataFr(slug: string): Metadata {
  const g = getFrenchGame(slug);
  if (!g) return {};
  const title = g.isPremium
    ? `${g.title} : jeu éducatif pour apprendre les lettres`
    : `${g.title} : jeu éducatif gratuit pour apprendre les lettres`;
  return {
    title,
    description: g.description,
    alternates: alternatesFor("fr", "/games/[slug]", { slug: g.slug }),
    openGraph: { title, description: g.description, url: absoluteUrl("fr", "/games/[slug]", { slug: g.slug }) },
  };
}

// The free games only; premium ones are played on the play page.
function GameBody({ slug }: { slug: string }) {
  switch (slug) {
    case "trouve-la-lettre":
      return <TrouveLaLettre />;
    case "lettre-et-image":
      return <LettreEtImage />;
    default:
      return null;
  }
}

export default function GameFr({ slug }: { slug: string }) {
  // The page only renders games listed in lib/games-fr.ts.
  const g = getFrenchGame(slug)!;
  const url = absoluteUrl("fr", "/games/[slug]", { slug: g.slug });
  const others = frenchGames.filter((o) => o.slug !== g.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: "Jeux", url: absoluteUrl("fr", "/games") },
    { name: g.title, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: g.title,
    description: g.description,
    url,
    inLanguage: "fr",
    learningResourceType: "Game",
    educationalLevel: "Maternelle et CP",
    typicalAgeRange: g.age.replace(" ans", ""),
    isAccessibleForFree: !g.isPremium,
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/">Accueil</Link> /</li>
          <li><Link href="/games">Jeux</Link> /</li>
          <li aria-current="page" className="font-bold">{g.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">
        <span aria-hidden="true">{g.emoji} </span>
        {g.title}
      </h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{g.description}</p>

      {g.isPremium ? (
        <PremiumGameTeaser locale="fr" slug={g.slug} />
      ) : (
        <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
          <ClientOnly fallback={<p className="text-chalkboard/50">Chargement du jeu…</p>}>
            <GameBody slug={g.slug} />
          </ClientOnly>
        </div>
      )}

      <section className="mt-10 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="parents-heading">
        <h2 id="parents-heading" className="font-display font-bold text-lg">
          Pour les parents
        </h2>
        <p className="mt-2 text-chalkboard/80">{g.forParents}</p>
        <p className="mt-2 text-sm text-chalkboard/60">Âge conseillé : {g.age}.</p>
      </section>

      <section className="mt-10" aria-labelledby="others-heading">
        <h2 id="others-heading" className="font-display font-bold text-lg">
          D&apos;autres jeux
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
