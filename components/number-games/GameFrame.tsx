"use client";

// The frame of every number game, in the home page quiz's owl style
// (components/home/OwlQuiz.tsx): the owl reacting above the card, the round
// and a progress bar, the stars, and the end screen with confetti and
// "Play again". No timer anywhere: children play at their own pace.
import { useTranslations } from "next-intl";
import Owl, { type OwlMood } from "@/components/home/Owl";

const CONFETTI = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot, i) => ({
  rot,
  delay: `${(i % 3) * 0.12}s`,
  color: ["#6A4CFF", "#FFB020", "#FF5C93", "#18A97F"][i % 4],
}));

export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[70px]">
      {CONFETTI.map((p) => (
        <span key={p.rot} className="absolute left-0 top-0" style={{ transform: `rotate(${p.rot}deg)` }}>
          <span className="owl-piece h-3 w-3 rounded-[3px]" style={{ background: p.color, animationDelay: p.delay }} />
        </span>
      ))}
    </div>
  );
}

export const bigButton =
  "touch-manipulation select-none transition-[transform,box-shadow,opacity] duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-owl-purple";

export default function GameFrame({
  mood,
  reaction,
  progressLabel,
  done,
  total,
  score,
  finished,
  children,
}: {
  mood: OwlMood;
  /** Changes on every tap, so the owl's hop or tilt plays again. */
  reaction: number;
  progressLabel: string;
  done: number;
  total: number;
  /** Stars: right answers on the first try (null hides them). */
  score: number | null;
  finished: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("NumberGames");
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[640px] pt-[70px] sm:pt-[86px]">
      <div className="absolute right-4 top-0 z-10 w-[110px] sm:right-10 sm:w-[140px]">
        <Owl key={`${mood}-${reaction}`} mood={finished ? "happy" : mood} />
      </div>
      <section
        aria-label={t("label")}
        className="relative rounded-[28px] bg-white p-4 text-owl-ink shadow-[0_40px_80px_-30px_rgba(29,24,70,.35),0_0_0_1px_rgba(29,24,70,.06)] sm:rounded-[36px] sm:p-7"
      >
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <span className="whitespace-nowrap text-sm font-extrabold text-owl-muted">{finished ? t("allDone") : progressLabel}</span>
          <div className="h-3 flex-auto overflow-hidden rounded-full bg-owl-lilac" aria-hidden="true">
            <div
              className="h-full rounded-full bg-owl-green transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ width: `${Math.round(((finished ? total : done) / total) * 100)}%` }}
            />
          </div>
          {score !== null && (
            <span className="flex items-center gap-1 text-[15px] font-extrabold">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 17l-5.6 3.5L8 13.7 3 9.3l6.4-.7z" fill="#FFB020" />
              </svg>
              <span className="sr-only">{t("stars", { score })}</span>
              <span aria-hidden="true">{score}</span>
            </span>
          )}
        </div>
        {children}
      </section>
    </div>
  );
}

/** The end screen: confetti, the score (if any), a kind word whatever it is, and "Play again". */
export function EndScreen({ title, score, total, onAgain }: { title: string; score?: number; total?: number; onAgain: () => void }) {
  const t = useTranslations("NumberGames");
  return (
    <div className="owl-pop relative pb-2 pt-6 text-center" aria-live="polite" data-testid="game-finished">
      <Confetti />
      {score !== undefined && (
        <p className="m-0 font-display text-[56px] font-extrabold leading-none text-owl-purple sm:text-[64px]">
          {score} / {total}
        </p>
      )}
      <p className="mb-6 mt-3 font-display text-2xl font-bold sm:text-[28px]">{title}</p>
      <button type="button" onClick={onAgain} className={`owl-btn owl-btn-purple min-h-[56px] px-8 py-4 text-[22px] ${bigButton}`}>
        {t("playAgain")}
      </button>
    </div>
  );
}

/** The round's question with a big "listen" button that reads it aloud. */
export function Question({ text, onListen }: { text: string; onListen: () => void }) {
  const t = useTranslations("NumberGames");
  return (
    <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
      <p className="m-0 font-display text-[22px] font-bold leading-[1.15] sm:text-[28px]">{text}</p>
      <button
        type="button"
        onClick={onListen}
        aria-label={t("listenAgain")}
        title={t("listen")}
        className={`flex h-14 w-14 flex-none items-center justify-center rounded-[20px] bg-owl-purple text-white shadow-[0_5px_0_#4428C9] hover:-translate-y-0.5 active:translate-y-[3px] sm:h-16 sm:w-16 ${bigButton}`}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
          <path d="M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
