"use client";
import Link from "next/link";
import { useState } from "react";
import StoryPicture from "@/components/stories/StoryPicture";
import type { Locale } from "@/i18n/routing";

export type StoryCard = {
  href: string;
  title: string;
  description: string;
  cover: string | null;
  alt: string;
  level: 1 | 2 | 3;
  ageMin: number;
  ageMax: number;
  pages: number;
  isNew: boolean;
};

const LABELS = {
  en: { filter: "Filter by level", all: "All stories", level: "Level", ages: (a: number, b: number) => `Ages ${a}–${b}`, isNew: "New", pages: (n: number) => `${n} pages` },
  fr: { filter: "Filtrer par niveau", all: "Toutes", level: "Niveau", ages: (a: number, b: number) => `${a}–${b} ans`, isNew: "Nouveau", pages: (n: number) => `${n} pages` },
  es: { filter: "Filtrar por nivel", all: "Todos", level: "Nivel", ages: (a: number, b: number) => `${a} a ${b} años`, isNew: "Nuevo", pages: (n: number) => `${n} páginas` },
  pt: { filter: "Filtrar por nível", all: "Todas", level: "Nível", ages: (a: number, b: number) => `${a} a ${b} anos`, isNew: "Nova", pages: (n: number) => `${n} páginas` },
};
const LEVEL_AGES: Record<1 | 2 | 3, [number, number]> = { 1: [3, 4], 2: [4, 6], 3: [6, 8] };

// The story cards with a level / age filter. Every card is in the server
// HTML; the filter only hides cards in the browser.
export default function StoryGrid({ stories, locale }: { stories: StoryCard[]; locale: Locale }) {
  const t = LABELS[locale];
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const levels = ([1, 2, 3] as const).filter((l) => stories.some((s) => s.level === l));
  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 font-display text-base font-bold transition ${
      active ? "bg-owl-purple text-white shadow-[0_4px_0_#4428C9]" : "bg-white text-owl-ink ring-1 ring-owl-ink/10 hover:ring-owl-purple/40"
    }`;

  return (
    <>
      <div role="group" aria-label={t.filter} className="mt-8 flex flex-wrap gap-2">
        <button type="button" aria-pressed={level === 0} onClick={() => setLevel(0)} className={chip(level === 0)}>
          {t.all}
        </button>
        {levels.map((l) => (
          <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(l)} className={chip(level === l)}>
            {t.level} {l} · {t.ages(...LEVEL_AGES[l])}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s, i) => (
          <li key={s.href} hidden={level !== 0 && s.level !== level}>
            <Link href={s.href} className="owl-card h-full !p-0 overflow-hidden">
              <div className="relative">
                <StoryPicture
                  src={s.cover}
                  alt={s.alt}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  priority={i < 3}
                />
                {s.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-owl-pink px-3 py-1 text-sm font-bold text-white shadow-sm">
                    {t.isNew}
                  </span>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-xl leading-snug">{s.title}</h2>
                <p className="mt-1.5 font-body text-sm font-normal leading-relaxed text-owl-muted">{s.description}</p>
                <p className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-owl-lilac px-2.5 py-0.5 text-owl-purple">
                    {t.level} {s.level}
                  </span>
                  <span className="rounded-full bg-owl-cream px-2.5 py-0.5">{t.ages(s.ageMin, s.ageMax)}</span>
                  <span className="rounded-full bg-owl-mint px-2.5 py-0.5 text-owl-green-dark">{t.pages(s.pages)}</span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
