import type { Metadata } from "next";
import SchoolHubFr, { schoolHubMetadataFr } from "@/components/ecole/SchoolHubFr";
import SchoolHubEs, { schoolHubMetadataEs } from "@/components/escuela/SchoolHubEs";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PreschoolEn, { preschoolMetadataEn } from "./preschool-en";

// /fr/maternelle and /es/preescolar: their own hubs (lib/ecole-fr.ts,
// lib/escuela-es.ts), not translations.
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: preschoolMetadataEn, fr: schoolHubMetadataFr("maternelle"), es: schoolHubMetadataEs("preescolar") });
}

export default async function PreschoolPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  if (locale === "fr") return <SchoolHubFr level="maternelle" />;
  if (locale === "es") return <SchoolHubEs level="preescolar" />;
  return <PreschoolEn />;
}
