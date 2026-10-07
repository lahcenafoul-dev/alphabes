import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { alternatesFor } from "@/lib/i18n/routes";
import { initLocale, type LocaleParams } from "@/lib/i18n/server";
import ClientMessages from "@/components/ClientMessages";
import ContactForm from "./contact-form";
import { withSocialMetadata } from "@/lib/social-metadata";

async function pageMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: { params: LocaleParams }) {
  const locale = initLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <main id="main-content" className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-extrabold text-center">{t("heading")}</h1>
      <p className="mt-2 text-center text-chalkboard/70">{t("intro")}</p>
      <div className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block">
        <ClientMessages locale={locale} namespaces={["Contact", "Errors"]}>
          <ContactForm />
        </ClientMessages>
      </div>
    </main>
  );
}

export const generateMetadata = withSocialMetadata(pageMetadata);
