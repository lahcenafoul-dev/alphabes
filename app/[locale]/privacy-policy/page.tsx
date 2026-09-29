import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import PrivacyPolicyEn, { privacyPolicyMetadataEn } from "./privacy-policy-en";
import PrivacyPolicyFr, { privacyPolicyMetadataFr } from "./privacy-policy-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? privacyPolicyMetadataFr : privacyPolicyMetadataEn;
}

export default async function PrivacyPolicyPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <PrivacyPolicyFr /> : <PrivacyPolicyEn />;
}
