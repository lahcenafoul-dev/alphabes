import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import ActivitiesEn, { activitiesMetadataEn } from "./activities-en";
import ActivitiesFr, { activitiesMetadataFr } from "./activities-fr";
import ActivitiesEs, { activitiesMetadataEs } from "./activities-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: activitiesMetadataEn, fr: activitiesMetadataFr, es: activitiesMetadataEs });
}

export default async function ActivitiesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Activities = byLocale(locale, { en: ActivitiesEn, fr: ActivitiesFr, es: ActivitiesEs });
  return <Activities />;
}
