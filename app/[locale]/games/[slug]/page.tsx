import type { Metadata } from "next";
import { frenchGames } from "@/lib/games-fr";
import { spanishGames } from "@/lib/juegos-es";
import { portugueseGames } from "@/lib/jogos-pt";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale } from "@/lib/i18n/server";
import GameEn, { englishGameParams, gameMetadataEn } from "./game-en";
import GameFr, { gameMetadataFr } from "./game-fr";
import GameEs, { gameMetadataEs } from "./game-es";
import GamePt, { gameMetadataPt } from "./game-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French, Spanish and Portuguese games have their own slugs
// (trouve-la-lettre, encuentra-la-letra, encontre-a-letra). Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs =
    params.locale === "fr"
      ? frenchGames.map((g) => g.slug)
      : params.locale === "es"
        ? spanishGames.map((g) => g.slug)
        : params.locale === "pt"
          ? portugueseGames.map((g) => g.slug)
          : englishGameParams();
  return slugs.map((slug) => ({ slug }));
}

async function pageMetadata(props: Props): Promise<Metadata> {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  return byLocale(locale, { en: gameMetadataEn, fr: gameMetadataFr, es: gameMetadataEs, pt: gameMetadataPt })(slug);
}

export default async function GamePage(props: Props) {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  const Game = byLocale(locale, { en: GameEn, fr: GameFr, es: GameEs, pt: GamePt });
  return <Game slug={slug} />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
