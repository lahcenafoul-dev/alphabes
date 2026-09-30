import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import StoriesEn, { storiesMetadataEn } from "./stories-en";
import StoriesFr, { storiesMetadataFr } from "./stories-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? storiesMetadataFr : storiesMetadataEn;
}

// Rendered per request so the build never needs the database and new
// stories show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function StoriesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <StoriesFr /> : <StoriesEn />;
}
