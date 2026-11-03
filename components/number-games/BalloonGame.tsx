"use client";

// Pop the balloons in order, 1 → 10. Each pop makes a soft sound and says
// the number; a balloon tapped out of turn only wobbles while the owl says
// which number to find. No timer: the balloons wait.
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { useSpeech } from "@/components/ListenButton";
import type { OwlMood } from "@/components/home/Owl";
import { BALLOON_COUNT, balloonRound, nextBalloon, type Balloon } from "@/lib/number-games-logic";
import { chime, pop } from "@/lib/sounds";
import GameFrame, { EndScreen, Question, bigButton } from "./GameFrame";

function BalloonShape({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 84" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M30 62 C30 70 26 74 30 84" fill="none" stroke="#1D1846" strokeOpacity={0.45} strokeWidth={1.6} />
      <ellipse cx="30" cy="30" rx="26" ry="30" fill={color} />
      <path d="M26 59 L34 59 L30 64 Z" fill={color} />
      <ellipse cx="20" cy="18" rx="6" ry="9" fill="#fff" opacity={0.35} transform="rotate(-25 20 18)" />
    </svg>
  );
}

export default function BalloonGame() {
  const t = useTranslations("NumberGames");
  const { say, notice } = useSpeech(useLocale() as Locale);
  const [balloons, setBalloons] = useState<Balloon[]>(() => balloonRound());
  const [popped, setPopped] = useState<number[]>([]);
  const [wobble, setWobble] = useState<{ n: number; key: number } | null>(null);
  const [mood, setMood] = useState<OwlMood>("idle");
  const [reaction, setReaction] = useState(0);

  const target = nextBalloon(popped);
  const finished = target === null;

  function tap(b: Balloon) {
    if (finished || popped.includes(b.n)) return;
    setReaction((r) => r + 1);
    if (b.n === target) {
      const now = [...popped, b.n];
      setPopped(now);
      setWobble(null);
      setMood("happy");
      pop();
      if (now.length === BALLOON_COUNT) {
        chime();
        void say(`${b.n}! ${t("balloons.done")}`);
      } else {
        void say(String(b.n));
      }
    } else {
      setMood("sad");
      setWobble({ n: b.n, key: Date.now() });
      void say(t("balloons.wrong", { m: b.n, n: target }));
    }
  }

  function again() {
    setBalloons(balloonRound());
    setPopped([]);
    setWobble(null);
    setMood("idle");
    void say(t("balloons.spoken"));
  }

  return (
    <GameFrame
      mood={mood}
      reaction={reaction}
      progressLabel={target ? t("balloons.find", { n: target }) : ""}
      done={popped.length}
      total={BALLOON_COUNT}
      score={null}
      finished={finished}
    >
      {finished ? (
        <EndScreen title={t("balloons.done")} onAgain={again} />
      ) : (
        <div>
          <Question text={t("balloons.question")} onListen={() => void say(`${t("balloons.spoken")} ${popped.length ? t("balloons.find", { n: target! }) : ""}`)} />
          <ul
            aria-label={t("balloons.field")}
            className="grid grid-cols-4 gap-x-2 gap-y-3 rounded-[22px] bg-gradient-to-b from-[#E6F1FF] to-owl-bg px-2 py-4 sm:grid-cols-5 sm:gap-x-4 sm:gap-y-5 sm:px-5 sm:py-6"
          >
            {balloons.map((b) => {
              const gone = popped.includes(b.n);
              return (
                <li key={b.n} className="flex justify-center" style={{ transform: `translate(${b.dx}%, ${b.dy}px)` }}>
                  {gone ? (
                    <span aria-hidden="true" className="owl-pop flex h-[88px] w-[64px] items-center justify-center sm:h-[104px] sm:w-[76px]">
                      <svg viewBox="0 0 40 40" className="h-10 w-10">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                          <path key={a} d="M20 4 L20 12" stroke={b.color} strokeWidth={3} strokeLinecap="round" transform={`rotate(${a} 20 20)`} />
                        ))}
                      </svg>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => tap(b)}
                      aria-label={t("balloons.balloon", { n: b.n })}
                      data-balloon={b.n}
                      className={`relative h-[88px] w-[64px] rounded-[30px] hover:-translate-y-1 active:scale-95 sm:h-[104px] sm:w-[76px] ${bigButton}`}
                    >
                      {/* Keyed so the wobble plays again on every wrong tap. */}
                      <span key={wobble?.n === b.n ? wobble.key : 0} className={`absolute inset-0 flex items-center justify-center ${wobble?.n === b.n ? "owl-tilt" : ""}`}>
                        <BalloonShape color={b.color} />
                        <span className="relative -mt-4 block font-display text-[30px] font-extrabold leading-none text-white [text-shadow:0_2px_0_rgba(29,24,70,.35)] sm:text-[36px]">
                          {b.n}
                        </span>
                      </span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 min-h-[36px] text-center font-display text-xl font-bold sm:text-2xl" aria-live="polite">
            {wobble ? (
              <span className="text-[#C2185B]">{t("balloons.wrong", { m: wobble.n, n: target! })}</span>
            ) : (
              <span className="text-owl-purple">{t("balloons.find", { n: target! })}</span>
            )}
          </p>
        </div>
      )}
      {notice}
    </GameFrame>
  );
}
