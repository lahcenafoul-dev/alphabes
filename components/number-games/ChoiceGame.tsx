"use client";

// The four "tap the right answer" number games share this flow: a question
// read aloud, a picture or row to look at, a few big answers to tap. A right
// answer: chime, the owl hops, kind words and a Next button. A wrong one:
// the owl tilts, "try again" is said softly and that answer fades, so the
// child always gets there. A star only for a right answer on the first try.
// Ten rounds, then the end screen and "Play again".
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { useSpeech } from "@/components/ListenButton";
import type { OwlMood } from "@/components/home/Owl";
import { chime } from "@/lib/sounds";
import GameFrame, { EndScreen, Question, bigButton } from "./GameFrame";

export const ROUNDS = 10;

export type ChoiceView = {
  question: string;
  /** Read aloud when the round starts after a tap, and by the listen button. */
  spoken: string;
  /** What to look at above the answers; `solved` once the right answer is found. */
  stage?: (solved: boolean) => React.ReactNode;
  choices: { value: number; label: string; content: React.ReactNode }[];
  answer: number;
  /** Shown and said after the right answer. */
  right: string;
  /** Tailwind grid columns for the answers. */
  columns: string;
  /** Extra classes for each answer button (size, padding). */
  choiceClass: string;
};

type Status = "idle" | "right" | "wrong";

export default function ChoiceGame<R>({ newRound, view }: { newRound: (previous?: R) => R; view: (round: R) => ChoiceView }) {
  const t = useTranslations("NumberGames");
  const { say, notice } = useSpeech(useLocale() as Locale);
  const [round, setRound] = useState<R>(() => newRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [wrong, setWrong] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [reaction, setReaction] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const v = view(round);
  const solved = status === "right";

  function pick(value: number) {
    if (solved || wrong.includes(value)) return;
    clearTimeout(timer.current);
    setReaction((r) => r + 1);
    if (value === v.answer) {
      setStatus("right");
      if (!wrong.length) setScore((s) => s + 1);
      chime();
      void say(v.right);
    } else {
      setStatus("wrong");
      setWrong((w) => [...w, value]);
      void say(t("tryAgainSpoken"));
      // Back to the resting owl; nothing is counted down on screen.
      timer.current = setTimeout(() => setStatus("idle"), 1200);
    }
  }

  function next() {
    setWrong([]);
    setStatus("idle");
    if (roundNum >= ROUNDS) {
      setFinished(true);
      void say(t("finalTitle"));
      return;
    }
    const r = newRound(round);
    setRound(r);
    setRoundNum((n) => n + 1);
    void say(view(r).spoken);
  }

  function again() {
    const r = newRound();
    setRound(r);
    setRoundNum(1);
    setScore(0);
    setWrong([]);
    setStatus("idle");
    setFinished(false);
    void say(view(r).spoken);
  }

  const mood: OwlMood = status === "right" ? "happy" : status === "wrong" ? "sad" : "idle";

  return (
    <GameFrame
      mood={mood}
      reaction={reaction}
      progressLabel={t("roundLabel", { n: roundNum, total: ROUNDS })}
      done={roundNum - 1 + (solved ? 1 : 0)}
      total={ROUNDS}
      score={score}
      finished={finished}
    >
      {finished ? (
        <EndScreen title={t("finalTitle")} score={score} total={ROUNDS} onAgain={again} />
      ) : (
        <div key={roundNum} className="owl-slide-in">
          <Question text={v.question} onListen={() => void say(v.spoken)} />
          {v.stage && <div className="mb-4 flex justify-center sm:mb-5">{v.stage(solved)}</div>}
          <div className={`grid gap-2.5 sm:gap-3.5 ${v.columns}`}>
            {v.choices.map((c) => {
              const isRight = solved && c.value === v.answer;
              const isWrong = wrong.includes(c.value);
              const justWrong = isWrong && status === "wrong" && wrong[wrong.length - 1] === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => pick(c.value)}
                  aria-label={c.label}
                  aria-disabled={isWrong || solved ? true : undefined}
                  data-answer={c.value === v.answer ? "right" : "wrong"}
                  className={`flex min-h-[64px] min-w-0 flex-col items-center justify-center rounded-[22px] border-[3px] font-display font-extrabold text-owl-ink ${bigButton} ${
                    isRight
                      ? "owl-win border-owl-green bg-[#E3F8F0]"
                      : justWrong
                        ? "owl-shake border-owl-pink bg-[#FFEAF1]"
                        : isWrong
                          ? "border-owl-lilac bg-white opacity-40"
                          : solved
                            ? "border-owl-lilac bg-white opacity-60"
                            : "border-owl-lilac bg-white hover:-translate-y-1 hover:shadow-[0_14px_24px_-12px_rgba(29,24,70,.35)] active:translate-y-0.5"
                  } ${v.choiceClass}`}
                >
                  {c.content}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex min-h-[72px] items-center justify-center text-center sm:mt-5" aria-live="polite">
            {status === "right" && (
              <div className="owl-pop flex flex-wrap items-center justify-center gap-3.5" data-testid="round-right">
                <span className="font-display text-xl font-bold text-owl-green-dark sm:text-2xl">{v.right}</span>
                <button type="button" onClick={next} className={`owl-btn owl-btn-green min-h-[56px] ${bigButton}`}>
                  {t("next")}
                </button>
              </div>
            )}
            {status === "wrong" && <span className="owl-pop font-display text-xl font-bold text-[#C2185B] sm:text-[22px]">{t("tryAgain")}</span>}
            {status === "idle" && <span className="font-extrabold text-owl-muted">{t("hint")}</span>}
          </div>
        </div>
      )}
      {notice}
    </GameFrame>
  );
}
