// The Pro packs on the site (lib/sheets/packs.ts), in every language: a page
// per pack under the bundles route (/worksheets/bundles/<slug>, /fr/fiches/
// packs/<slug>…) with its cover, previews, contents and download buttons; a
// section on the bundles listing; and a small box on each worksheet type and
// sheet page pointing to the type's complete pack. The PDFs themselves are
// only served by /api/bundles/..., after a Pro check.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { packDownloadUrl } from "@/lib/billing/bundles";
import manifest from "@/lib/sheets/pack-manifest.json";
import {
  DEFAULT_PAPER,
  PACK_KINDS,
  PACK_PAPERS,
  PACKS,
  completePack,
  getPack,
  packAges,
  packFiles,
  packItemCount,
  packKey,
  packKindLevel,
  packKindName,
  packKindSlug,
  packKinds,
  packPreview,
  type Pack,
  type PackKind,
} from "@/lib/sheets/packs";
import { PACK_UI } from "@/lib/sheets/pack-ui";
import type { SheetLocale } from "@/lib/sheets/types";
import { HTML_LANG, SITE_URL, absoluteUrl, alternatesFor } from "@/lib/i18n/routes";
import { buildBreadcrumbJsonLd } from "@/lib/json-ld";

const PATH = "/worksheets/bundles/[bundleSlug]" as const;
const FILES = manifest as Record<string, { pages: number; bytes: number }>;

/** Pack slugs for the bundle route's static params. */
export function packParams(locale: SheetLocale): string[] {
  return PACKS.map((p) => p.slug[locale]);
}

export function isPackSlug(locale: SheetLocale, slug: string): boolean {
  return !!getPack(locale, slug);
}

function packName(locale: SheetLocale, pack: Pack): string {
  const kind = pack.kind === "mega" ? "" : packKindName(pack.kind)[locale];
  return PACK_UI[locale].title(kind, pack, pack.name[locale]);
}

function packKindLabel(pack: Pack): string {
  return pack.kind === "mega" ? "mega" : pack.kind;
}

function packDescription(locale: SheetLocale, pack: Pack): string {
  const t = PACK_UI[locale];
  if (pack.kind === "mega") return t.megaDescription(packItemCount(pack), PACK_KINDS.length);
  return t.description(packKindName(pack.kind)[locale], packItemCount(pack), t.ages(...packAges(pack)), pack.keys);
}

function cover(locale: SheetLocale, pack: Pack): string {
  return packPreview(locale, pack, pack.parts ? "cover-part-1" : "cover");
}

export function packMetadata(locale: SheetLocale, slug: string): Metadata {
  const pack = getPack(locale, slug)!;
  const title = `${packName(locale, pack)} | ${PACK_UI[locale].metaSuffix}`;
  const description = packDescription(locale, pack);
  const others = Object.fromEntries((["en", "fr", "es", "pt"] as const).map((l) => [l, { bundleSlug: pack.slug[l] }]));
  return {
    title,
    description,
    alternates: alternatesFor(locale, PATH, { bundleSlug: slug }, others),
    openGraph: { title, description, url: absoluteUrl(locale, PATH, { bundleSlug: slug }), images: [{ url: SITE_URL + cover(locale, pack) }] },
  };
}

function Badge({ children, tone }: { children: React.ReactNode; tone: "pro" | "lilac" | "cream" | "mint" }) {
  const cls = {
    pro: "bg-owl-purple text-white",
    lilac: "bg-owl-lilac text-owl-purple",
    cream: "bg-owl-cream",
    mint: "bg-owl-mint text-owl-green-dark",
  }[tone];
  return <span className={`rounded-full px-3 py-1 font-display text-sm font-bold ${cls}`}>{children}</span>;
}

/** The download buttons of one file (the pack, or a part of the Mega pack): one per paper, the language's first. */
function DownloadRow({ locale, pack, part, label }: { locale: SheetLocale; pack: Pack; part?: number; label?: string }) {
  const t = PACK_UI[locale];
  const papers = [DEFAULT_PAPER[locale], ...PACK_PAPERS.filter((p) => p !== DEFAULT_PAPER[locale])];
  return (
    <li className="rounded-2xl bg-owl-bg p-4">
      {label && <p className="font-display font-bold">{label}</p>}
      <div className={`flex flex-wrap gap-3 ${label ? "mt-3" : ""}`}>
        {papers.map((paper, i) => {
          const file = FILES[packKey(locale, pack, paper, part)];
          return (
            <a
              key={paper}
              href={packDownloadUrl(locale, pack.slug[locale], paper, part)}
              rel="nofollow"
              className={`owl-btn ${i === 0 ? "owl-btn-purple" : "owl-btn-outline"} flex-col !items-start gap-0 !text-base`}
            >
              <span className="flex items-center gap-2">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                PDF {t.paperName[paper]}
                {i === 0 && <span className="text-xs font-normal opacity-80">({t.defaultPaper})</span>}
              </span>
              {file && <span className="text-xs font-normal opacity-80">{t.fileInfo(file.pages, (file.bytes / 1024 / 1024).toFixed(1))}</span>}
            </a>
          );
        })}
      </div>
    </li>
  );
}

