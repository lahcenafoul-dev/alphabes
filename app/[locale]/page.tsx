import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { buildWebSiteJsonLd } from "@/lib/json-ld";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import HomeEn, { homeMetadataEn } from "./home-en";
import HomeFr, { homeMetadataFr } from "./home-fr";
import HomeEs, { homeMetadataEs } from "./home-es";
import HomePt, { homeMetadataPt } from "./home-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

// The French, Spanish and Portuguese home pages are written for their own
// families (sounds and syllables rather than CVC words), so each language has
// its own content.
// withSocialMetadata carries over the site-wide image from
// app/opengraph-image.tsx, which the page's own openGraph would replace.
async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: homeMetadataEn, fr: homeMetadataFr, es: homeMetadataEs, pt: homeMetadataPt });
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: HomeEn, fr: HomeFr, es: HomeEs, pt: HomePt });
  return (
    <>
      <Page />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebSiteJsonLd(locale)) }} />
    </>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
