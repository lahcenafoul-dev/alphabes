import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { absoluteUrl } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import ClientMessages from "@/components/ClientMessages";
import RegisterForm from "./register-form";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Register" });
  return {
    title: t("title"),
    robots: { index: false },
    alternates: { canonical: absoluteUrl(locale, "/register") },
  };
}

export default async function RegisterPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Register" });
  const tc = await getTranslations({ locale, namespace: "Common" });

  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center">{t("heading")}</h1>
      <p className="mt-2 text-center text-chalkboard/70">{t("intro")}</p>
      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <Suspense fallback={<p className="text-center text-chalkboard/50">{tc("loading")}</p>}>
          <ClientMessages locale={locale} namespaces={["Register", "Errors"]}>
            <RegisterForm />
          </ClientMessages>
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-chalkboard/70">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-bold text-crayon-blue">
          {t("login")}
        </Link>
      </p>
    </main>
  );
}
