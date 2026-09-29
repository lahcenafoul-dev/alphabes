import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AboutEn, { aboutMetadataEn } from "./about-en";
import AboutFr, { aboutMetadataFr } from "./about-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? aboutMetadataFr : aboutMetadataEn;
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <AboutFr /> : <AboutEn />;
}
