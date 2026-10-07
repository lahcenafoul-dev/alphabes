import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import TermsEn, { termsMetadataEn } from "./terms-en";
import TermsFr, { termsMetadataFr } from "./terms-fr";
import TermsEs, { termsMetadataEs } from "./terms-es";
import TermsPt, { termsMetadataPt } from "./terms-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: termsMetadataEn, fr: termsMetadataFr, es: termsMetadataEs, pt: termsMetadataPt });
}

export default async function TermsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: TermsEn, fr: TermsFr, es: TermsEs, pt: TermsPt });
  return <Page />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
