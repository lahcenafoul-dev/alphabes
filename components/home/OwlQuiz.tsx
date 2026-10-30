"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";
import type { QuizRound } from "@/lib/home-quiz";
import { speakIn, warmUpVoices } from "@/lib/speech";
import Owl, { type OwlMood } from "./Owl";

/** The quiz's words in one language; {n}, {total}, {letter} and {word} are filled in. */
export type QuizCopy = {
  label: string;
  question: string;
  roundLabel: string;
  allDone: string;
  stars: string;
  hearLetter: string;
  hint: string;
  right: string;
  next: string;
  wrong: string;
  tryAgainSpoken: string;
  finalTitle: string;
  playAgain: string;
};

type Status = "idle" | "right" | "wrong";

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

const CONFETTI = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot, i) => ({
  rot,
  delay: `${(i % 3) * 0.12}s`,
  color: ["#6A4CFF", "#FFB020", "#FF5C93", "#18A97F"][i % 4],
}));

// Six rounds of "which picture starts with this letter?" with the owl
// reacting. A star only for a right answer on the first try.
export default function OwlQuiz({ locale, rounds, copy }: { locale: Locale; rounds: QuizRound[]; copy: QuizCopy }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [missed, setMissed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  // Changes on every pick, so the owl's hop or tilt plays again.
  const [reaction, setReaction] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    warmUpVoices();
    return () => clearTimeout(timer.current);
  }, []);

  const total = rounds.length;
  const current = rounds[round];
  const say = (text: string) => void speakIn(locale, text);

  function pick(i: number) {
    if (status === "right" || done) return;
    clearTimeout(timer.current);
    setPicked(i);
    setReaction((r) => r + 1);
    if (i === current.answer) {
      setStatus("right");
      if (!missed) setScore((s) => s + 1);
      say(fill(copy.right, { word: current.options[i].word, letter: current.letter }));
    } else {
      setStatus("wrong");
      setMissed(true);
      say(copy.tryAgainSpoken);
      timer.current = setTimeout(() => {
        setStatus("idle");
        setPicked(null);
      }, 900);
    }
  }

  function next() {
    setPicked(null);
    setStatus("idle");
    setMissed(false);
    if (round + 1 >= total) setDone(true);
    else setRound(round + 1);
  }

  function restart() {
    setRound(0);
    setPicked(null);
    setStatus("idle");
    setMissed(false);
    setScore(0);
    setDone(false);
  }

  const mood: OwlMood = done || status === "right" ? "happy" : status === "wrong" ? "sad" : "idle";
  const doneCount = done ? total : round + (status === "right" ? 1 : 0);

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[560px] pt-[76px] sm:pt-[92px]">
      <div className="absolute right-6 top-0 z-10 w-[120px] sm:right-10 sm:w-[150px]">
        <Owl key={`${mood}-${reaction}`} mood={mood} />
      </div>

      <section
        aria-label={copy.label}
        className="relative rounded-[28px] bg-white p-4 shadow-[0_40px_80px_-30px_rgba(29,24,70,.35),0_0_0_1px_rgba(29,24,70,.06)] sm:rounded-[36px] sm:p-[30px]"
      >
        <div className="mb-5 flex items-center gap-3 sm:mb-[22px] sm:gap-3.5">
          <span className="whitespace-nowrap text-sm font-extrabold text-owl-muted">
            {done ? copy.allDone : fill(copy.roundLabel, { n: round + 1, total })}
          </span>
          <div className="h-3 flex-auto overflow-hidden rounded-full bg-owl-lilac" aria-hidden="true">
            <div
              className="h-full rounded-full bg-owl-green transition-[width] duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ width: `${Math.round((doneCount / total) * 100)}%` }}
            />
          </div>
          <span className="flex items-center gap-1 text-[15px] font-extrabold">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 17l-5.6 3.5L8 13.7 3 9.3l6.4-.7z" fill="#FFB020" />
            </svg>
            <span className="sr-only">{fill(copy.stars, { score })}</span>
            <span aria-hidden="true">{score}</span>
          </span>
        </div>

        {!done && (
          <div key={round} className="owl-slide-in">
            <div className="mb-5 flex items-center justify-between gap-4 sm:mb-[22px]">
              <p className="m-0 font-display text-[22px] font-bold leading-[1.15] sm:text-[28px]">{copy.question}</p>
              <button
                type="button"
                onClick={() => say(current.spoken)}
                aria-label={fill(copy.hearLetter, { letter: current.letter })}
                className="h-[76px] w-[76px] flex-none rounded-[24px] bg-owl-purple font-display text-[48px] font-extrabold leading-none text-white shadow-[0_6px_0_#4428C9] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-[3px] sm:h-[92px] sm:w-[92px] sm:rounded-[28px] sm:text-[60px]"
              >
                {current.letter}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              {current.options.map((option, i) => {
                const chosen = picked === i;
                const right = chosen && status === "right";
                const wrong = chosen && status === "wrong";
                return (
                  <button
                    key={option.picture}
                    type="button"
                    onClick={() => pick(i)}
                    aria-disabled={status === "right" ? true : undefined}
                    className={`flex min-w-0 flex-col items-center gap-1.5 rounded-[20px] border-[3px] px-1.5 pb-2.5 pt-2.5 font-display text-base font-bold text-owl-ink transition-[transform,box-shadow] duration-150 sm:rounded-[24px] sm:px-2 sm:pb-3 sm:pt-3.5 sm:text-xl ${
                      right
                        ? "owl-win border-owl-green bg-[#E3F8F0]"
                        : wrong
                          ? "owl-shake border-owl-pink bg-[#FFEAF1]"
                          : "border-owl-lilac bg-white hover:-translate-y-1 hover:shadow-[0_14px_24px_-12px_rgba(29,24,70,.35)]"
                    }`}
                  >
                    {/* A plain <img>: next/image's optimizer doesn't run on Cloudflare Workers (see WordIllustration). */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/words/${option.picture}.webp`}
                      alt=""
                      width={96}
                      height={96}
                      decoding="async"
                      className="aspect-square h-[72px] w-[72px] object-contain mix-blend-multiply sm:h-24 sm:w-24"
                    />
                    <span className="max-w-full break-words leading-tight">{option.word}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex min-h-[72px] items-center justify-center text-center sm:mt-[18px]" aria-live="polite">
              {status === "right" && (
                <div className="owl-pop flex flex-wrap items-center justify-center gap-3.5">
                  <span className="font-display text-xl font-bold text-owl-green-dark sm:text-2xl">
                    {fill(copy.right, { word: current.options[current.answer].word, letter: current.letter })}
                  </span>
                  <button type="button" onClick={next} className="owl-btn owl-btn-green">
                    {copy.next}
                  </button>
                </div>
              )}
              {status === "wrong" && (
                <span className="owl-pop font-display text-xl font-bold text-[#C2185B] sm:text-[22px]">{copy.wrong}</span>
              )}
              {status === "idle" && <span className="font-extrabold text-owl-muted">{copy.hint}</span>}
            </div>
          </div>
        )}

        {done && (
          <div className="owl-pop relative pb-2 pt-6 text-center" aria-live="polite">
            <div aria-hidden="true" className="absolute left-1/2 top-[70px]">
              {CONFETTI.map((p) => (
                <span key={p.rot} className="absolute left-0 top-0" style={{ transform: `rotate(${p.rot}deg)` }}>
                  <span
                    className="owl-piece h-3 w-3 rounded-[3px]"
                    style={{ background: p.color, animationDelay: p.delay }}
                  />
                </span>
              ))}
            </div>
            <p className="m-0 font-display text-[56px] font-extrabold leading-none text-owl-purple sm:text-[64px]">
              {score} / {total}
            </p>
            <p className="mb-6 mt-3 font-display text-2xl font-bold sm:text-[28px]">{copy.finalTitle}</p>
            <button type="button" onClick={restart} className="owl-btn owl-btn-purple px-8 py-4 text-[22px]">
              {copy.playAgain}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
