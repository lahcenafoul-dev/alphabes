import type { Metadata } from "next";
import SchoolHubFr, { schoolHubMetadataFr } from "@/components/ecole/SchoolHubFr";
import SchoolHubEs, { schoolHubMetadataEs } from "@/components/escuela/SchoolHubEs";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import KindergartenEn, { kindergartenMetadataEn } from "./kindergarten-en";

// /fr/grande-section and /es/kinder: their own hubs (lib/ecole-fr.ts,
// lib/escuela-es.ts), not translations.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: kindergartenMetadataEn, fr: schoolHubMetadataFr("grande-section"), es: schoolHubMetadataEs("kinder") }[locale];
}

export default async function KindergartenPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  if (locale === "fr") return <SchoolHubFr level="grande-section" />;
  if (locale === "es") return <SchoolHubEs level="kinder" />;
  return <KindergartenEn />;
}
