import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AboutEn, { aboutMetadataEn } from "./about-en";
import AboutFr, { aboutMetadataFr } from "./about-fr";
import AboutEs, { aboutMetadataEs } from "./about-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: aboutMetadataEn, fr: aboutMetadataFr, es: aboutMetadataEs }[locale];
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: AboutEn, fr: AboutFr, es: AboutEs }[locale];
  return <Page />;
}
