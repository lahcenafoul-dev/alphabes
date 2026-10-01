import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AlphabetEn, { alphabetMetadataEn } from "./alphabet-en";
import AlphabetFr, { alphabetMetadataFr } from "./alphabet-fr";
import AlphabetEs, { alphabetMetadataEs } from "./alphabet-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: alphabetMetadataEn, fr: alphabetMetadataFr, es: alphabetMetadataEs }[locale];
}

export default async function AlphabetPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: AlphabetEn, fr: AlphabetFr, es: AlphabetEs }[locale];
  return <Page />;
}
