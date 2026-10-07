import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PhonicsEn, { phonicsMetadataEn } from "./phonics-en";
import PhonicsFr, { phonicsMetadataFr } from "./phonics-fr";
import PhonicsEs, { phonicsMetadataEs } from "./phonics-es";
import PhonicsPt, { phonicsMetadataPt } from "./phonics-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: phonicsMetadataEn, fr: phonicsMetadataFr, es: phonicsMetadataEs, pt: phonicsMetadataPt });
}

export default async function PhonicsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: PhonicsEn, fr: PhonicsFr, es: PhonicsEs, pt: PhonicsPt });
  return <Page />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
