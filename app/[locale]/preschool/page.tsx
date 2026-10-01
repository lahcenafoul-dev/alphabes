import type { Metadata } from "next";
import SchoolHubFr, { schoolHubMetadataFr } from "@/components/ecole/SchoolHubFr";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PreschoolEn, { preschoolMetadataEn } from "./preschool-en";

// /fr/maternelle: its own French hub (lib/ecole-fr.ts), not a translation.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? schoolHubMetadataFr("maternelle") : preschoolMetadataEn;
}

export default async function PreschoolPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <SchoolHubFr level="maternelle" /> : <PreschoolEn />;
}
