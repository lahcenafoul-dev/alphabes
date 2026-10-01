import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PhonicsEn, { phonicsMetadataEn } from "./phonics-en";
import PhonicsFr, { phonicsMetadataFr } from "./phonics-fr";
import PhonicsEs, { phonicsMetadataEs } from "./phonics-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: phonicsMetadataEn, fr: phonicsMetadataFr, es: phonicsMetadataEs }[locale];
}

export default async function PhonicsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: PhonicsEn, fr: PhonicsFr, es: PhonicsEs }[locale];
  return <Page />;
}
