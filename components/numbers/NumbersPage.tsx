import Link from "next/link";
import type { Locale } from "@/i18n/routing";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import { HTML_LANG, SITE_URL, absoluteUrl, localizedPath } from "@/lib/i18n/routes";
import { activityLinks, numberCards, numbersCopy } from "@/lib/numbers-page";

// The card colours of the home page's feature tiles, in turn.
const TINTS = ["bg-white", "bg-owl-lilac", "bg-owl-cream", "bg-owl-mint"];

// /numbers in every language (app/[locale]/numbers): the numbers 0 to 20 as
// cards, then the other number activities, in the home page's owl style.
export default function NumbersPage({ locale }: { locale: Locale }) {
  const copy = numbersCopy(locale);
  const cards = numberCards(locale);
  const activities = activityLinks(locale);
  const url = absoluteUrl(locale, "/numbers");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: copy.h1,
      description: copy.description,
      url,
      inLanguage: HTML_LANG[locale],
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: cards.length,
        itemListElement: cards.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.n} (${c.word})`, url: SITE_URL + c.href })),
      },
    },
    buildBreadcrumbJsonLd([
      { name: copy.home, url: absoluteUrl(locale, "/") },
      { name: copy.crumb, url },
    ]),
  ];

  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav aria-label="Breadcrumb" className="text-sm text-owl-muted">
          <ol className="flex gap-2">
            <li>
              <Link href={localizedPath(locale, "/")} className="hover:text-owl-purple">
                {copy.home}
              </Link>{" "}
              /
            </li>
            <li aria-current="page" className="font-bold text-owl-ink">
              {copy.crumb}
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{copy.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">{copy.intro}</p>

        <section aria-labelledby="numbers-heading" className="mt-10">
          <h2 id="numbers-heading" className="font-display text-2xl font-extrabold sm:text-3xl">
            {copy.cardsHeading}
          </h2>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-7">
            {cards.map((c, i) => (
              <li key={c.n}>
                <Link href={c.href} className={`owl-card flex h-full flex-col items-center p-4 text-center ${TINTS[i % TINTS.length]}`}>
                  <span className="text-5xl font-extrabold leading-none text-owl-purple sm:text-6xl">{c.n}</span>
                  <span className="mt-2 text-lg leading-tight">{c.word}</span>
                  <span className="mt-1 font-body text-xs font-semibold text-owl-muted">{c.target}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="activities-heading" className="mt-12">
          <h2 id="activities-heading" className="font-display text-2xl font-extrabold sm:text-3xl">
            {copy.moreHeading}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a) => (
              <li key={a.key}>
                <Link href={a.href} className="owl-card h-full">
                  <span className="block text-xl">{a.name}</span>
                  <span className="mt-1 block font-body text-base font-normal text-owl-muted">{a.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="tips-heading" className="mt-12 rounded-3xl bg-owl-mint p-6 sm:p-8">
          <h2 id="tips-heading" className="font-display text-xl font-extrabold">
            {copy.tipsHeading}
          </h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-lg">
            {copy.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
