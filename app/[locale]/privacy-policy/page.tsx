import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PrivacyPolicyEn, { privacyPolicyMetadataEn } from "./privacy-policy-en";
import PrivacyPolicyFr, { privacyPolicyMetadataFr } from "./privacy-policy-fr";
import PrivacyPolicyEs, { privacyPolicyMetadataEs } from "./privacy-policy-es";
import PrivacyPolicyPt, { privacyPolicyMetadataPt } from "./privacy-policy-pt";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: privacyPolicyMetadataEn, fr: privacyPolicyMetadataFr, es: privacyPolicyMetadataEs, pt: privacyPolicyMetadataPt });
}

export default async function PrivacyPolicyPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: PrivacyPolicyEn, fr: PrivacyPolicyFr, es: PrivacyPolicyEs, pt: PrivacyPolicyPt });
  return <Page />;
}

export const generateMetadata = withSocialMetadata(pageMetadata);
