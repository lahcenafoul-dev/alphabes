import type { Metadata } from "next";
import SchoolHubFr, { schoolHubMetadataFr } from "@/components/ecole/SchoolHubFr";
import SchoolHubEs, { schoolHubMetadataEs } from "@/components/escuela/SchoolHubEs";
import SchoolHubPt, { schoolHubMetadataPt } from "@/components/escola/SchoolHubPt";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import KindergartenEn, { kindergartenMetadataEn } from "./kindergarten-en";
import { withSocialMetadata } from "@/lib/social-metadata";

// /fr/grande-section and /es/kinder: their own hubs (lib/ecole-fr.ts,
// lib/escuela-es.ts), not translations.
async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: kindergartenMetadataEn, fr: schoolHubMetadataFr("grande-section"), es: schoolHubMetadataEs("kinder"), pt: schoolHubMetadataPt("primeiro-ano") });
}

export default async function KindergartenPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  if (locale === "fr") return <SchoolHubFr level="grande-section" />;
  if (locale === "es") return <SchoolHubEs level="kinder" />;
  if (locale === "pt") return <SchoolHubPt level="primeiro-ano" />;
  return <KindergartenEn />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
