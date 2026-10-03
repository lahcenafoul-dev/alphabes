import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import GamesEn, { gamesMetadataEn } from "./games-en";
import GamesFr, { gamesMetadataFr } from "./games-fr";
import GamesEs, { gamesMetadataEs } from "./games-es";
import GamesPt, { gamesMetadataPt } from "./games-pt";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: gamesMetadataEn, fr: gamesMetadataFr, es: gamesMetadataEs, pt: gamesMetadataPt });
}

export default async function GamesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Games = byLocale(locale, { en: GamesEn, fr: GamesFr, es: GamesEs, pt: GamesPt });
  return <Games />;
}
