import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import LocaleDocument, { buildLocaleMetadata } from "@/components/LocaleDocument";
import NotFoundContent from "@/components/NotFoundContent";
import { LOCALE_HEADER, isLocale } from "@/lib/i18n/routes";

// The 404 page for unknown URLs, unknown params on prerendered routes, and
// French pages that don't exist yet, served with a 404 status. Unlike
// app/not-found.tsx, Next only renders this for the 404 route (it isn't part
// of every page), so it can read the request to pick the language without
// making other pages dynamic. Enabled by experimental.globalNotFound.
async function requestLocale() {
  const h = await headers();
  // Set by our middleware on 404 rewrites, or by next-intl on every page request.
  const value = h.get(LOCALE_HEADER) ?? h.get("x-next-intl-locale");
  return isLocale(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale();
  const t = await getTranslations({ locale, namespace: "NotFound" });
  return {
    ...(await buildLocaleMetadata(locale)),
    title: `${t("title")} | AlphaBes`,
    robots: { index: false },
  };
}

export default async function GlobalNotFound() {
  const locale = await requestLocale();
  return (
    <LocaleDocument locale={locale}>
      <NotFoundContent locale={locale} />
    </LocaleDocument>
  );
}
