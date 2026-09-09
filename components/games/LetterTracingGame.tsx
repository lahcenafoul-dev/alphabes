"use client";

import { useState } from "react";
import { getAllLetterSlugs } from "@/lib/letters-data";
import { shuffle } from "@/lib/games/utils";
import GameTracingCanvas from "@/components/games/GameTracingCanvas";

const SEQUENCE = shuffle(getAllLetterSlugs());

export default function LetterTracingGame() {
  const [index, setIndex] = useState(0);
  const [caseMode, setCaseMode] = useState<"upper" | "lower">("upper");
  const [finished, setFinished] = useState(false);

  const letter = SEQUENCE[index];
  const display = caseMode === "upper" ? letter.toUpperCase() : letter.toLowerCase();

  function next() {
    if (index >= SEQUENCE.length - 1) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function playAgain() {
    setIndex(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl font-display font-bold">🎉 You traced the whole alphabet!</p>
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
          Trace:{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 w-12 text-2xl align-middle">{display}</span>
        </p>
        <div className="flex gap-2 text-sm font-bold">
          <button
            type="button"
            onClick={() => setCaseMode("upper")}
            aria-pressed={caseMode === "upper"}
            className={`rounded-block px-3 py-1.5 border ${caseMode === "upper" ? "bg-crayon-blue text-white border-crayon-blue" : "border-chalkboard/20"}`}
          >
            Uppercase
          </button>
          <button
            type="button"
            onClick={() => setCaseMode("lower")}
            aria-pressed={caseMode === "lower"}
            className={`rounded-block px-3 py-1.5 border ${caseMode === "lower" ? "bg-crayon-blue text-white border-crayon-blue" : "border-chalkboard/20"}`}
          >
            Lowercase
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-chalkboard/60">
        Letter {index + 1} of {SEQUENCE.length}
      </p>

      <GameTracingCanvas letter={display} />

      <button
        type="button"
        onClick={next}
        className="mt-4 rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        ✅ Done, Next Letter →
      </button>
    </div>
  );
}
