import type { Metadata } from "next";
import Link from "next/link";
import { SCHOOL_HUBS_ES, getSchoolTopicEs, topicsOfEs, type SchoolLevelEs } from "@/lib/escuela-es";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { hrefOf } from "./SchoolHubEs";

// /es/preescolar/[topic] and /es/kinder/[topic].

export function schoolTopicMetadataEs(level: SchoolLevelEs, slug: string): Metadata {
  const t = getSchoolTopicEs(level, slug);
  if (!t) return {};
  const { topicPathname } = SCHOOL_HUBS_ES[level];
  return {
    title: t.metaTitle,
    description: t.summary,
    alternates: alternatesFor("es", topicPathname, { topic: t.slug }),
    openGraph: { title: t.metaTitle, description: t.summary, url: absoluteUrl("es", topicPathname, { topic: t.slug }) },
  };
}

export default function SchoolTopicEs({ level, slug }: { level: SchoolLevelEs; slug: string }) {
  const hub = SCHOOL_HUBS_ES[level];
  // The page only renders topics listed in lib/escuela-es.ts.
  const t = getSchoolTopicEs(level, slug)!;
  const url = absoluteUrl("es", hub.topicPathname, { topic: t.slug });
  const others = topicsOfEs(level).filter((o) => o.slug !== t.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: hub.name, url: absoluteUrl("es", hub.pathname) },
    { name: t.title, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: t.title,
    description: t.summary,
    url,
    inLanguage: "es",
    educationalLevel: hub.name,
    learningResourceType: "Lesson",
    teaches: t.summary,
    isAccessibleForFree: true,
  };

  return (
    <main id="main-content" className="mx-auto max-w-3xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex flex-wrap gap-2">
          <li><Link href={localizedPath("es", "/")}>Inicio</Link> /</li>
          <li><Link href={localizedPath("es", hub.pathname)}>{hub.name}</Link> /</li>
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
          Consejos
        </h2>
        <ul className="mt-3 space-y-2 list-disc list-inside text-chalkboard/80">
          {t.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-block border border-chalkboard/10 p-6 shadow-block" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="font-display font-bold text-xl">
          Para hacer en casa: {t.activity.title}
        </h2>
        <p className="mt-2 text-sm text-chalkboard/70">
          <strong>Material:</strong> {t.activity.material}
        </p>
        <ol className="mt-3 space-y-2 list-decimal list-inside text-chalkboard/80">
          {t.activity.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="mt-8" aria-labelledby="links-heading">
        <h2 id="links-heading" className="font-display font-bold text-xl">
          En AlphaBes
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
        Lee también:{" "}
        {others.map((o, i) => (
          <span key={o.slug}>
            {i > 0 && " · "}
            <Link href={localizedPath("es", hub.topicPathname, { topic: o.slug })} className="font-bold underline">
              {o.title}
            </Link>
          </span>
        ))}
        {" · "}
        <Link href={localizedPath("es", hub.pathname)} className="font-bold underline">
          {hub.name}
        </Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
    </main>
  );
}
