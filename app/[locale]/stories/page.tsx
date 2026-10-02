import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import StoriesEn, { storiesMetadataEn } from "./stories-en";
import StoriesFr, { storiesMetadataFr } from "./stories-fr";
import StoriesEs, { storiesMetadataEs } from "./stories-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: storiesMetadataEn, fr: storiesMetadataFr, es: storiesMetadataEs }[locale];
}

// Rendered per request so the build never needs the database and new
// stories show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function StoriesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Stories = { en: StoriesEn, fr: StoriesFr, es: StoriesEs }[locale];
  return <Stories />;
}
