"use client";

import { useState } from "react";
import TracingCanvas from "@/components/TracingCanvas";
import { useSpeech } from "@/components/ListenButton";
import { portugueseLetters } from "@/lib/letters-pt";
import { listenClass } from "./ui";

type Case = "maiuscula" | "minuscula";

// The 26 letters and Ç (after C), in order. `cursiveFont` is the cursive font
// family (Playwrite BR), loaded by the page; cursive is drawn on the
// caligrafia lines.
export default function TraceALetra({ cursiveFont }: { cursiveFont: string }) {
  const { say, notice } = useSpeech("pt");
  const [index, setIndex] = useState(0);
  const [letterCase, setLetterCase] = useState<Case>("maiuscula");

  const letter = portugueseLetters[index];
  const text = letterCase === "maiuscula" ? letter.upper : letter.lower;
  const last = index === portugueseLetters.length - 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg font-display font-bold">
          Trace a letra{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 min-w-12 px-2 text-2xl align-middle">{text}</span>
        </p>
        <div role="group" aria-label="Maiúscula ou minúscula" className="inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {(["maiuscula", "minuscula"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={letterCase === c}
              onClick={() => setLetterCase(c)}
              className={`rounded-full px-4 py-1.5 ${letterCase === c ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {c === "maiuscula" ? "Maiúscula" : "Minúscula"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void say(letter.nameSpoken, 0.8)} className={listenClass}>
          🔊 Ouvir
        </button>
        <span className="text-sm text-chalkboard/60">
          Letra {index + 1} de {portugueseLetters.length}
        </span>
      </div>

      <TracingCanvas
        text={text}
        cursive={{ text, fontFamily: cursiveFont, ruling: "caligrafia" }}
        labels={{
          clear: "🔄 Apagar e começar de novo",
          styleGroup: "Tipo de letra",
          script: "Forma",
          cursive: "Cursiva",
          canvas: `Espaço para traçar a letra ${letter.upper}`,
        }}
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="rounded-block border-2 border-chalkboard/20 px-5 py-3 font-display font-bold disabled:opacity-30"
        >
          ← Letra anterior
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => (last ? 0 : i + 1))}
          className="rounded-block bg-crayon-green text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
        >
          {last ? "🎉 Voltar ao A" : "✅ Próxima letra →"}
        </button>
      </div>
      {notice}
    </div>
  );
}
