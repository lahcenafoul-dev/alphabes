import type { Metadata } from "next";
import { byLocale } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import RefundsEn, { refundsMetadataEn } from "./refunds-en";
import RefundsFr, { refundsMetadataFr } from "./refunds-fr";
import RefundsEs, { refundsMetadataEs } from "./refunds-es";
import RefundsPt, { refundsMetadataPt } from "./refunds-pt";

// Refund policy (docs/paypal-plan.md, B5): cancel any time, Pro until the end
// of the paid period; full refund within 14 days of a subscription's first
// payment (monthly or yearly) and of each yearly renewal; monthly renewals not
// refunded (owner's final decision, 2026-10-05).
export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  return byLocale(locale, { en: refundsMetadataEn, fr: refundsMetadataFr, es: refundsMetadataEs, pt: refundsMetadataPt });
}

export default async function RefundsPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const Page = byLocale(locale, { en: RefundsEn, fr: RefundsFr, es: RefundsEs, pt: RefundsPt });
  return <Page />;
}
