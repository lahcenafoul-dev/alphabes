"use client";

import { useState } from "react";
import { getAllLetterSlugs, getLetterContent } from "@/lib/letters-data";
import { shuffle, pickDistractors } from "@/lib/games/utils";
import WorksheetIcon from "@/components/icons/WorksheetIcon";

const LETTERS = getAllLetterSlugs();
const TOTAL_ROUNDS = 10;

type Round = { uppercase: string; correctWord: string; choices: string[] };

function buildRound(): Round {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const content = getLetterContent(letter)!;
  const correctWord = content.exampleWords[0].word;
  const distractorLetters = pickDistractors(LETTERS, letter, 3);
  const distractorWords = distractorLetters.map((l) => getLetterContent(l)!.exampleWords[0].word);
  return { uppercase: content.uppercase, correctWord, choices: shuffle([correctWord, ...distractorWords]) };
}

export default function MatchLetterPictureGame() {
  const [roundNum, setRoundNum] = useState(1);
  const [round, setRound] = useState<Round>(() => buildRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [finished, setFinished] = useState(false);

  function handlePick(word: string) {
    if (feedback) return;
    if (word === round.correctWord) {
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
          You matched {score} out of {TOTAL_ROUNDS} correctly.
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
        <p className="text-lg">
          Match:{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 w-12 text-2xl align-middle">
            {round.uppercase}
          </span>
        </p>
        <div className="flex gap-4 text-sm font-bold text-chalkboard/70">
          <span>Round {roundNum}/{TOTAL_ROUNDS}</span>
          <span>Score: {score}</span>
        </div>
      </div>

      <p
        aria-live="polite"
        className={`mt-3 h-6 text-sm font-bold ${
          feedback === "correct" ? "text-crayon-green" : feedback === "wrong" ? "text-crayon-red" : "text-transparent"
        }`}
      >
        {feedback === "correct" ? "✓ Correct!" : feedback === "wrong" ? "✗ Try again" : "placeholder"}
      </p>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {round.choices.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => handlePick(word)}
            className="rounded-block border border-chalkboard/10 p-4 text-center shadow-block hover:border-crayon-blue"
          >
            <WorksheetIcon word={word} className="h-16 w-16 mx-auto text-chalkboard/70" />
            <span className="sr-only">{word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
