"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StoryPicture from "@/components/stories/StoryPicture";
import StoryAudio, { type NarrationPart } from "@/components/StoryAudio";
import { storyAudioPath } from "@/lib/story-audio";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n/routes";
import UiIcon, { InlineIcon } from "@/components/UiIcon";

const LABELS = {
  en: {
    readingAs: "Reading as",
    back: "← Back",
    page: "Page",
    of: "of",
    next: "Next →",
    finish: "Finish",
    greatJob: "Great job!",
    finished: (title: string) => `You finished "${title}"!`,
    more: "More Stories",
    dashboard: "Dashboard",
    signUp: "Sign Up",
    endLabel: "The End",
    talk: "Talk about it",
  },
  fr: {
    readingAs: "Lecture pour",
    back: "← Retour",
    page: "Page",
    of: "sur",
    next: "Suivant →",
    finish: "Terminer",
    greatJob: "Bravo !",
    finished: (title: string) => `Tu as fini « ${title} » !`,
    more: "D'autres histoires",
    dashboard: "Tableau de bord",
    signUp: "Créer un compte",
    endLabel: "Fin",
    talk: "On en parle",
  },
  es: {
    readingAs: "Lectura para",
    back: "← Atrás",
    page: "Página",
    of: "de",
    next: "Siguiente →",
    finish: "Terminar",
    greatJob: "¡Muy bien!",
    finished: (title: string) => `¡Terminaste «${title}»!`,
    more: "Más cuentos",
    dashboard: "Mi cuenta",
    signUp: "Crear una cuenta",
    endLabel: "Fin",
    talk: "Para conversar",
  },
  pt: {
    readingAs: "Leitura para",
    back: "← Voltar",
    page: "Página",
    of: "de",
    next: "Próxima →",
    finish: "Terminar",
    greatJob: "Muito bem!",
    finished: (title: string) => `Você terminou “${title}”!`,
    more: "Mais histórias",
    dashboard: "Minha conta",
    signUp: "Criar uma conta",
    endLabel: "Fim",
    talk: "Para conversar",
  },
};
type Page = {
  id: string;
  pageNumber: number;
  text: string;
  imageUrl: string | null;
  audioUrl: string | null;
};

type Story = {
  id: string;
  slug: string;
  title: string;
  pages: Page[];
};

type Child = { id: string; firstName: string };

type Props = {
  story: Story;
  childProfiles: Child[];
  locale?: Locale;
  /** Alt text: [cover, page 1, page 2…] (lib/stories.ts). */
  alt?: string[];
  /** Shown under the last page; empty when the last page is locked. */
  questions?: string[];
  /** Signed in: the finished screen links to the dashboard, otherwise to sign-up. */
  loggedIn?: boolean;
};

type ProgressSave = { slug: string; childId: string; lastPageRead: number; completed: boolean };

