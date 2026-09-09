import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { games, getGame } from "@/lib/games-data";
import FindTheLetterGame from "@/components/games/FindTheLetterGame";
import MatchLetterPictureGame from "@/components/games/MatchLetterPictureGame";
import BeginningSoundGame from "@/components/games/BeginningSoundGame";
import LetterTracingGame from "@/components/games/LetterTracingGame";
import AlphabetQuizGame from "@/components/games/AlphabetQuizGame";
import ClientOnly from "@/components/games/ClientOnly";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

type Props = { params: { slug: string } };

const BASE_URL = "https://alphabes.com";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const game = getGame(params.slug);
  if (!game) return {};
  return {
    title: game.title,
    description: game.description,
    alternates: { canonical: `${BASE_URL}/games/${game.slug}` },
  };
}

export default function GamePage({ params }: Props) {
  const game = getGame(params.slug);
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

      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <ClientOnly fallback={<p className="text-chalkboard/50">Loading game…</p>}>
          <GameBody slug={game.slug} />
        </ClientOnly>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}

function GameBody({ slug }: { slug: string }) {
  switch (slug) {
    case "find-the-letter":
      return <FindTheLetterGame />;
    case "match-letter-picture":
      return <MatchLetterPictureGame />;
    case "beginning-sound":
      return <BeginningSoundGame />;
    case "letter-tracing":
      return <LetterTracingGame />;
    case "alphabet-quiz":
      return <AlphabetQuizGame />;
    default:
      return notFound();
  }
}
