import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { getMessages, getTranslations } from "next-intl/server";
import "@/app/globals.css";
import CookieConsent from "@/components/CookieConsent";
import Footer from "@/components/Footer";
import IntlClientProvider from "@/components/IntlClientProvider";
import SiteHeader from "@/components/SiteHeader";
import { TIME_ZONE } from "@/i18n/request";
import type { Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/i18n/routes";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

// Message namespaces used by site-wide client components. Forms get theirs
// from a nested <ClientMessages> on their own page.
const CLIENT_NAMESPACES = ["Common", "Header", "LanguageSwitcher", "CookieConsent"] as const;

// Where each language's families live (organization JSON-LD).
const AREA_SERVED: Record<Exclude<Locale, "en">, string[]> = {
  fr: ["FR", "MA", "BE", "CH", "CA"],
  es: ["MX", "US", "CO", "AR", "PE", "CL", "VE", "EC", "GT", "ES"],
  pt: ["BR", "PT", "AO", "MZ"],
};

// <html lang> and JSON-LD inLanguage. Portuguese is Brazilian
// (docs/portuguese-plan.md, P1), so phones and screen readers use a Brazilian
// voice; its hreflang stays "pt".
const HTML_LANG: Record<Locale, string> = { en: "en", fr: "fr", es: "es", pt: "pt-BR" };

/** Site-wide default metadata for a language (pages override what they need). */
export async function buildLocaleMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const homeUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle"),
      template: "%s | AlphaBes",
    },
    description: t("description"),
    openGraph: {
      type: "website",
      siteName: "AlphaBes",
      url: homeUrl,
      title: t("defaultTitle"),
      description: t("ogDescription"),
      ...(locale === "fr" && { locale: "fr_FR" }),
      ...(locale === "es" && { locale: "es_LA" }),
      ...(locale === "pt" && { locale: "pt_BR" }),
    },
    twitter: {
      card: "summary_large_image",
      title: "AlphaBes",
      description: t("twitterDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
    // French pages always set their own canonical; this English default is
    // kept as it was before the French version existed.
    ...(locale === "en" && { alternates: { canonical: SITE_URL } }),
  };
}

/**
 * The whole page document: <html lang>, fonts, organization JSON-LD, skip
 * link, header, footer and cookie banner. Used by the [locale] layout and by
 * the root not-found page (which lives outside [locale]).
 */
export default async function LocaleDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const tc = await getTranslations({ locale, namespace: "Common" });
  const messages = await getMessages({ locale });
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));

  const orgJsonLd =
    locale === "en"
      ? {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "AlphaBes",
          url: SITE_URL,
          description: t("orgDescription"),
          areaServed: ["US", "CA", "GB"],
        }
      : {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "AlphaBes",
          url: `${SITE_URL}/${locale}`,
          description: t("orgDescription"),
          inLanguage: HTML_LANG[locale],
          areaServed: AREA_SERVED[locale],
        };

  return (
    <html lang={HTML_LANG[locale]} className={`${baloo.variable} ${nunito.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-crayon-yellow focus:px-4 focus:py-2 focus:rounded-block"
        >
          {tc("skipToContent")}
        </a>
        <IntlClientProvider locale={locale} messages={clientMessages} timeZone={TIME_ZONE}>
          <SiteHeader locale={locale} />
          {children}
          <Footer locale={locale} />
          <CookieConsent />
        </IntlClientProvider>
      </body>
    </html>
  );
}
