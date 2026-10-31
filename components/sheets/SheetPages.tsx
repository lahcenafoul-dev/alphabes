// The pages of the new worksheet types (lib/sheets/catalog.ts) under
// /worksheets/[category] in every language: a listing page per type (filters,
// card grid, pagination) and a page per sheet (preview, Print / Download,
// how to use it, related sheets). Owl style, like the home page.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { previewThumb } from "@/lib/preview-thumb";
import {
  PREVIEW_SIZE,
  SHEET_KINDS,
  SHEET_PAGE,
  getSheet,
  getSheetKind,
  getSheetKindBySlug,
  relatedSheets,
  sheetNeighbours,
  sheetPdf,
  sheetPreview,
  sheetsOfKind,
  type Sheet,
  type SheetKind,
  type SheetLocale,
} from "@/lib/sheets/catalog";
import { SHEET_UI } from "@/lib/sheets/ui";
import { HTML_LANG, SITE_URL, absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";
import SheetGallery, { type GalleryItem } from "./SheetGallery";

const PATH = "/worksheets/[category]" as const;

/** True when the slug is a listing page or a sheet of these types. */
export function isSheetSlug(locale: SheetLocale, slug: string): boolean {
  return !!(getSheetKindBySlug(locale, slug) || getSheet(locale, slug));
}

export function sheetMetadata(locale: SheetLocale, slug: string): Metadata {
  const url = absoluteUrl(locale, PATH, { category: slug });
  const alternates = alternatesFor(locale, PATH, { category: slug });
  const kind = getSheetKindBySlug(locale, slug);
  if (kind) {
    const title = kind.metaTitle[locale];
    const description = kind.description[locale];
    const first = sheetsOfKind(kind.id)[0];
    return { title, description, alternates, openGraph: { title, description, url, images: [SITE_URL + sheetPreview(locale, first)] } };
  }
  const sheet = getSheet(locale, slug)!;
  const title = `${sheet.title[locale]} | ${SHEET_UI[locale].metaSuffix}`;
  const description = sheet.description[locale];
  return { title, description, alternates, openGraph: { title, description, url, images: [SITE_URL + sheetPreview(locale, sheet)] } };
}

export default function SheetPage({ locale, slug }: { locale: SheetLocale; slug: string }) {
  const kind = getSheetKindBySlug(locale, slug);
  if (kind) return <KindView locale={locale} kind={kind} />;
  return <SheetView locale={locale} sheet={getSheet(locale, slug)!} />;
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function Breadcrumb({ locale, items }: { locale: SheetLocale; items: { label: string; slug?: string }[] }) {
  const t = SHEET_UI[locale];
  return (
    <nav aria-label={t.breadcrumb} className="text-sm text-owl-muted print:hidden">
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-owl-purple">{t.home}</Link> /
        </li>
        <li>
          <Link href="/worksheets" className="hover:text-owl-purple">{t.hub}</Link> /
        </li>
        {items.map((item) =>
          item.slug ? (
            <li key={item.label}>
              <Link href={{ pathname: PATH, params: { category: item.slug } }} className="hover:text-owl-purple">{item.label}</Link> /
            </li>
          ) : (
            <li key={item.label} aria-current="page" className="font-bold text-owl-ink">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

function breadcrumbJsonLd(locale: SheetLocale, items: { name: string; slug: string }[]) {
  const t = SHEET_UI[locale];
  return buildBreadcrumbJsonLd([
    { name: t.home, url: absoluteUrl(locale, "/") },
    { name: t.hub, url: absoluteUrl(locale, "/worksheets") },
    ...items.map((i) => ({ name: i.name, url: absoluteUrl(locale, PATH, { category: i.slug }) })),
  ]);
}

/** Links to the other worksheet types: each type links to its neighbours. */
function OtherKinds({ locale, current }: { locale: SheetLocale; current: SheetKind }) {
  const t = SHEET_UI[locale];
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-extrabold">{t.otherKinds}</h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {SHEET_KINDS.filter((k) => k !== current).map((k) => (
          <li key={k.id}>
            <Link href={{ pathname: PATH, params: { category: k.slug[locale] } }} className="owl-card h-full">
              <span className="text-lg">{k.name[locale]}</span>
              <span className="mt-1 block font-body text-sm font-normal text-owl-muted">{k.description[locale]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function KindView({ locale, kind }: { locale: SheetLocale; kind: SheetKind }) {
  const t = SHEET_UI[locale];
  const sheets = sheetsOfKind(kind.id);
  const items: GalleryItem[] = sheets.map((s) => {
    const preview = sheetPreview(locale, s);
    return { slug: s.slug[locale], title: s.title[locale], label: s.label[locale], preview, thumb: previewThumb(preview), pdf: sheetPdf(locale, s), filters: s.filters };
  });
  const url = absoluteUrl(locale, PATH, { category: kind.slug[locale] });
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: kind.heading[locale],
    description: kind.description[locale],
    url,
    inLanguage: HTML_LANG[locale],
    isAccessibleForFree: true,
    numberOfItems: sheets.length,
  };

  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <Breadcrumb locale={locale} items={[{ label: kind.name[locale] }]} />
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-owl-mint px-3 py-1 font-display text-sm font-bold text-owl-green-dark">{t.free}</span>
          <span className="rounded-full bg-owl-lilac px-3 py-1 font-display text-sm font-bold text-owl-purple">{t.sheets(sheets.length)}</span>
          <span className="rounded-full bg-owl-cream px-3 py-1 font-display text-sm font-bold">{kind.level[locale]}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">{kind.heading[locale]}</h1>
        <p className="mt-4 max-w-3xl text-lg text-owl-muted">{kind.intro[locale]}</p>

        <section className="mt-10">
          <h2 className="sr-only">{t.filters}</h2>
          <SheetGallery locale={locale} items={items} filters={kind.filters} previewHeight={PREVIEW_SIZE[SHEET_PAGE[locale]].height} />
        </section>

        <section className="mt-14 rounded-3xl bg-white p-6 ring-1 ring-owl-ink/5 sm:p-8">
          <h2 className="font-display text-2xl font-extrabold">{t.howTo}</h2>
          <p className="mt-3 max-w-3xl text-owl-muted">{kind.howTo[locale]}</p>
          <p className="mt-3 text-sm text-owl-muted">
            <strong className="text-owl-ink">{t.skills}:</strong> {kind.skills[locale].join(", ")}
          </p>
        </section>

        <OtherKinds locale={locale} current={kind} />
      </main>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: kind.name[locale], slug: kind.slug[locale] }])} />
      <JsonLd data={collectionJsonLd} />
    </div>
  );
}

function SheetCard({ locale, sheet }: { locale: SheetLocale; sheet: Sheet }) {
  const t = SHEET_UI[locale];
  const preview = sheetPreview(locale, sheet);
  return (
    <li>
      <Link href={{ pathname: PATH, params: { category: sheet.slug[locale] } }} className="owl-card h-full !p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={preview}
          srcSet={`${previewThumb(preview)} 320w, ${preview} 476w`}
          sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
          alt={`${t.previewOf} ${sheet.title[locale]}`}
          width={476}
          height={PREVIEW_SIZE[SHEET_PAGE[locale]].height}
          loading="lazy"
          className="h-auto w-full rounded-2xl border border-owl-ink/10"
        />
        <span className="mt-2 block text-sm leading-snug">{sheet.label[locale]}</span>
      </Link>
    </li>
  );
}

function SheetView({ locale, sheet }: { locale: SheetLocale; sheet: Sheet }) {
  const t = SHEET_UI[locale];
  const kind = getSheetKind(sheet.kind);
  const pdf = sheetPdf(locale, sheet);
  const preview = sheetPreview(locale, sheet);
  const url = absoluteUrl(locale, PATH, { category: sheet.slug[locale] });
  const { prev, next } = sheetNeighbours(sheet);
  const related = relatedSheets(sheet);
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: sheet.title[locale],
    description: sheet.description[locale],
    url,
    inLanguage: HTML_LANG[locale],
    educationalLevel: kind.level[locale],
    learningResourceType: "Worksheet",
    teaches: kind.skills[locale].join(", "),
    isAccessibleForFree: true,
    image: SITE_URL + preview,
    encoding: { "@type": "MediaObject", contentUrl: SITE_URL + pdf, encodingFormat: "application/pdf" },
  };

  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <Breadcrumb locale={locale} items={[{ label: kind.name[locale], slug: kind.slug[locale] }, { label: sheet.label[locale] }]} />

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-owl-mint px-3 py-1 font-display text-sm font-bold text-owl-green-dark">{t.free}</span>
              <span className="rounded-full bg-owl-lilac px-3 py-1 font-display text-sm font-bold text-owl-purple">{kind.name[locale]}</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{sheet.title[locale]}</h1>
            <p className="mt-4 text-lg text-owl-muted">{sheet.description[locale]}</p>

            <div className="mt-6 flex flex-wrap gap-4 print:hidden">
              <a href={pdf} download className="owl-btn owl-btn-green gap-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                {t.download}
              </a>
              <a href={pdf} target="_blank" rel="noopener" className="owl-btn owl-btn-outline gap-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                  <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />
                </svg>
                {t.print}
              </a>
            </div>

            <section className="mt-8 rounded-3xl bg-owl-cream p-5">
              <h2 className="font-display text-lg font-extrabold">{t.onTheSheet}</h2>
              <p className="mt-1">{sheet.instruction[locale]}</p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-extrabold">{t.howTo}</h2>
              <p className="mt-3 text-owl-muted">{kind.howTo[locale]}</p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-extrabold">{t.details}</h2>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="font-bold">{t.level}</dt>
                <dd className="text-owl-muted">{kind.level[locale]}</dd>
                <dt className="font-bold">{t.skills}</dt>
                <dd className="text-owl-muted">{kind.skills[locale].join(", ")}</dd>
                <dt className="font-bold">{t.paper}</dt>
                <dd className="text-owl-muted">{t.paperSize}</dd>
                <dt className="font-bold">{t.price}</dt>
                <dd className="text-owl-muted">{t.freeLong}</dd>
              </dl>
            </section>
          </div>

          <div className="md:order-none order-first">
            <a href={pdf} target="_blank" rel="noopener" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt={`${t.previewOf} ${sheet.title[locale]}`}
                width={476}
                height={PREVIEW_SIZE[SHEET_PAGE[locale]].height}
                loading="eager"
                className="mx-auto h-auto w-full max-w-[400px] rounded-3xl border border-owl-ink/10 bg-white shadow-[0_18px_30px_-18px_rgba(29,24,70,.35)]"
              />
            </a>
          </div>
        </div>

        <nav aria-label={`${t.previous} / ${t.following}`} className="mt-10 flex flex-wrap justify-between gap-3 print:hidden">
          {prev ? (
            <Link href={{ pathname: PATH, params: { category: prev.slug[locale] } }} className="owl-btn owl-btn-outline !text-base" rel="prev">
              ← <span className="sr-only">{t.previous}: </span>{prev.label[locale]}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={{ pathname: PATH, params: { category: next.slug[locale] } }} className="owl-btn owl-btn-outline !text-base" rel="next">
              <span className="sr-only">{t.following}: </span>{next.label[locale]} →
            </Link>
          )}
        </nav>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold">{t.related}</h2>
          <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {related.map((s) => (
              <SheetCard key={s.id} locale={locale} sheet={s} />
            ))}
          </ul>
          <p className="mt-6">
            <Link href={{ pathname: PATH, params: { category: kind.slug[locale] } }} className="owl-btn owl-btn-purple">
              {t.allOfKind(kind.name[locale])}
            </Link>
          </p>
        </section>

        <OtherKinds locale={locale} current={kind} />
      </main>
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: kind.name[locale], slug: kind.slug[locale] }, { name: sheet.label[locale], slug: sheet.slug[locale] }])} />
      <JsonLd data={resourceJsonLd} />
    </div>
  );
}

