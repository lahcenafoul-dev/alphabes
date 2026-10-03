import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PhonicsEn, { phonicsMetadataEn } from "./phonics-en";
import PhonicsFr, { phonicsMetadataFr } from "./phonics-fr";
import PhonicsEs, { phonicsMetadataEs } from "./phonics-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: phonicsMetadataEn, fr: phonicsMetadataFr, es: phonicsMetadataEs });
}

export default async function PhonicsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: PhonicsEn, fr: PhonicsFr, es: PhonicsEs });
  return <Page />;
}
