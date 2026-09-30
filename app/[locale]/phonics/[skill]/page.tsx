import type { Metadata } from "next";
import { frenchSounds } from "@/lib/sons-fr";
import { initLocale } from "@/lib/i18n/server";
import SkillEn, { englishSkillParams, skillMetadataEn } from "./skill-en";
import SoundFr, { soundMetadataFr } from "./sound-fr";

type Props = { params: Promise<{ locale: string; skill: string }> };

// Every valid page is listed in generateStaticParams, so unknown params go
// straight to the 404 page. (Calling notFound() inside the page instead leaves
// an empty error shell in the server HTML with this Next.js version.)
export const dynamicParams = false;

// French has its own sound pages (ou, on, la syllabe…), unrelated to the
// English phonics skills. Keep in sync with lib/i18n/known-params.ts.
export function generateStaticParams({ params }: { params: { locale: string } }) {
  const skills = params.locale === "fr" ? frenchSounds.map((s) => s.slug) : englishSkillParams();
  return skills.map((skill) => ({ skill }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale: param, skill } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? soundMetadataFr(skill) : skillMetadataEn(skill);
}

export default async function PhonicsSkillPage(props: Props) {
  const { locale: param, skill } = await props.params;
  const locale = initLocale(param);
  return locale === "fr" ? <SoundFr slug={skill} /> : <SkillEn slug={skill} />;
}
