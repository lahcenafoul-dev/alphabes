import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import FlashcardsEn, { flashcardsMetadataEn } from "./flashcards-en";
import FlashcardsFr, { flashcardsMetadataFr } from "./flashcards-fr";

// /fr/imagier: a French picture word book, with its own words.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? flashcardsMetadataFr : flashcardsMetadataEn;
}

export default async function FlashcardsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <FlashcardsFr /> : <FlashcardsEn />;
}