/** Saves a child's reading progress. Never throws: a failed save only logs. */
export async function saveProgress(save: ProgressSave, fetcher: typeof fetch = fetch): Promise<boolean> {
  try {
    const res = await fetcher(`/api/stories/${save.slug}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: save.childId, lastPageRead: save.lastPageRead, completed: save.completed }),
    });
    return res.ok;
  } catch (err) {
    console.error("Story progress not saved:", err);
    return false;
  }
}

/**
 * Finish: the finished screen shows at once for everyone (signed out, no child
 * profile, or a save that fails). Progress is saved in the background, and
 * only when a child is selected.
 */
export function finishStory(opts: {
  slug: string;
  childId: string;
  pageCount: number;
  showFinished: () => void;
  save?: (save: ProgressSave) => Promise<unknown>;
}) {
  opts.showFinished();
  if (!opts.childId) return;
  const save = opts.save ?? saveProgress;
  void save({ slug: opts.slug, childId: opts.childId, lastPageRead: opts.pageCount, completed: true });
}

export function FinishedScreen({ title, locale, loggedIn }: { title: string; locale: Locale; loggedIn: boolean }) {
  const t = LABELS[locale];
  // The reader was scrolled down to the Finish button; this block is much
  // shorter, so on phones it would sit above the screen.
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "center" });
  }, []);
  return (
    <div ref={ref} className="text-center py-20">
      <UiIcon name="party" className="mx-auto mb-4 h-16 w-16 text-crayon-purple" />
      <h2 className="text-3xl font-extrabold text-crayon-green">{t.greatJob}</h2>
      <p className="mt-2 text-chalkboard/70">{t.finished(title)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link href={localizedPath(locale, "/stories")} className="rounded-block bg-blue-500 text-white px-6 py-3 font-bold">
          {t.more}
        </Link>
        {loggedIn ? (
          <Link href={localizedPath(locale, "/dashboard")} className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold">
            {t.dashboard}
          </Link>
        ) : (
          <Link href={localizedPath(locale, "/register")} className="rounded-block bg-crayon-green text-white px-6 py-3 font-bold">
            {t.signUp}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * What "Listen" plays on a page: its MP3 (public/audio/stories/v2, made by
 * scripts/stories/audio.ts), and on the first page the title (page 0) first,
 * as when a grown-up reads the cover. Each part keeps its text for the
 * browser's voice, used when a file is missing or can't play.
 */
export function narration(story: Pick<Story, "slug" | "title">, page: Pick<Page, "pageNumber" | "text">, locale: Locale): NarrationPart[] {
  const part = { url: storyAudioPath(locale, story.slug, page.pageNumber), text: page.text };
  if (page.pageNumber !== 1) return [part];
  const title = /[.!?…]$/.test(story.title) ? story.title : `${story.title}.`;
  return [{ url: storyAudioPath(locale, story.slug, 0), text: title }, part];
}

export default function StoryReader({ story, childProfiles, locale = "en", alt = [], questions = [], loggedIn = false }: Props) {
  const t = LABELS[locale];
  const [finished, setFinished] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedChild, setSelectedChild] = useState(childProfiles[0]?.id ?? "");

  const page = story.pages[pageIndex];
  const isLast = pageIndex === story.pages.length - 1;
  const isFirst = pageIndex === 0;

  function finish() {
    finishStory({
      slug: story.slug,
      childId: selectedChild,
      pageCount: story.pages.length,
      showFinished: () => setFinished(true),
    });
  }

  function goNext() {
    if (isLast) {
      finish();
      return;
    }
    const next = pageIndex + 1;
    setPageIndex(next);
    if (selectedChild) {
      void saveProgress({ slug: story.slug, childId: selectedChild, lastPageRead: next + 1, completed: false });
    }
  }

  function goPrev() {
    if (isFirst) return;
    setPageIndex(pageIndex - 1);
  }

  if (finished) {
    return <FinishedScreen title={story.title} locale={locale} loggedIn={loggedIn} />;
  }

  return (
    <div className="mt-6">
      {childProfiles.length > 0 && (
        <div className="mb-4">
          <label htmlFor="child" className="text-sm font-bold">
            {t.readingAs}
          </label>
          <select
            id="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="ml-2 rounded-block border border-chalkboard/20 px-3 py-1"
          >
            {childProfiles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-owl-ink/5 shadow-[0_24px_40px_-24px_rgba(29,24,70,.35)]">
        <StoryPicture
          src={page.imageUrl}
          alt={alt[page.pageNumber] ?? ""}
          sizes="(min-width: 768px) 720px, 100vw"
          priority={isFirst}
          endLabel={t.endLabel}
        />
        <div className="p-6 text-center sm:p-8">
          <p className="font-display text-2xl leading-snug sm:text-[28px]">{page.text}</p>
          <div className="mt-4 flex justify-center">
            <StoryAudio parts={narration(story, page, locale)} locale={locale} />
          </div>
        </div>
      </div>

      {isLast && questions.length > 0 && (
        <section className="mt-6 rounded-3xl bg-owl-mint p-6 sm:p-8">
          <h2 className="font-display text-xl font-extrabold">{t.talk}</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-lg">
            {questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Phones: the page count on its own line, the two buttons side by side under it. */}
      <div className="mt-6 grid grid-cols-2 items-center gap-3 sm:flex sm:justify-between">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="w-full rounded-block bg-crayon-blue px-4 py-3 font-bold text-white disabled:opacity-30 sm:w-auto sm:px-6"
        >
          {t.back}
        </button>

        <span className="order-first col-span-2 text-center text-sm text-chalkboard/60 sm:order-none">
          {t.page} {pageIndex + 1} {t.of} {story.pages.length}
        </span>

        {isLast ? (
          <button
            onClick={finish}
            className="w-full rounded-block bg-crayon-green px-4 py-3 font-bold text-white sm:w-auto sm:px-6"
          >
            {t.finish}
            <InlineIcon name="party" after />
          </button>
        ) : (
          <button
            onClick={goNext}
            className="w-full rounded-block bg-crayon-green px-4 py-3 font-bold text-white sm:w-auto sm:px-6"
          >
            {t.next}
          </button>
        )}
      </div>
    </div>
  );
}