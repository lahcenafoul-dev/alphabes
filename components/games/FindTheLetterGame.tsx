"use client";

import { useEffect, useMemo, useState } from "react";
import { shuffle, pickDistractors } from "@/lib/games/utils";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const GRID_SIZE = 24;

function buildRound(): { target: string; grid: string[] } {
  const target = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  const others = pickDistractors(ALPHABET, target, GRID_SIZE - 1);
  const grid = shuffle([target, ...others]);
  return { target, grid };
}

export default function FindTheLetterGame() {
  const [round, setRound] = useState(() => buildRound());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const minutes = useMemo(() => Math.floor(seconds / 60), [seconds]);
  const secs = useMemo(() => seconds % 60, [seconds]);

  function handlePick(letter: string) {
    if (letter === round.target) {
      setScore((s) => s + 1);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        setRound(buildRound());
      }, 500);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 400);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg">
          Find:{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 w-12 text-2xl align-middle">
            {round.target.toUpperCase()}
          </span>
        </p>
        <div className="flex gap-4 text-sm font-bold text-chalkboard/70">
          <span>Score: {score}</span>
          <span>
            Time: {minutes}:{secs.toString().padStart(2, "0")}
          </span>
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

      <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-3">
        {round.grid.map((letter, i) => (
          <button
            key={`${letter}-${i}`}
            type="button"
            onClick={() => handlePick(letter)}
            aria-label={`Letter ${letter.toUpperCase()}`}
            className="letter-block bg-wood aspect-square text-xl w-full"
          >
            {letter.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
