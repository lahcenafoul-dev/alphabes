import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { games, getGame } from "@/lib/games-data";
import FindTheLetterGame from "@/components/games/FindTheLetterGame";
import MatchLetterPictureGame from "@/components/games/MatchLetterPictureGame";
import ClientOnly from "@/components/games/ClientOnly";
import { gameAreaMinHeight } from "@/components/games/game-area";
import PremiumGameTeaser from "@/components/billing/PremiumGameTeaser";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { alternatesFor } from "@/lib/i18n/routes";

const BASE_URL = "https://alphabes.com";

export function englishGameParams(): string[] {
  return games.map((g) => g.slug);
}

export function gameMetadataEn(slug: string): Metadata {
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: game.title,
    description: game.description,
    alternates: alternatesFor("en", "/games/[slug]", { slug: game.slug }),
  };
}

export default function GameEn({ slug }: { slug: string }) {
  const game = getGame(slug);
  if (!game) notFound();

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: "Games", url: `${BASE_URL}/games` },
    { name: game.title, url: `${BASE_URL}/games/${game.slug}` },
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href="/">Home</Link> /</li>
          <li><Link href="/games">Games</Link> /</li>
          <li aria-current="page" className="font-bold">{game.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">{game.title}</h1>
      <p className="mt-2 text-chalkboard/70 max-w-2xl">{game.description}</p>

      {game.isPremium ? (
        <PremiumGameTeaser locale="en" slug={game.slug} />
      ) : (
        <div className={`mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block ${gameAreaMinHeight(game.slug)}`}>
          <ClientOnly fallback={<p className="text-chalkboard/50">Loading game…</p>}>
            <GameBody slug={game.slug} />
          </ClientOnly>
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

// The free games only; premium ones are played on the play page.
function GameBody({ slug }: { slug: string }) {
  switch (slug) {
    case "find-the-letter":
      return <FindTheLetterGame />;
    case "match-letter-picture":
      return <MatchLetterPictureGame />;
    default:
      return notFound();
  }
}
