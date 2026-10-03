"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import { clapWords, plain, syllablesOf } from "@/lib/jogos-pt";
import { EndScreen, FeedbackLine, ScoreBar, listenClass, type Feedback } from "./ui";

const TOTAL = 10;

// "Bata palmas": the child hears a word, claps once per syllable and says how
// many claps. The word is written, but the answer only shows its syllables
// in colour, then reads them.
export default function BataPalmas() {
  const { say, notice } = useSpeech("pt");
  const [words, setWords] = useState(() => clapWords(TOTAL));
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [finished, setFinished] = useState(false);

  const word = words[roundNum - 1];
  const parts = syllablesOf(word.word);
  const name = plain(word.word);
  const bySyllables = () => void say(`${parts.join(", ")}. ${name}`, 0.6);

  function choose(n: number) {
    if (solved) return;
    if (n === parts.length) {
      if (!missed) setScore((s) => s + 1);
      setSolved(true);
      setFeedback({ ok: true, text: `Isso! ${capitalize(name)} tem ${n} ${n === 1 ? "sílaba" : "sílabas"}.` });
      void say(`Isso! ${parts.join(", ")}. ${n === 1 ? "Uma sílaba" : `${n} sílabas`}.`, 0.7);
    } else {
      setMissed(true);
      setFeedback({ ok: false, text: "Quase. Ouça de novo e bata uma palma para cada sílaba." });
      bySyllables();
    }
  }

  function next() {
    setSolved(false);
    setMissed(false);
    setFeedback(null);
    if (roundNum >= TOTAL) {
      setFinished(true);
      return;
    }
    setRoundNum((n) => n + 1);
  }

  function again() {
    setWords(clapWords(TOTAL));
    setRoundNum(1);
    setScore(0);
    setMissed(false);
    setSolved(false);
    setFeedback(null);
    setFinished(false);
  }

  if (finished) return <EndScreen score={score} total={TOTAL} onAgain={again} />;

  return (
    <div>
      <ScoreBar round={roundNum} total={TOTAL} score={score} />

      <div className="mt-6 text-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-crayon-yellow/25 text-7xl" role="img" aria-label={name}>
          {word.emoji}
        </div>
        <p className="mt-4 font-display font-extrabold text-3xl" aria-live="polite">
          {solved
            ? parts.map((p, i) => (
                <span key={i} className={i % 2 ? "text-[#C8323A]" : "text-[#1D6FC2]"}>
                  {p}
                  {i < parts.length - 1 && <span className="text-chalkboard/30">-</span>}
                </span>
              ))
            : name}
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => void say(name, 0.75)} className={listenClass}>
            🔊 Ouvir
          </button>
          <button
            type="button"
            onClick={bySyllables}
            className="rounded-block border-2 border-chalkboard/20 px-5 py-2.5 font-display font-bold hover:border-crayon-blue transition"
          >
            👏 Ouvir por sílabas
          </button>
        </div>
      </div>

      {/* The five counts stay on one row and shrink with the screen (44 px at 320 px wide). */}
      <fieldset className="mt-6 text-center">
        <legend className="mx-auto text-lg font-display font-bold">Quantas palmas? Quantas sílabas ela tem?</legend>
        <div className="mt-3 flex justify-center gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => choose(n)}
              aria-label={n === 1 ? "1 sílaba" : `${n} sílabas`}
              className="letter-block bg-wood aspect-square min-w-0 flex-1 max-w-16 text-2xl sm:text-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue"
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      <FeedbackLine feedback={feedback} className="mt-4 text-center" />

      {solved && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={next}
            className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
          >
            {roundNum >= TOTAL ? "Ver o resultado" : "Outra palavra →"}
          </button>
        </div>
      )}
      {notice}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
