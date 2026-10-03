import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import FlashcardsEn, { flashcardsMetadataEn } from "./flashcards-en";
import FlashcardsFr, { flashcardsMetadataFr } from "./flashcards-fr";
import FlashcardsEs, { flashcardsMetadataEs } from "./flashcards-es";

// /fr/imagier and /es/tarjetas: picture word books with their own words.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: flashcardsMetadataEn, fr: flashcardsMetadataFr, es: flashcardsMetadataEs });
}

export default async function FlashcardsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: FlashcardsEn, fr: FlashcardsFr, es: FlashcardsEs });
  return <Page />;
}
