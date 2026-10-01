import type { Metadata } from "next";
import SchoolHubFr, { schoolHubMetadataFr } from "@/components/ecole/SchoolHubFr";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import KindergartenEn, { kindergartenMetadataEn } from "./kindergarten-en";

// /fr/grande-section: its own French hub (lib/ecole-fr.ts), not a translation.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? schoolHubMetadataFr("grande-section") : kindergartenMetadataEn;
}

export default async function KindergartenPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <SchoolHubFr level="grande-section" /> : <KindergartenEn />;
}
