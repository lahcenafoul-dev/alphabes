import type { Metadata } from "next";
import { absoluteUrl, byLocale } from "@/lib/i18n/routes";
import JsonLd from "@/components/JsonLd";
import { buildAboutOrContactPageJsonLd, buildLocaleBreadcrumbJsonLd } from "@/lib/json-ld";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import AboutEn, { aboutMetadataEn } from "./about-en";
import AboutFr, { aboutMetadataFr } from "./about-fr";
import AboutEs, { aboutMetadataEs } from "./about-es";
import AboutPt, { aboutMetadataPt } from "./about-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

const metadataByLocale = { en: aboutMetadataEn, fr: aboutMetadataFr, es: aboutMetadataEs, pt: aboutMetadataPt };

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, metadataByLocale);
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: AboutEn, fr: AboutFr, es: AboutEs, pt: AboutPt });
  const { title, description } = byLocale(locale, metadataByLocale);
  const url = absoluteUrl(locale, "/about");
  const jsonLd = [
    buildLocaleBreadcrumbJsonLd(locale, [{ name: String(title), url }]),
    buildAboutOrContactPageJsonLd(locale, "AboutPage", { name: String(title), description: String(description), url }),
  ];
  return (
    <>
      <JsonLd data={jsonLd} />
      <Page />
    </>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
