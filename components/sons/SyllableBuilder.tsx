"use client";

import { useState } from "react";
import { useSpeech } from "@/components/ListenButton";
import { BUILDER_CONSONANTS, BUILDER_VOWELS } from "@/lib/sons-fr";
import { ptSyllableSpoken } from "@/lib/silabas-pt";

const LABELS = {
  fr: {
    intro: "Choisis une consonne, puis une voyelle : écoute la syllabe.",
    consonant: "Consonne",
    vowel: "Voyelle",
    listenTo: "Écouter la syllabe",
    listen: "🔊 Écouter",
  },
  es: {
    intro: "Elige una consonante y luego una vocal: escucha la sílaba.",
    consonant: "Consonante",
    vowel: "Vocal",
    listenTo: "Escuchar la sílaba",
    listen: "🔊 Escuchar",
  },
  pt: {
    intro: "Escolha uma consoante e depois uma vogal: ouça a sílaba.",
    consonant: "Consoante",
    vowel: "Vogal",
    listenTo: "Ouvir a sílaba",
    listen: "🔊 Ouvir",
  },
};

const pick =
  "h-12 w-12 rounded-block border-2 font-display font-bold text-2xl transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crayon-blue";

// Pick a consonant, then a vowel: the syllable appears and is read aloud.
// French by default; the Spanish pages pass their own letters.
export default function SyllableBuilder({
  locale = "fr",
  consonants = BUILDER_CONSONANTS,
  vowels = BUILDER_VOWELS,
}: {
  locale?: "fr" | "es" | "pt";
  consonants?: readonly string[];
  vowels?: readonly string[];
}) {
  const { say, notice } = useSpeech(locale);
  const t = LABELS[locale];
  const [consonant, setConsonant] = useState(consonants[0]);
  const [vowel, setVowel] = useState(vowels[0]);
  const syllable = consonant + vowel;
  // Portuguese classrooms say family syllables with open vowels ("bé", "bó").
  const spoken = (s: string) => (locale === "pt" ? ptSyllableSpoken(s) : s);

  function choose(c: string, v: string) {
    setConsonant(c);
    setVowel(v);
    void say(spoken(c + v), 0.7);
  }

  return (
    <div>
      <p className="text-sm text-chalkboard/70">{t.intro}</p>
      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <fieldset>
            <legend className="font-display font-bold">{t.consonant}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {consonants.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={c === consonant}
                  onClick={() => choose(c, vowel)}
                  className={`${pick} ${c === consonant ? "border-crayon-blue bg-crayon-blue text-paper" : "border-chalkboard/15 bg-paper hover:border-crayon-blue"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display font-bold">{t.vowel}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {vowels.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={v === vowel}
                  onClick={() => choose(consonant, v)}
                  className={`${pick} ${v === vowel ? "border-crayon-red bg-crayon-red text-paper" : "border-chalkboard/15 bg-paper hover:border-crayon-red"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <button
          type="button"
          onClick={() => void say(spoken(syllable), 0.7)}
          aria-label={`${t.listenTo} ${syllable}`}
          className="self-center justify-self-center rounded-block border-2 border-chalkboard/10 bg-paper px-8 py-4 text-center shadow-block hover:shadow-blockHover transition"
        >
          <span className="block text-sm text-chalkboard/70" aria-hidden="true">
            {consonant} + {vowel} =
          </span>
          <span className="block font-display font-extrabold text-6xl" aria-live="polite">
            <span className="text-[#1D6FC2]">{consonant}</span>
            <span className="text-[#C8323A]">{vowel}</span>
          </span>
          <span className="mt-1 block text-sm font-bold text-[#1D6FC2]">{t.listen}</span>
        </button>
      </div>
      {notice}
    </div>
  );
}
