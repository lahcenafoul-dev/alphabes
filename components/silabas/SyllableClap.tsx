"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import type { SoundWord } from "@/lib/sons-fr";
import { plainWord } from "@/lib/sons-fr";

// "Aplaude las sílabas": the child hears a word split into syllables, claps
// along, then says how many syllables it has. The answer shows the word in
// coloured syllables. Words use the "ma|ri|po|sa" markup.
export default function SyllableClap({ words }: { words: SoundWord[] }) {
  const { say, notice } = useSpeech("es");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const w = words[index];
  const parts = w.word.split("|");
  const plain = plainWord(w.word);
  const right = answer === parts.length;

  function choose(n: number) {
    setAnswer(n);
    if (n === parts.length) void say(`${parts.join(", ")}. ${plain}`, 0.7);
  }

  function next() {
    setIndex((index + 1) % words.length);
    setAnswer(null);
  }

  return (
    <div>
      <p className="text-sm text-chalkboard/70">
        Escucha la palabra por sílabas y aplaude una vez por cada sílaba. ¿Cuántas palmadas diste?
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div className="text-6xl" role="img" aria-label={`Dibujo: ${plain}`}>
          {w.emoji}
        </div>
        <div>
          <p className="font-display font-extrabold text-3xl" aria-live="polite">
            {right ? (
              parts.map((p, i) => (
                <span key={i} className={i % 2 ? "text-[#C8323A]" : "text-[#1D6FC2]"}>
                  {p}
                  {i < parts.length - 1 && <span className="text-chalkboard/30">-</span>}
                </span>
              ))
            ) : (
              plain
            )}
          </p>
          <button
            type="button"
            onClick={() => void say(`${parts.join(", ")}. ${plain}`, 0.6)}
            className="mt-2 text-sm font-bold text-crayon-blue underline underline-offset-2"
          >
            👏 Escuchar por sílabas
          </button>
        </div>
      </div>
      <fieldset className="mt-4">
        <legend className="font-display font-bold">¿Cuántas sílabas tiene?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={answer === n}
              onClick={() => choose(n)}
              className={`h-12 w-12 rounded-block border-2 font-display font-bold text-2xl transition ${
                answer === n
                  ? right
                    ? "border-crayon-green bg-crayon-green/20"
                    : "border-crayon-red bg-crayon-red/10"
                  : "border-chalkboard/15 bg-paper hover:border-crayon-blue"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 min-h-6 font-display font-bold" aria-live="polite">
        {answer === null
          ? ""
          : right
            ? `¡Sí! ${plain} tiene ${parts.length} ${parts.length === 1 ? "sílaba" : "sílabas"}.`
            : "Casi. Escucha otra vez y aplaude con cada sílaba."}
      </p>
      <button
        type="button"
        onClick={next}
        className="mt-2 rounded-block bg-crayon-blue text-paper px-4 py-2 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        Otra palabra →
      </button>
      {notice}
    </div>
  );
}
