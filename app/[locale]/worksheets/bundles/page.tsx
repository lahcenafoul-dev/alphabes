import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import BundlesEn, { bundlesMetadataEn } from "./bundles-en";
import BundlesFr, { bundlesMetadataFr } from "./bundles-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? bundlesMetadataFr : bundlesMetadataEn;
}

export default async function BundlesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <BundlesFr /> : <BundlesEn />;
}
