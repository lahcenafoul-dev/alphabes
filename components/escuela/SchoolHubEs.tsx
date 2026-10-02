import type { Metadata } from "next";
import Link from "next/link";
import { SCHOOL_HUBS_ES, topicsOfEs, type SchoolLevelEs, type TopicLinkEs } from "@/lib/escuela-es";
import { absoluteUrl, alternatesFor, localizedPath } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

// /es/preescolar and /es/kinder.

export const hrefOf = (l: TopicLinkEs) => localizedPath("es", l.pathname, l.params);

export function schoolHubMetadataEs(level: SchoolLevelEs): Metadata {
  const hub = SCHOOL_HUBS_ES[level];
  return {
    title: hub.metaTitle,
    description: hub.description,
    alternates: alternatesFor("es", hub.pathname),
    openGraph: { title: hub.metaTitle, description: hub.description, url: absoluteUrl("es", hub.pathname) },
  };
}

export default function SchoolHubEs({ level }: { level: SchoolLevelEs }) {
  const hub = SCHOOL_HUBS_ES[level];
  const topics = topicsOfEs(level);
  const url = absoluteUrl("es", hub.pathname);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Inicio", url: absoluteUrl("es", "/") },
    { name: hub.name, url },
  ]);
  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: hub.title,
    description: hub.description,
    url,
    inLanguage: "es",
    educationalLevel: hub.name,
    learningResourceType: "Lesson",
    typicalAgeRange: hub.ageRange,
    isAccessibleForFree: true,
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-6 py-12">
      <nav aria-label="Ruta de navegación" className="text-sm text-chalkboard/60">
        <ol className="flex gap-2">
          <li><Link href={localizedPath("es", "/")}>Inicio</Link> /</li>
          <li aria-current="page" className="font-bold">{hub.name}</li>
        </ol>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="inline-block rounded-full bg-crayon-yellow/25 px-3 py-1 text-sm font-bold">{hub.age}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">{hub.title}</h1>
        <p className="mt-4 text-lg text-chalkboard/70">{hub.intro}</p>
      </header>

      <section className="mt-16" aria-labelledby="learns-heading">
        <h2 id="learns-heading" className="text-3xl font-bold">
          Lo que aprende tu hijo o hija
        </h2>
        <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hub.learns.map((l) => (
            <li key={l.title} className="rounded-block border border-chalkboard/10 bg-paper p-5 shadow-block">
              <p className="font-display font-bold">{l.title}</p>
              <p className="mt-1 text-sm text-chalkboard/70">{l.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="text-3xl font-bold">
          Para saber más
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={localizedPath("es", hub.topicPathname, { topic: t.slug })}
              className="rounded-block border border-chalkboard/10 p-6 shadow-block hover:border-crayon-blue hover:shadow-blockHover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              <span className="text-3xl" aria-hidden="true">
                {t.emoji}
              </span>
              <h3 className="mt-2 font-display font-bold text-xl">{t.title}</h3>
              <p className="mt-2 text-sm text-chalkboard/70">{t.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-crayon-yellow/15 rounded-block p-8" aria-labelledby="more-heading">
        <h2 id="more-heading" className="text-3xl font-bold">
          Todos los recursos
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {hub.resources.map((r) => (
            <li key={r.label}>
              <Link
                href={hrefOf(r)}
                className="inline-block rounded-block border border-chalkboard/15 bg-paper px-4 py-2 text-sm font-display font-bold hover:border-crayon-blue transition-colors"
              >
                {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-3xl font-bold">
          Preguntas frecuentes
        </h2>
        <dl className="mt-6 space-y-6">
          {hub.faq.map((f) => (
            <div key={f.question}>
              <dt className="font-display font-bold text-lg">{f.question}</dt>
              <dd className="mt-1 text-chalkboard/70">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
