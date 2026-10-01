import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import BundlesEn, { bundlesMetadataEn } from "./bundles-en";
import BundlesFr, { bundlesMetadataFr } from "./bundles-fr";
import BundlesEs, { bundlesMetadataEs } from "./bundles-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: bundlesMetadataEn, fr: bundlesMetadataFr, es: bundlesMetadataEs }[locale];
}

export default async function BundlesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: BundlesEn, fr: BundlesFr, es: BundlesEs }[locale];
  return <Page />;
}
