"use client";

import { useState } from "react";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { shuffle, pickDistractors } from "@/lib/games/utils";
import { speak } from "@/lib/speech";

const LETTERS = getAllLetterSlugs();
const TOTAL_ROUNDS = 10;

type Round = { word: string; correctLetter: string; choices: string[] };

function buildRound(): Round {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const content = getLetterContent(letter)!;
  const word = content.exampleWords[0].word;
  const distractors = pickDistractors(LETTERS, letter, 3);
  return { word, correctLetter: letter, choices: shuffle([letter, ...distractors]) };
}

export default function BeginningSoundGame() {
  const [roundNum, setRoundNum] = useState(1);
  const [round, setRound] = useState<Round>(() => buildRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  function handlePick(letter: string) {
    if (feedback) return;
    if (letter === round.correctLetter) {
      setScore((s) => s + 1);
      setFeedback("correct");
      setTimeout(() => {
        if (roundNum >= TOTAL_ROUNDS) {
          setFinished(true);
        } else {
          setRoundNum((n) => n + 1);
          setRound(buildRound());
        }
        setFeedback(null);
      }, 600);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 500);
    }
  }

  function playAgain() {
    setRoundNum(1);
    setScore(0);
    setFinished(false);
    setRound(buildRound());
  }

  if (finished) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-display font-bold">🎉 All done!</p>
        <p className="mt-2 text-chalkboard/70">
          You got {score} out of {TOTAL_ROUNDS} beginning sounds right.
        </p>
        <button
          onClick={playAgain}
          className="mt-6 rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-bold text-chalkboard/70">
          Round {roundNum}/{TOTAL_ROUNDS} · Score: {score}
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-3xl font-display font-bold">{round.word}</p>
        <button
          type="button"
          onClick={() => speak(round.word, 0.8)}
          className="mt-3 rounded-block bg-crayon-blue text-white px-5 py-2.5 font-bold"
        >
          🔊 Listen
        </button>
      </div>

      <p className="mt-4 text-center text-chalkboard/70">Which letter does this word start with?</p>

      <p
        aria-live="polite"
        className={`mt-2 h-6 text-center text-sm font-bold ${
          feedback === "correct" ? "text-crayon-green" : feedback === "wrong" ? "text-crayon-red" : "text-transparent"
        }`}
      >
        {feedback === "correct" ? "✓ Correct!" : feedback === "wrong" ? "✗ Try again" : "placeholder"}
      </p>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
        {round.choices.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => handlePick(letter)}
            aria-label={`Letter ${letter.toUpperCase()}`}
            className="letter-block bg-wood aspect-square text-2xl w-full"
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
