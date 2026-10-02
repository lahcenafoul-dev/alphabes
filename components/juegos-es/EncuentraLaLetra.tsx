"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import { ALPHABET, findLetterRound } from "@/lib/juegos-es";
import { EndScreen, FeedbackLine, ScoreBar, choiceClass, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

type Case = "mayusculas" | "minusculas";

export default function EncuentraLaLetra() {
  const { say, notice } = useSpeech("es");
  const [letterCase, setLetterCase] = useState<Case>("mayusculas");
  const [round, setRound] = useState(() => findLetterRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const letterOf = (slug: string) => ALPHABET.find((x) => x.slug === slug)!;
  const show = (slug: string) => (letterCase === "mayusculas" ? letterOf(slug).upper : letterOf(slug).lower);
  const ask = (nameSpoken: string) => void say(`Encuentra la letra ${nameSpoken}.`, 0.85);

  function pick(slug: string) {
    if (busy) return;
    if (slug === round.letter.slug) {
      if (!missed) setScore((s) => s + 1);
      setFeedback({ ok: true, text: `¡Muy bien, es la ${show(slug)}!` });
      void say("¡Muy bien!", 0.9);
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
      setMissed(true);
      setFeedback({ ok: false, text: `Esa es la ${show(slug)}. ¡Sigue buscando!` });
      void say(`Esa es la ${letterOf(slug).nameSpoken}.`, 0.85);
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
        <div role="group" aria-label="Tipo de letra" className="inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {(["mayusculas", "minusculas"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={letterCase === c}
              onClick={() => setLetterCase(c)}
              className={`rounded-full px-4 py-1.5 ${letterCase === c ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {c === "mayusculas" ? "MAYÚSCULAS" : "minúsculas"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <p className="text-xl font-display font-bold">
          Encuentra la letra{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-14 w-14 text-3xl align-middle">{show(round.letter.slug)}</span>
        </p>
        <button type="button" onClick={() => ask(round.letter.nameSpoken)} className={listenClass} aria-label="Escuchar la letra que hay que encontrar">
          🔊 Escuchar
        </button>
      </div>

      <FeedbackLine feedback={feedback} className="mt-4 text-center" />

      <div className="mt-2 grid grid-cols-4 gap-3 max-w-md mx-auto">
        {round.grid.map((slug, i) => (
          <button key={`${slug}-${i}`} type="button" onClick={() => pick(slug)} aria-label={`Letra ${show(slug)}`} className={choiceClass}>
            {show(slug)}
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}
