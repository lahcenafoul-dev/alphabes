import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import WorksheetsEn, { worksheetsMetadataEn } from "./worksheets-en";
import WorksheetsFr, { worksheetsMetadataFr } from "./worksheets-fr";
import WorksheetsEs, { worksheetsMetadataEs } from "./worksheets-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: worksheetsMetadataEn, fr: worksheetsMetadataFr, es: worksheetsMetadataEs }[locale];
}

export default async function WorksheetsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: WorksheetsEn, fr: WorksheetsFr, es: WorksheetsEs }[locale];
  return <Page />;
}
