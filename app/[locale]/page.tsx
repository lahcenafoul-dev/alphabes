import type { Metadata, ResolvingMetadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import HomeEn, { homeMetadataEn } from "./home-en";
import HomeFr, { homeMetadataFr } from "./home-fr";
import HomeEs, { homeMetadataEs } from "./home-es";
import HomePt, { homeMetadataPt } from "./home-pt";

// The French, Spanish and Portuguese home pages are written for their own
// families (sounds and syllables rather than CVC words), so each language has
// its own content.
export async function generateMetadata(
  { params }: { params: LocaleParams },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const metadata = byLocale(locale, { en: homeMetadataEn, fr: homeMetadataFr, es: homeMetadataEs, pt: homeMetadataPt });
  // Setting openGraph here replaces the inherited one, so carry over the
  // site-wide image from app/opengraph-image.tsx.
  const images = (await parent).openGraph?.images;
  return { ...metadata, openGraph: { ...metadata.openGraph, images } };
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: HomeEn, fr: HomeFr, es: HomeEs, pt: HomePt });
  return <Page />;
}
