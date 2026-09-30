import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PhonicsEn, { phonicsMetadataEn } from "./phonics-en";
import PhonicsFr, { phonicsMetadataFr } from "./phonics-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? phonicsMetadataFr : phonicsMetadataEn;
}

export default async function PhonicsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <PhonicsFr /> : <PhonicsEn />;
}
