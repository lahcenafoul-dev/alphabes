import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LocaleDocument, { buildLocaleMetadata } from "@/components/LocaleDocument";
import NotFoundContent from "@/components/NotFoundContent";

// The 404 page for unknown URLs: the middleware rewrites them to Next's
// built-in /_not-found route, which renders this with a 404 status.
//
// It must stay static: Next renders this component as part of every page, so
// reading the request here (headers, cookies, the next-intl request locale)
// would make the whole site dynamic. That's why it is English only for now.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "NotFound" });
  return {
    ...(await buildLocaleMetadata("en")),
    title: `${t("title")} | AlphaBes`,
    robots: { index: false },
  };
}

export default function GlobalNotFound() {
  return (
    <LocaleDocument locale="en">
      <NotFoundContent locale="en" />
    </LocaleDocument>
  );
}
