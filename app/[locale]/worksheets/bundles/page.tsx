import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import BundlesEn, { bundlesMetadataEn } from "./bundles-en";
import BundlesFr, { bundlesMetadataFr } from "./bundles-fr";
import BundlesEs, { bundlesMetadataEs } from "./bundles-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: bundlesMetadataEn, fr: bundlesMetadataFr, es: bundlesMetadataEs });
}

export default async function BundlesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: BundlesEn, fr: BundlesFr, es: BundlesEs });
  return <Page />;
}