const HUB_HEADING: Record<SheetLocale, string> = {
  en: "Math, logic and sticker worksheets",
  fr: "Nombres manquants, suites logiques et gommettes",
  es: "Números que faltan, series y stickers",
  pt: "Números que faltam, sequências e adesivos",
};

/** The worksheet types on the worksheets hub (/worksheets, /fr/fiches…), with a preview each. */
export function SheetTypesSection({ locale }: { locale: SheetLocale }) {
  return (
    <section className="mt-12" aria-labelledby="sheet-types-heading">
      <h2 id="sheet-types-heading" className="text-3xl font-bold">
        {HUB_HEADING[locale]}
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {SHEET_KINDS.map((k) => {
          const first = sheetsOfKind(k.id)[0];
          const preview = sheetPreview(locale, first);
          return (
            <li key={k.id}>
              <Link href={{ pathname: PATH, params: { category: k.slug[locale] } }} className="owl-card flex h-full gap-4 !p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewThumb(preview)}
                  alt=""
                  width={320}
                  height={Math.round((320 * PREVIEW_SIZE[SHEET_PAGE[locale]].height) / 476)}
                  loading="lazy"
                  className="h-auto w-20 flex-none self-start rounded-xl border border-owl-ink/10"
                />
                <span>
                  <span className="block text-lg">{k.name[locale]}</span>
                  <span className="mt-1 block font-body text-sm font-normal text-owl-muted">{SHEET_UI[locale].sheets(sheetsOfKind(k.id).length)} · {k.level[locale]}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
