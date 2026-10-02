import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import GamesEn, { gamesMetadataEn } from "./games-en";
import GamesFr, { gamesMetadataFr } from "./games-fr";
import GamesEs, { gamesMetadataEs } from "./games-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: gamesMetadataEn, fr: gamesMetadataFr, es: gamesMetadataEs }[locale];
}

export default async function GamesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Games = { en: GamesEn, fr: GamesFr, es: GamesEs }[locale];
  return <Games />;
}
