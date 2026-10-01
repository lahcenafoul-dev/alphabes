"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { ALPHABET, findLetterRound } from "@/lib/games-fr";
import { EndScreen, FeedbackLine, ScoreBar, choiceClass, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

type Case = "capitales" | "minuscules";

export default function TrouveLaLettre() {
  const { say, notice } = useFrenchSpeech();
  const [letterCase, setLetterCase] = useState<Case>("capitales");
  const [round, setRound] = useState(() => findLetterRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const show = (slug: string) => {
    const l = ALPHABET.find((x) => x.slug === slug)!;
    return letterCase === "capitales" ? l.upper : l.lower;
  };
  const ask = (nameSpoken: string) => void say(`Trouve la lettre ${nameSpoken}.`, 0.85);

  function pick(slug: string) {
    if (busy) return;
    if (slug === round.letter.slug) {
      if (!missed) setScore((s) => s + 1);
      setFeedback({ ok: true, text: `Bravo, c'est bien le ${show(slug)} !` });
      void say("Bravo !", 0.9);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setFeedback(null);
        setMissed(false);
        if (roundNum >= TOTAL) {
          setFinished(true);
          return;
        }
        const next = findLetterRound();
        setRound(next);
        setRoundNum((n) => n + 1);
        ask(next.letter.nameSpoken);
      }, 1200);
    } else {
      const tapped = ALPHABET.find((x) => x.slug === slug)!;
      setMissed(true);
      setFeedback({ ok: false, text: `Ça, c'est le ${show(slug)}. Cherche encore !` });
      void say(`Ça, c'est le ${tapped.nameSpoken}.`, 0.85);
    }
  }

  function again() {
    setRound(findLetterRound());
    setRoundNum(1);
    setScore(0);
    setMissed(false);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) return <EndScreen score={score} total={TOTAL} onAgain={again} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ScoreBar round={roundNum} total={TOTAL} score={score} />
        <div role="group" aria-label="Écriture des lettres" className="inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {(["capitales", "minuscules"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={letterCase === c}
              onClick={() => setLetterCase(c)}
              className={`rounded-full px-4 py-1.5 ${letterCase === c ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {c === "capitales" ? "CAPITALES" : "minuscules"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <p className="text-xl font-display font-bold">
          Trouve la lettre{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-14 w-14 text-3xl align-middle">{show(round.letter.slug)}</span>
        </p>
        <button type="button" onClick={() => ask(round.letter.nameSpoken)} className={listenClass} aria-label="Écouter la lettre à trouver">
          🔊 Écouter
        </button>
      </div>

      <FeedbackLine feedback={feedback} className="mt-4 text-center" />

      <div className="mt-2 grid grid-cols-4 gap-3 max-w-md mx-auto">
        {round.grid.map((slug, i) => (
          <button key={`${slug}-${i}`} type="button" onClick={() => pick(slug)} aria-label={`Lettre ${show(slug)}`} className={choiceClass}>
            {show(slug)}
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}
