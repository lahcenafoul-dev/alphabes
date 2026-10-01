import type { Metadata } from "next";
import Link from "next/link";
import { SCHOOL_HUBS, getSchoolTopic, topicsOf, type SchoolLevel } from "@/lib/ecole-fr";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { hrefOf } from "./SchoolHubFr";

// /fr/maternelle/[topic] and /fr/grande-section/[topic].

export function schoolTopicMetadataFr(level: SchoolLevel, slug: string): Metadata {
  const t = getSchoolTopic(level, slug);
  if (!t) return {};
  const { topicPathname } = SCHOOL_HUBS[level];
  return {
    title: t.metaTitle,
    description: t.summary,
    alternates: alternatesFor("fr", topicPathname, { topic: t.slug }),
    openGraph: { title: t.metaTitle, description: t.summary, url: absoluteUrl("fr", topicPathname, { topic: t.slug }) },
  };
}

export default function SchoolTopicFr({ level, slug }: { level: SchoolLevel; slug: string }) {
  const hub = SCHOOL_HUBS[level];
  // The page only renders topics listed in lib/ecole-fr.ts.
  const t = getSchoolTopic(level, slug)!;
  const url = absoluteUrl("fr", hub.topicPathname, { topic: t.slug });
  const others = topicsOf(level).filter((o) => o.slug !== t.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Accueil", url: absoluteUrl("fr", "/") },
    { name: hub.name, url: absoluteUrl("fr", hub.pathname) },
    { name: t.title, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: t.title,
    description: t.summary,
    url,
    inLanguage: "fr",
    educationalLevel: hub.name,
    learningResourceType: "Lesson",
    teaches: t.summary,
    isAccessibleForFree: true,
  };

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="Fil d'Ariane" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={localizedPath("fr", "/")}>Accueil</Link> /</li>
          <li><Link href={localizedPath("fr", hub.pathname)}>{hub.name}</Link> /</li>
          <li aria-current="page" className="font-bold">{t.title}</li>
        </ol>
      </nav>

      <h1 className="mt-4 text-4xl font-extrabold">
        <span aria-hidden="true">{t.emoji} </span>
        {t.title}
      </h1>
      {t.intro.map((p) => (
        <p key={p.slice(0, 20)} className="mt-4 text-lg text-chalkboard/80">
          {p}
        </p>
      ))}

      <section className="mt-8 rounded-block bg-crayon-yellow/15 p-6" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="font-display font-bold text-xl">
          Conseils
        </h2>
        <ul className="mt-3 space-y-2 list-disc list-inside text-chalkboard/80">
          {t.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="font-display font-bold text-xl">
          À faire à la maison : {t.activity.title}
        </h2>
        <p className="mt-2 text-sm text-chalkboard/70">
          <strong>Matériel :</strong> {t.activity.material}
        </p>
        <ol className="mt-3 space-y-2 list-decimal list-inside text-chalkboard/80">
          {t.activity.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8" aria-labelledby="links-heading">
        <h2 id="links-heading" className="font-display font-bold text-xl">
          Sur AlphaBes
        </h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {t.links.map((l) => (
            <li key={l.label}>
              <Link
                href={hrefOf(l)}
                className="inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-5 py-2.5 shadow-block hover:shadow-blockHover transition-shadow"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-chalkboard/70">
        À lire aussi :{" "}
        {others.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={localizedPath("fr", hub.topicPathname, { topic: o.slug })} className="font-bold underline">
              {o.title}
            </Link>
          </span>
        ))}
        {" · "}
        <Link href={localizedPath("fr", hub.pathname)} className="font-bold underline">
          {hub.name}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
