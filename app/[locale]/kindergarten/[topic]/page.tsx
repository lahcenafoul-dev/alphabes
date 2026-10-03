import type { Metadata } from "next";
import SchoolTopicFr, { schoolTopicMetadataFr } from "@/components/ecole/SchoolTopicFr";
import SchoolTopicEs, { schoolTopicMetadataEs } from "@/components/escuela/SchoolTopicEs";
import SchoolTopicPt, { schoolTopicMetadataPt } from "@/components/escola/SchoolTopicPt";
import { topicsOf } from "@/lib/ecole-fr";
import { topicsOfEs } from "@/lib/escuela-es";
import { topicsOfPt } from "@/lib/escola-pt";
import { initLocale } from "@/lib/i18n/server";
import KindergartenTopicEn, { englishTopicParams, topicMetadataEn } from "./topic-en";

type Props = { params: Promise<{ locale: string; topic: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French, Spanish and Portuguese topics have their own slugs. Keep in sync with
// lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const topics =
    params.locale === "fr"
      ? topicsOf("grande-section").map((t) => t.slug)
      : params.locale === "es"
        ? topicsOfEs("kinder").map((t) => t.slug)
        : params.locale === "pt"
          ? topicsOfPt("primeiro-ano").map((t) => t.slug)
          : englishTopicParams();
  return topics.map((topic) => ({ topic }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, topic } = await props.params;
  const locale = initLocale(param);
  if (locale === "fr") return schoolTopicMetadataFr("grande-section", topic);
  if (locale === "es") return schoolTopicMetadataEs("kinder", topic);
  if (locale === "pt") return schoolTopicMetadataPt("primeiro-ano", topic);
  return topicMetadataEn(topic);
}

export default async function KindergartenTopicPage(props: Props) {
  const { locale: param, topic } = await props.params;
  const locale = initLocale(param);
  if (locale === "fr") return <SchoolTopicFr level="grande-section" slug={topic} />;
  if (locale === "es") return <SchoolTopicEs level="kinder" slug={topic} />;
  if (locale === "pt") return <SchoolTopicPt level="primeiro-ano" slug={topic} />;
  return <KindergartenTopicEn slug={topic} />;
}
