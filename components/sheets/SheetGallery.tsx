"use client";

// The card grid of a worksheet type's listing page (components/sheets/
// SheetPages.tsx), with its filters and pagination. The server HTML shows the
// first page with no filter; every sheet page is also linked from its
// neighbours and the sitemap.
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { SHEET_UI } from "@/lib/sheets/ui";
import type { SheetFilter, SheetLocale } from "@/lib/sheets/types";

export type GalleryItem = {
  slug: string;
  title: string;
  label: string;
  preview: string;
  thumb: string;
  pdf: string;
  filters: Record<string, string>;
};

const PER_PAGE = 24;

export default function SheetGallery({
  locale,
  items,
  filters,
  previewHeight,
}: {
  locale: SheetLocale;
  items: GalleryItem[];
  filters: SheetFilter[];
  previewHeight: number;
}) {
  const t = SHEET_UI[locale];
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const shown = useMemo(() => items.filter((it) => Object.entries(chosen).every(([k, v]) => it.filters[k] === v)), [items, chosen]);
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = shown.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const choose = (key: string, value: string | null) => {
    setChosen((c) => {
      const next = { ...c };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
    setPage(1);
  };
  const goTo = (n: number) => {
    setPage(n);
    document.getElementById("sheet-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="sheet-gallery" className="scroll-mt-24">
      <div role="group" aria-label={t.filters} className="space-y-3">
        {filters.map((f) => (
          <fieldset key={f.key} className="flex flex-wrap items-center gap-2">
            <legend className="sr-only">{f.label[locale]}</legend>
            <span aria-hidden="true" className="mr-1 w-full font-display text-sm font-bold text-owl-muted sm:w-auto sm:min-w-[7.5rem]">
              {f.label[locale]}
            </span>
            {[{ value: null as string | null, label: t.all }, ...f.options.map((o) => ({ value: o.value as string | null, label: o.label[locale] }))].map((o) => {
              const active = (chosen[f.key] ?? null) === o.value;
              return (
                <button
                  key={o.value ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(f.key, o.value)}
                  className={`rounded-full px-4 py-1.5 font-display text-sm font-bold ring-1 transition ${
                    active ? "bg-owl-purple text-white ring-owl-purple" : "bg-white text-owl-ink ring-owl-ink/15 hover:ring-owl-purple"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </fieldset>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-owl-muted">
        {shown.length ? t.showing((current - 1) * PER_PAGE + 1, (current - 1) * PER_PAGE + slice.length, shown.length) : t.none}
        {!shown.length && (
          <button type="button" onClick={() => setChosen({})} className="ml-2 font-bold text-owl-purple underline">
            {t.reset}
          </button>
        )}
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {slice.map((it) => (
          <li key={it.slug} className="flex flex-col rounded-3xl bg-white p-3 ring-1 ring-owl-ink/5 transition hover:-translate-y-1 hover:shadow-[0_18px_30px_-18px_rgba(29,24,70,.35)] hover:ring-owl-purple/30">
            <Link href={{ pathname: "/worksheets/[category]", params: { category: it.slug } }} className="block flex-1 text-owl-ink no-underline">
              {/* Pre-rendered JPEGs (scripts/sheets/generate.ts); image optimization isn't set up on Workers. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.preview}
                srcSet={`${it.thumb} 320w, ${it.preview} 476w`}
                sizes="(min-width: 1024px) 246px, (min-width: 640px) 30vw, 45vw"
                alt={`${t.previewOf} ${it.title}`}
                width={476}
                height={previewHeight}
                loading="lazy"
                className="h-auto w-full rounded-2xl border border-owl-ink/10 bg-white"
              />
              <h3 className="mt-2 font-display text-sm font-bold leading-snug sm:text-base">{it.label}</h3>
            </Link>
            <a
              href={it.pdf}
              download
              className="mt-3 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-owl-green-dark px-2 py-2 font-display text-xs font-bold text-white no-underline hover:bg-owl-green sm:px-3 sm:text-sm"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
              </svg>
              {t.download}
              <span className="sr-only">: {it.title}</span>
            </a>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <nav aria-label={t.pagination} className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={current === 1}
            onClick={() => goTo(current - 1)}
            className="rounded-full bg-white px-4 py-2 font-display font-bold ring-1 ring-owl-ink/15 disabled:opacity-40"
          >
            ← {t.prev}
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              aria-label={t.page(n)}
              aria-current={n === current ? "page" : undefined}
              onClick={() => goTo(n)}
              className={`h-10 w-10 rounded-full font-display font-bold ring-1 ${
                n === current ? "bg-owl-purple text-white ring-owl-purple" : "bg-white ring-owl-ink/15 hover:ring-owl-purple"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={current === pages}
            onClick={() => goTo(current + 1)}
            className="rounded-full bg-white px-4 py-2 font-display font-bold ring-1 ring-owl-ink/15 disabled:opacity-40"
          >
            {t.next} →
          </button>
        </nav>
      )}
    </div>
  );
}
