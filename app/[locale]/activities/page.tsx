import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import ActivitiesEn, { activitiesMetadataEn } from "./activities-en";
import ActivitiesFr, { activitiesMetadataFr } from "./activities-fr";
import ActivitiesEs, { activitiesMetadataEs } from "./activities-es";
import ActivitiesPt, { activitiesMetadataPt } from "./activities-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: activitiesMetadataEn, fr: activitiesMetadataFr, es: activitiesMetadataEs, pt: activitiesMetadataPt });
}

export default async function ActivitiesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Activities = byLocale(locale, { en: ActivitiesEn, fr: ActivitiesFr, es: ActivitiesEs, pt: ActivitiesPt });
  return <Activities />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
