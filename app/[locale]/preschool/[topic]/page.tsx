import type { Metadata } from "next";
import SchoolTopicFr, { schoolTopicMetadataFr } from "@/components/ecole/SchoolTopicFr";
import SchoolTopicEs, { schoolTopicMetadataEs } from "@/components/escuela/SchoolTopicEs";
import { topicsOf } from "@/lib/ecole-fr";
import { topicsOfEs } from "@/lib/escuela-es";
import { initLocale } from "@/lib/i18n/server";
import PreschoolTopicEn, { englishTopicParams, topicMetadataEn } from "./topic-en";

type Props = { params: Promise<{ locale: string; topic: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French and Spanish topics have their own slugs. Keep in sync with
// lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const topics =
    params.locale === "fr"
      ? topicsOf("maternelle").map((t) => t.slug)
      : params.locale === "es"
        ? topicsOfEs("preescolar").map((t) => t.slug)
        : englishTopicParams();
  return topics.map((topic) => ({ topic }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, topic } = await props.params;
  const locale = initLocale(param);
  if (locale === "fr") return schoolTopicMetadataFr("maternelle", topic);
  if (locale === "es") return schoolTopicMetadataEs("preescolar", topic);
  return topicMetadataEn(topic);
}

export default async function PreschoolTopicPage(props: Props) {
  const { locale: param, topic } = await props.params;
  const locale = initLocale(param);
  if (locale === "fr") return <SchoolTopicFr level="maternelle" slug={topic} />;
  if (locale === "es") return <SchoolTopicEs level="preescolar" slug={topic} />;
  return <PreschoolTopicEn slug={topic} />;
}
