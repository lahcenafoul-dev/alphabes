import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import TermsEn, { termsMetadataEn } from "./terms-en";
import TermsFr, { termsMetadataFr } from "./terms-fr";
import TermsEs, { termsMetadataEs } from "./terms-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: termsMetadataEn, fr: termsMetadataFr, es: termsMetadataEs }[locale];
}

export default async function TermsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: TermsEn, fr: TermsFr, es: TermsEs }[locale];
  return <Page />;
}
