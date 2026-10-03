import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import StoriesEn, { storiesMetadataEn } from "./stories-en";
import StoriesFr, { storiesMetadataFr } from "./stories-fr";
import StoriesEs, { storiesMetadataEs } from "./stories-es";
import StoriesPt, { storiesMetadataPt } from "./stories-pt";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale<Metadata>(locale, { en: storiesMetadataEn, fr: storiesMetadataFr, es: storiesMetadataEs, pt: storiesMetadataPt });
}

// Rendered per request so the build never needs the database and new
// stories show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function StoriesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Stories = byLocale(locale, { en: StoriesEn, fr: StoriesFr, es: StoriesEs, pt: StoriesPt });
  return <Stories />;
}
