"use client";

import { useState } from "react";
import TracingCanvas from "@/components/TracingCanvas";
import { useFrenchSpeech } from "@/components/ListenButton";
import { frenchLetters } from "@/lib/letters-fr";
import { listenClass } from "./ui";

type Case = "capitale" | "minuscule";

// The letters in alphabet order, then é è ê ç, as at school. `cursiveFont`
// is the cursive font family, loaded by the page.
export default function TraceLaLettre({ cursiveFont }: { cursiveFont: string }) {
  const { say, notice } = useFrenchSpeech();
  const [index, setIndex] = useState(0);
  const [letterCase, setLetterCase] = useState<Case>("capitale");

  const letter = frenchLetters[index];
  const text = letterCase === "capitale" ? letter.upper : letter.lower;
  const last = index === frenchLetters.length - 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg font-display font-bold">
          Trace la lettre{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 min-w-12 px-2 text-2xl align-middle">{text}</span>
        </p>
        <div role="group" aria-label="Capitale ou minuscule" className="inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {(["capitale", "minuscule"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={letterCase === c}
              onClick={() => setLetterCase(c)}
              className={`rounded-full px-4 py-1.5 ${letterCase === c ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {c === "capitale" ? "Capitale" : "Minuscule"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void say(letter.nameSpoken, 0.8)} className={listenClass}>
          🔊 Écouter
        </button>
        <span className="text-sm text-chalkboard/60">
          Lettre {index + 1} sur {frenchLetters.length}
        </span>
      </div>

      <TracingCanvas
        text={text}
        cursive={{ text, fontFamily: cursiveFont }}
        labels={{
          clear: "🔄 Effacer et recommencer",
          styleGroup: "Écriture",
          script: "Script",
          cursive: "Cursive",
          canvas: `Zone de tracé de la lettre ${letter.upper}`,
        }}
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="rounded-block border-2 border-chalkboard/20 px-5 py-3 font-display font-bold disabled:opacity-30"
        >
          ← Lettre précédente
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (last ? 0 : i + 1))}
          className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
        >
          {last ? "🎉 Recommencer au A" : "✅ Lettre suivante →"}
        </button>
      </div>
      {notice}
    </div>
  );
}
