import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import FlashcardsEn, { flashcardsMetadataEn } from "./flashcards-en";
import FlashcardsFr, { flashcardsMetadataFr } from "./flashcards-fr";
import FlashcardsEs, { flashcardsMetadataEs } from "./flashcards-es";

// /fr/imagier and /es/tarjetas: picture word books with their own words.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: flashcardsMetadataEn, fr: flashcardsMetadataFr, es: flashcardsMetadataEs }[locale];
}

export default async function FlashcardsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: FlashcardsEn, fr: FlashcardsFr, es: FlashcardsEs }[locale];
  return <Page />;
}
