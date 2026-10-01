"use client";

import { useState } from "react";
import { useFrenchSpeech } from "@/components/ListenButton";
import { firstSoundRound } from "@/lib/games-fr";
import type { FrenchLetter } from "@/lib/letters-fr";
import { EndScreen, FeedbackLine, ScoreBar, choiceClass, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

// The picture's name isn't written: the child must listen, not read.
export default function PremierSon() {
  const { say, notice } = useFrenchSpeech();
  const [round, setRound] = useState(() => firstSoundRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const listen = () => void say(round.word.word, 0.75);

  function pick(letter: FrenchLetter) {
    if (busy) return;
    const { word, answer } = round;
    if (letter === answer) {
      if (!missed) setScore((s) => s + 1);
      setFeedback({ ok: true, text: `Bravo ! « ${word.word} » commence par ${answer.lower}.` });
      void say(`Bravo ! ${word.word} commence par ${answer.nameSpoken}.`, 0.85);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setFeedback(null);
        setMissed(false);
        if (roundNum >= TOTAL) {
          setFinished(true);
          return;
        }
        setRound(firstSoundRound());
        setRoundNum((n) => n + 1);
      }, 1800);
    } else {
      setMissed(true);
      setFeedback({ ok: false, text: "Pas tout à fait. Écoute encore le début du mot !" });
      void say(word.word, 0.7);
    }
  }

  function again() {
    setRound(firstSoundRound());
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

      <div className="mt-6 text-center">
        <div
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-crayon-yellow/25 text-7xl"
          role="img"
          aria-label="Image à nommer"
        >
          {round.word.emoji}
        </div>
        <button type="button" onClick={listen} className={`${listenClass} mt-4`}>
          🔊 Écouter le mot
        </button>
        <p className="mt-4 text-lg font-display font-bold">Quel son entends-tu au début du mot ?</p>
      </div>

      <FeedbackLine feedback={feedback} className="mt-2 text-center" />

      <div className="mt-2 grid grid-cols-4 gap-4 max-w-md mx-auto">
        {round.choices.map((letter) => (
          <button key={letter.slug} type="button" onClick={() => pick(letter)} aria-label={`Lettre ${letter.lower}`} className={choiceClass}>
            {letter.lower}
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}
