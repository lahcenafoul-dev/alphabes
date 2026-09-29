import type { Metadata } from "next";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import CookiesEn, { cookiesMetadataEn } from "./cookies-en";
import CookiesFr, { cookiesMetadataFr } from "./cookies-fr";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? cookiesMetadataFr : cookiesMetadataEn;
}

export default async function CookiesPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  return locale === "fr" ? <CookiesFr /> : <CookiesEn />;
}
