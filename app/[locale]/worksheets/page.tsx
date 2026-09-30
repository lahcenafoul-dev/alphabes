import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import WorksheetsEn, { worksheetsMetadataEn } from "./worksheets-en";
import WorksheetsFr, { worksheetsMetadataFr } from "./worksheets-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? worksheetsMetadataFr : worksheetsMetadataEn;
}

export default async function WorksheetsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <WorksheetsFr /> : <WorksheetsEn />;
}
