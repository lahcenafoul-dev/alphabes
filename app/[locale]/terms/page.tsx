import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import TermsEn, { termsMetadataEn } from "./terms-en";
import TermsFr, { termsMetadataFr } from "./terms-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? termsMetadataFr : termsMetadataEn;
}

export default async function TermsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <TermsFr /> : <TermsEn />;
}
