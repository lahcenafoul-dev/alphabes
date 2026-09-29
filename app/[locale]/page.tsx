import type { Metadata, ResolvingMetadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import HomeEn, { homeMetadataEn } from "./home-en";
import HomeFr, { homeMetadataFr } from "./home-fr";

// The French home page is written for French-speaking families (sounds and
// syllables rather than CVC words), so each language has its own content.
export async function generateMetadata(
  { params }: { params: LocaleParams },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const metadata = locale === "fr" ? homeMetadataFr : homeMetadataEn;
  // Setting openGraph here replaces the inherited one, so carry over the
  // site-wide image from app/opengraph-image.tsx.
  const images = (await parent).openGraph?.images;
  return { ...metadata, openGraph: { ...metadata.openGraph, images } };
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <HomeFr /> : <HomeEn />;
}
