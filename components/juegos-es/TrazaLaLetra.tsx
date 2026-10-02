"use client";

import { useState } from "react";
import TracingCanvas from "@/components/TracingCanvas";
import { useSpeech } from "@/components/ListenButton";
import { spanishLetters } from "@/lib/letters-es";
import { listenClass } from "./ui";

type Case = "mayuscula" | "minuscula";

// The 27 letters in order, ñ after n. `cursiveFont` is the cursive font
// family (Playwrite MX), loaded by the page; cursive is drawn on doble raya.
export default function TrazaLaLetra({ cursiveFont }: { cursiveFont: string }) {
  const { say, notice } = useSpeech("es");
  const [index, setIndex] = useState(0);
  const [letterCase, setLetterCase] = useState<Case>("mayuscula");

  const letter = spanishLetters[index];
  const text = letterCase === "mayuscula" ? letter.upper : letter.lower;
  const last = index === spanishLetters.length - 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg font-display font-bold">
          Traza la letra{" "}
          <span className="letter-block bg-crayon-blue inline-flex h-12 min-w-12 px-2 text-2xl align-middle">{text}</span>
        </p>
        <div role="group" aria-label="Mayúscula o minúscula" className="inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {(["mayuscula", "minuscula"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={letterCase === c}
              onClick={() => setLetterCase(c)}
              className={`rounded-full px-4 py-1.5 ${letterCase === c ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {c === "mayuscula" ? "Mayúscula" : "Minúscula"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => void say(letter.nameSpoken, 0.8)} className={listenClass}>
          🔊 Escuchar
        </button>
        <span className="text-sm text-chalkboard/60">
          Letra {index + 1} de {spanishLetters.length}
        </span>
      </div>

      <TracingCanvas
        text={text}
        cursive={{ text, fontFamily: cursiveFont, ruling: "doble-raya" }}
        labels={{
          clear: "🔄 Borrar y volver a empezar",
          styleGroup: "Tipo de letra",
          script: "Script",
          cursive: "Cursiva",
          canvas: `Espacio para trazar la letra ${letter.upper}`,
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
          {last ? "🎉 Volver a la A" : "✅ Letra siguiente →"}
        </button>
      </div>
      {notice}
    </div>
  );
}
