"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import { firstSyllableRound, plain, syllablesOf } from "@/lib/jogos-pt";
import { EndScreen, FeedbackLine, ScoreBar, choiceClass, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

// The picture's name isn't written: the child listens to the word, then
// reads the syllables to choose.
export default function SilabaInicial() {
  const { say, notice } = useSpeech("pt");
  const [round, setRound] = useState(() => firstSyllableRound());
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [busy, setBusy] = useState(false);
  const [finished, setFinished] = useState(false);

  const name = plain(round.word.word);
  const listen = () => void say(name, 0.75);

  function pick(syllable: string) {
    if (busy) return;
    const { answer } = round;
    if (syllable === answer) {
      if (!missed) setScore((s) => s + 1);
      setFeedback({ ok: true, text: `Muito bem! “${name}” começa com “${answer}”.` });
      void say(`Muito bem! ${syllablesOf(round.word.word).join(", ")}. ${name} começa com ${answer}.`, 0.8);
      setBusy(true);
      setTimeout(() => {
        setBusy(false);
        setFeedback(null);
        setMissed(false);
        if (roundNum >= TOTAL) {
          setFinished(true);
          return;
        }
        setRound(firstSyllableRound());
        setRoundNum((n) => n + 1);
      }, 2200);
    } else {
      setMissed(true);
      setFeedback({ ok: false, text: `Essa é “${syllable}”. Ouça de novo o começo da palavra.` });
      void say(`${syllable}. Ouça de novo: ${name}.`, 0.7);
    }
  }

  function again() {
    setRound(firstSyllableRound());
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
          aria-label="Figura para dizer o nome"
        >
          {round.word.emoji}
        </div>
        <button type="button" onClick={listen} className={`${listenClass} mt-4`}>
          🔊 Ouvir a palavra
        </button>
        <p className="mt-4 text-lg font-display font-bold">Com que sílaba começa a palavra?</p>
      </div>

      <FeedbackLine feedback={feedback} className="mt-2 text-center" />

      <div className="mt-2 grid grid-cols-4 gap-4 max-w-md mx-auto">
        {round.choices.map((syllable) => (
          <button key={syllable} type="button" onClick={() => pick(syllable)} aria-label={`Sílaba ${syllable}`} className={choiceClass}>
            {syllable}
          </button>
        ))}
      </div>
      {notice}
    </div>
  );
}
