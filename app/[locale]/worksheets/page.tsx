import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import WorksheetsEn, { worksheetsMetadataEn } from "./worksheets-en";
import WorksheetsFr, { worksheetsMetadataFr } from "./worksheets-fr";
import WorksheetsEs, { worksheetsMetadataEs } from "./worksheets-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: worksheetsMetadataEn, fr: worksheetsMetadataFr, es: worksheetsMetadataEs });
}

export default async function WorksheetsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: WorksheetsEn, fr: WorksheetsFr, es: WorksheetsEs });
  return <Page />;
}
