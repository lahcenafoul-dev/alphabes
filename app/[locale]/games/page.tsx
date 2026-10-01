import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import GamesEn, { gamesMetadataEn } from "./games-en";
import GamesFr, { gamesMetadataFr } from "./games-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? gamesMetadataFr : gamesMetadataEn;
}

export default async function GamesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <GamesFr /> : <GamesEn />;
}
