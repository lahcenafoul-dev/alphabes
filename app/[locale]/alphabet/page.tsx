import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AlphabetEn, { alphabetMetadataEn } from "./alphabet-en";
import AlphabetFr, { alphabetMetadataFr } from "./alphabet-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? alphabetMetadataFr : alphabetMetadataEn;
}

export default async function AlphabetPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <AlphabetFr /> : <AlphabetEn />;
}
