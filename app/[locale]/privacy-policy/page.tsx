import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PrivacyPolicyEn, { privacyPolicyMetadataEn } from "./privacy-policy-en";
import PrivacyPolicyFr, { privacyPolicyMetadataFr } from "./privacy-policy-fr";
import PrivacyPolicyEs, { privacyPolicyMetadataEs } from "./privacy-policy-es";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return { en: privacyPolicyMetadataEn, fr: privacyPolicyMetadataFr, es: privacyPolicyMetadataEs }[locale];
}

export default async function PrivacyPolicyPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = { en: PrivacyPolicyEn, fr: PrivacyPolicyFr, es: PrivacyPolicyEs }[locale];
  return <Page />;
}