export default function ProPackPage({ locale, slug }: { locale: SheetLocale; slug: string }) {
  const t = PACK_UI[locale];
  const pack = getPack(locale, slug)!;
  const name = packName(locale, pack);
  const description = packDescription(locale, pack);
  const kinds = packKinds(pack);
  const items = packItemCount(pack);
  const url = absoluteUrl(locale, PATH, { bundleSlug: slug });
  const previews: [string, string][] = [
    [packPreview(locale, pack, "sheet"), t.previewSheet],
    [packPreview(locale, pack, "key"), pack.keys ? t.previewKey : t.previewSheet],
  ];
  const resourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url,
    inLanguage: HTML_LANG[locale],
    learningResourceType: "Worksheet pack",
    educationalLevel: pack.kind === "mega" ? t.ages(...packAges(pack)) : packKindLevel(pack.kind)[locale],
    isAccessibleForFree: false,
    image: SITE_URL + cover(locale, pack),
  };
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: t.home, url: absoluteUrl(locale, "/") },
    { name: t.hub, url: absoluteUrl(locale, "/worksheets") },
    { name: t.bundles, url: absoluteUrl(locale, "/worksheets/bundles") },
    { name, url },
  ]);

  return (
    <div className="bg-owl-bg text-owl-ink">
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <nav aria-label={t.breadcrumb} className="text-sm text-owl-muted">
          <ol className="flex flex-wrap gap-x-2 gap-y-1">
            <li><Link href="/" className="hover:text-owl-purple">{t.home}</Link> /</li>
            <li><Link href="/worksheets" className="hover:text-owl-purple">{t.hub}</Link> /</li>
            <li><Link href="/worksheets/bundles" className="hover:text-owl-purple">{t.bundles}</Link> /</li>
            <li aria-current="page" className="font-bold text-owl-ink">{name}</li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="pro">AlphaBes Pro</Badge>
              <Badge tone="lilac">{t.items(items, packKindLabel(pack))}</Badge>
              <Badge tone="cream">{t.ages(...packAges(pack))}</Badge>
              {pack.keys && <Badge tone="mint">{t.keys}</Badge>}
              <Badge tone="cream">{t.papers}</Badge>
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{name}</h1>
            <p className="mt-4 text-lg text-owl-muted">{description}</p>

            <section className="mt-8 rounded-3xl bg-white p-5 ring-1 ring-owl-ink/5 sm:p-6">
              <h2 className="font-display text-2xl font-extrabold">{t.download}</h2>
              <ul className="mt-4 space-y-3">
                {packFiles(pack).map(({ part }) => (
                  <DownloadRow key={part ?? 0} locale={locale} pack={pack} part={part} label={part ? t.part(part, pack.parts![part - 1].name[locale]) : undefined} />
                ))}
              </ul>
              <p className="mt-4 text-sm text-owl-muted">{t.downloadNote}</p>
              <p className="mt-2 text-sm">
                <Link href="/pricing" className="font-bold text-owl-purple underline underline-offset-2">{t.notPro}</Link>
              </p>
            </section>

            <section className="mt-8">
              <h2 className="font-display text-2xl font-extrabold">{t.inside}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-owl-muted">
                {t.extras.map((e) => <li key={e}>{e}</li>)}
                {pack.keys && <li>{t.keysExtra}</li>}
                <li>{t.certificate}</li>
              </ul>
              {pack.parts ? (
                <>
                  <h3 className="mt-6 font-display text-xl font-extrabold">{t.parts}</h3>
                  <ol className="mt-3 grid gap-3 sm:grid-cols-2">
                    {pack.parts.map((p, i) => (
                      <li key={i} className="rounded-2xl bg-white p-4 ring-1 ring-owl-ink/5">
                        <p className="font-display font-bold">{t.part(i + 1, p.name[locale])}</p>
                        <p className="mt-1 text-sm text-owl-muted">
                          {p.kinds.map((k) => packKindName(k)[locale]).join(" · ")} · {t.items(packItemCount(pack, i + 1), "")}
                        </p>
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {pack.sections.map((s) => (
                    <li key={s.label.en} className="flex justify-between gap-3 rounded-2xl bg-white px-4 py-2 ring-1 ring-owl-ink/5">
                      <span>{s.label[locale]}</span>
                      <span className="text-owl-muted">{s.items.length}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {kinds.length === 1 && kinds[0] !== "sliding-puzzles" && (
              <p className="mt-8">
                <Link href={{ pathname: "/worksheets/[category]", params: { category: packKindSlug(kinds[0])[locale] } }} className="owl-btn owl-btn-outline !text-base">
                  {packKindName(kinds[0])[locale]} →
                </Link>
              </p>
            )}
          </div>

          <div className="order-first md:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover(locale, pack)}
              alt={`${t.previewCover}: ${name}`}
              width={480}
              height={DEFAULT_PAPER[locale] === "letter" ? 621 : 679}
              loading="eager"
              className="mx-auto h-auto w-full max-w-[380px] rounded-3xl border border-owl-ink/10 bg-white shadow-[0_18px_30px_-18px_rgba(29,24,70,.35)]"
            />
            <div className="mx-auto mt-4 grid max-w-[380px] grid-cols-2 gap-3">
              {previews.map(([src, alt]) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt={`${alt}: ${name}`} width={480} height={DEFAULT_PAPER[locale] === "letter" ? 621 : 679} loading="lazy" className="h-auto w-full rounded-2xl border border-owl-ink/10 bg-white" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(resourceJsonLd) }} />
    </div>
  );
}

function PackCard({ locale, pack }: { locale: SheetLocale; pack: Pack }) {
  const t = PACK_UI[locale];
  return (
    <li>
      <Link href={{ pathname: PATH, params: { bundleSlug: pack.slug[locale] } }} className="owl-card flex h-full gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover(locale, pack)} alt="" width={96} height={124} loading="lazy" className="h-auto w-20 shrink-0 self-start rounded-lg border border-owl-ink/10 bg-white" />
        <span className="min-w-0">
          <span className="block">{packName(locale, pack)}</span>
          <span className="mt-1 block font-body text-sm font-normal text-owl-muted">
            {t.items(packItemCount(pack), packKindLabel(pack))}
            {pack.keys ? ` · ${t.keys}` : ""}
          </span>
        </span>
      </Link>
    </li>
  );
}

/** The Pro packs on the bundles listing, above the free bundles. */
export function ProPacksSection({ locale }: { locale: SheetLocale }) {
  const t = PACK_UI[locale];
  const groups: [string, Pack[]][] = [
    [t.megaGroup, PACKS.filter((p) => p.scope === "mega")],
    [t.completeGroup, PACKS.filter((p) => p.scope === "complete")],
    [t.levelGroup, PACKS.filter((p) => p.scope === "level")],
  ];
  return (
    <section className="mt-10 rounded-3xl bg-owl-bg p-5 text-owl-ink sm:p-8" aria-labelledby="pro-packs-heading">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="pro-packs-heading" className="font-display text-3xl font-extrabold">{t.sectionTitle}</h2>
        <Badge tone="pro">Pro</Badge>
      </div>
      <p className="mt-2 max-w-3xl text-owl-muted">{t.sectionIntro}</p>
      {groups.map(([heading, packs]) => (
        <div key={heading} className="mt-8">
          <h3 className="font-display text-xl font-extrabold">{heading}</h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((p) => <PackCard key={p.id} locale={locale} pack={p} />)}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** "Want all 80 … worksheets in one PDF?": on a worksheet type's listing and on each of its sheets. */
export function PackUpsell({ locale, kind }: { locale: SheetLocale; kind: PackKind }) {
  const t = PACK_UI[locale];
  const pack = completePack(kind);
  return (
    <aside className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-owl-lilac p-5 print:hidden">
      <p className="font-display text-lg font-bold">
        <span className="mr-2 inline-block rounded-full bg-owl-purple px-2.5 py-0.5 text-xs text-white align-middle">Pro</span>
        {t.upsell(packItemCount(pack), packKindName(kind)[locale], pack.keys)}
      </p>
      <Link href={{ pathname: PATH, params: { bundleSlug: pack.slug[locale] } }} className="owl-btn owl-btn-purple !text-base">
        {t.upsellCta} →
      </Link>
    </aside>
  );
}

/** The Pro packs on the worksheets hub, under the worksheet types. */
export function ProPacksPromo({ locale }: { locale: SheetLocale }) {
  const t = PACK_UI[locale];
  return (
    <aside className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-owl-lilac p-5 text-owl-ink sm:p-6">
      <div className="max-w-2xl">
        <p className="font-display text-xl font-extrabold">
          {t.sectionTitle} <span className="ml-1 inline-block rounded-full bg-owl-purple px-2.5 py-0.5 align-middle text-xs text-white">Pro</span>
        </p>
        <p className="mt-1 text-owl-muted">{t.sectionIntro}</p>
      </div>
      <Link href="/worksheets/bundles" className="owl-btn owl-btn-purple !text-base">
        {t.promoCta} →
      </Link>
    </aside>
  );
}
