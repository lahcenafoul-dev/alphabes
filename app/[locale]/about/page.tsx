import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AboutEn, { aboutMetadataEn } from "./about-en";
import AboutFr, { aboutMetadataFr } from "./about-fr";
import AboutEs, { aboutMetadataEs } from "./about-es";
import AboutPt, { aboutMetadataPt } from "./about-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: aboutMetadataEn, fr: aboutMetadataFr, es: aboutMetadataEs, pt: aboutMetadataPt });
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: AboutEn, fr: AboutFr, es: AboutEs, pt: AboutPt });
  return <Page />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
