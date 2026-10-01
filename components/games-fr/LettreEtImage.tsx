"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { letterPictureRound } from "@/lib/games-fr";
import type { FrenchWord } from "@/lib/letters-fr";
import { EndScreen, FeedbackLine, ScoreBar, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

export default function LettreEtImage() {
  const { say, notice } = useFrenchSpeech();
  const [round, setRound] = useState(() => letterPictureRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const { letter } = round;

  function pick(word: FrenchWord) {
    if (busy) return;
    if (word === round.answer) {
      if (!missed) setScore((s) => s + 1);
      setFeedback({ ok: true, text: `Oui ! ${capitalize(word.word)} commence par ${letter.upper}.` });
      void say(`Oui ! ${word.withArticle}.`, 0.85);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setFeedback(null);
        setMissed(false);
        if (roundNum >= TOTAL) {
          setFinished(true);
          return;
        }
        setRound(letterPictureRound());
        setRoundNum((n) => n + 1);
      }, 1500);
    } else {
      setMissed(true);
      setFeedback({ ok: false, text: `Ça, c'est ${word.withArticle}. Essaie encore !` });
      void say(`Ça, c'est ${word.withArticle}.`, 0.85);
    }
  }

  function again() {
    setRound(letterPictureRound());
    setRoundNum(1);
    setScore(0);
    setMissed(false);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) return <EndScreen score={score} total={TOTAL} onAgain={again} />;

  return (
    <div>
      <ScoreBar round={roundNum} total={TOTAL} score={score} />

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <span className="letter-block bg-crayon-blue inline-flex h-20 min-w-20 px-3 text-4xl" aria-hidden="true">
          {letter.upper} {letter.lower}
        </span>
        <div>
          <p className="text-lg font-display font-bold">Quelle image commence par la lettre {letter.upper} ?</p>
          <button
            type="button"
            onClick={() => void say(`Quelle image commence par la lettre ${letter.nameSpoken} ?`, 0.85)}
            className={`${listenClass} mt-2`}
          >
            🔊 Écouter
          </button>
        </div>
      </div>

      <FeedbackLine feedback={feedback} className="mt-4 text-center" />

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {round.choices.map((word) => (
          <button
            key={word.word}
            type="button"
            onClick={() => pick(word)}
            aria-label={word.withArticle}
            className="rounded-block border-2 border-chalkboard/10 bg-paper p-4 text-center shadow-block hover:border-crayon-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-crayon-blue"
          >
            <span className="block text-6xl leading-none" aria-hidden="true">
              {word.emoji}
            </span>
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
