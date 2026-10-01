import type { Metadata } from "next";
import { frenchGames } from "@/lib/games-fr";
import { initLocale } from "@/lib/i18n/server";
import GameEn, { englishGameParams, gameMetadataEn } from "./game-en";
import GameFr, { gameMetadataFr } from "./game-fr";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French games have French slugs (trouve-la-lettre). Keep in sync with
// lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs = params.locale === "fr" ? frenchGames.map((g) => g.slug) : englishGameParams();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? gameMetadataFr(slug) : gameMetadataEn(slug);
}

export default async function GamePage(props: Props) {
  const { locale: param, slug } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? <GameFr slug={slug} /> : <GameEn slug={slug} />;
}
