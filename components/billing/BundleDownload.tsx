import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { bundleDownloadUrl } from "@/lib/billing/bundles";

// The whole-bundle download on a bundle page. The page stays static; the
// link's route decides on the server (Pro: the PDF; otherwise login or
// pricing). Each worksheet of the bundle stays free on its own page.
export default async function BundleDownload({ locale, slug }: { locale: Locale; slug: string }) {
  const t = await getTranslations({ locale, namespace: "Paywall" });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={bundleDownloadUrl(locale, slug)}
        rel="nofollow"
        className="rounded-block bg-crayon-purple text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        ⬇️ {t("download")}
      </a>
      <p className="text-sm text-chalkboard/70 max-w-md">
        <span className="mr-2 inline-block rounded-full bg-crayon-purple/20 px-3 py-0.5 text-xs font-bold text-crayon-purple">
          Pro
        </span>
        {t("bundle")}
      </p>
    </div>
  );
}
