"use client";

// The four number games built on ChoiceGame: count and tap, missing number,
// number match and bigger or smaller. Their rounds come from
// lib/number-games-logic.ts, their words from messages ("NumberGames").
import { useTranslations } from "next-intl";
import {
  compareAnswer,
  compareRound,
  countRound,
  matchRound,
  missingRound,
  type CompareRound,
  type CountRound,
  type MatchRound,
  type MissingRound,
} from "@/lib/number-games-logic";
import ChoiceGame from "./ChoiceGame";
import { Dots, Hands, PictureGroup } from "./pieces";

const numeral = "text-[44px] leading-none sm:text-[56px]";

export function CountGame() {
  const t = useTranslations("NumberGames");
  return (
    <ChoiceGame<CountRound>
      newRound={(prev) => countRound(Math.random, prev?.answer)}
      view={(r) => ({
        question: t("count.question"),
        spoken: t("count.spoken"),
        stage: () => (
          <div className="flex min-h-[132px] w-full items-center justify-center rounded-[22px] bg-owl-bg p-3 sm:min-h-[168px] sm:p-4">
            <PictureGroup n={r.answer} src={r.picture} alt={t("picture")} label={t("count.group")} />
          </div>
        ),
        choices: r.choices.map((n) => ({ value: n, label: t("number", { n }), content: <span className={numeral}>{n}</span> })),
        answer: r.answer,
        right: t("count.right", { n: r.answer }),
        columns: "grid-cols-3",
        choiceClass: "h-24 sm:h-28",
      })}
    />
  );
}

export function MissingNumberGame() {
  const t = useTranslations("NumberGames");
  return (
    <ChoiceGame<MissingRound>
      newRound={() => missingRound()}
      view={(r) => ({
        question: t("missing.question"),
        spoken: t("missing.spoken", { row: r.sequence.map((n) => n ?? t("missing.gap")).join(", ") }),
        stage: (solved) => (
          <ol aria-label={t("missing.row")} className="grid w-full max-w-[460px] grid-cols-5 gap-1.5 sm:gap-2.5">
            {r.sequence.map((n, i) => (
              <li
                key={i}
                aria-label={n === null ? (solved ? String(r.answer) : t("missing.gapLabel")) : undefined}
                className={`flex aspect-square items-center justify-center rounded-2xl font-display text-[30px] font-extrabold sm:text-[40px] ${
                  n === null
                    ? solved
                      ? "owl-pop bg-owl-green text-white"
                      : "border-[3px] border-dashed border-owl-purple bg-owl-lilac text-owl-purple"
                    : "bg-owl-cream text-owl-ink"
                }`}
              >
                {n ?? (solved ? r.answer : "?")}
              </li>
            ))}
          </ol>
        ),
        choices: r.choices.map((n) => ({ value: n, label: t("number", { n }), content: <span className={numeral}>{n}</span> })),
        answer: r.answer,
        right: t("missing.right", { n: r.answer }),
        columns: "grid-cols-3",
        choiceClass: "h-24 sm:h-28",
      })}
    />
  );
}

export function NumberMatchGame() {
  const t = useTranslations("NumberGames");
  return (
    <ChoiceGame<MatchRound>
      newRound={(prev) => matchRound(Math.random, prev?.answer)}
      view={(r) => ({
        question: t("match.question", { n: r.answer }),
        spoken: r.style === "dots" ? t("match.spokenDots", { n: r.answer }) : t("match.spokenFingers", { n: r.answer }),
        stage: () => (
          <span className="flex h-24 w-24 items-center justify-center rounded-[26px] bg-owl-purple font-display text-[60px] font-extrabold leading-none text-white shadow-[0_6px_0_#4428C9] sm:h-28 sm:w-28 sm:text-[72px]">
            {r.answer}
          </span>
        ),
        choices: r.choices.map((n) => ({
          value: n,
          label: r.style === "dots" ? t("match.dots", { n }) : t("match.fingers", { n }),
          content: r.style === "dots" ? <Dots n={n} /> : <Hands n={n} />,
        })),
        answer: r.answer,
        right: t("match.right", { n: r.answer }),
        columns: "grid-cols-3",
        choiceClass: "h-28 px-1.5 sm:h-32 sm:px-3",
      })}
    />
  );
}

export function CompareGame() {
  const t = useTranslations("NumberGames");
  return (
    <ChoiceGame<CompareRound>
      newRound={() => compareRound()}
      view={(r) => {
        const answer = compareAnswer(r);
        const other = answer === r.left ? r.right : r.left;
        return {
          question: r.ask === "bigger" ? t("compare.bigger") : t("compare.smaller"),
          spoken: r.ask === "bigger" ? t("compare.bigger") : t("compare.smaller"),
          choices: [
            [r.left, r.pictures[0]] as const,
            [r.right, r.pictures[1]] as const,
          ].map(([n, src]) => ({
            value: n,
            label: t("number", { n }),
            content: (
              <>
                <span className="text-[52px] leading-none text-owl-purple sm:text-[64px]">{n}</span>
                <span className="mt-2 flex min-h-[88px] items-center sm:min-h-[120px]">
                  <PictureGroup n={n} src={src} alt="" size="sm" />
                </span>
              </>
            ),
          })),
          answer,
          right: r.ask === "bigger" ? t("compare.rightBigger", { a: answer, b: other }) : t("compare.rightSmaller", { a: answer, b: other }),
          columns: "grid-cols-2",
          choiceClass: "px-2 py-4 sm:px-4",
        };
      }}
    />
  );
}
