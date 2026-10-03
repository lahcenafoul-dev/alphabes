"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { speakIn, warmUpVoices, type SpeakResult } from "@/lib/speech";

type SpeechLocale = Exclude<Locale, "en">;

// Read-aloud button for the French, Spanish and Portuguese pages. Speaks with a voice in
// the page's language only; when the device has none, it shows how to
// install one instead of letting an English voice mangle the words.
export default function ListenButton({
  text,
  children,
  className,
  ariaLabel,
  rate,
  locale = "fr",
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  rate?: number;
  locale?: SpeechLocale;
}) {
  const { say, notice } = useSpeech(locale);

  return (
    <>
      <button type="button" onClick={() => say(text, rate)} className={className} aria-label={ariaLabel}>
        {children}
      </button>
      {notice}
    </>
  );
}

/**
 * Speech for interactive components: `say(text)` reads it with a voice in
 * the language, and `notice` (render it) explains how to install one when
 * the device has none.
 */
export function useSpeech(locale: SpeechLocale) {
  const [problem, setProblem] = useState<Exclude<SpeakResult, "ok"> | null>(null);

  useEffect(warmUpVoices, []);

  /** Resolves true when the text is being read; `onEnd` runs when it stops. */
  async function say(text: string, rate?: number, onEnd?: () => void) {
    const result = await speakIn(locale, text, rate, onEnd);
    setProblem(result === "ok" ? null : result);
    return result === "ok";
  }

  const Notice = { fr: NoVoiceNotice, es: NoVoiceNoticeEs, pt: NoVoiceNoticePt }[locale];
  const notice = problem ? <Notice kind={problem} onClose={() => setProblem(null)} /> : null;
  return { say, notice };
}

/** French speech (the French games and pages). */
export function useFrenchSpeech() {
  return useSpeech("fr");
}

const noticeClass =
  "fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-block border-2 border-crayon-yellow bg-paper p-4 text-left text-sm text-chalkboard shadow-blockHover sm:inset-x-auto sm:right-4";

function NoVoiceNoticeEs({ kind, onClose }: { kind: Exclude<SpeakResult, "ok">; onClose: () => void }) {
  return (
    <div role="status" className={noticeClass}>
      {kind === "unsupported" ? (
        <p className="font-display font-bold">
          Este navegador no puede leer en voz alta. Prueba con Chrome, Edge, Safari o Firefox.
        </p>
      ) : (
        <>
          <p className="font-display font-bold">Este dispositivo no tiene ninguna voz en español.</p>
          <p className="mt-1 text-chalkboard/80">Para escuchar las letras y las palabras, agrega una:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-chalkboard/80">
            <li>
              <strong>Android</strong>: Ajustes › Accesibilidad › Texto a voz, y elige el español (motor de Google).
            </li>
            <li>
              <strong>iPhone, iPad</strong>: Ajustes › Accesibilidad › Contenido leído › Voces › Español.
            </li>
            <li>
              <strong>Windows</strong>: Configuración › Hora e idioma › Idioma y región, agrega el español con la
              opción de voz.
            </li>
          </ul>
          <p className="mt-2 text-chalkboard/60">Después, vuelve a cargar la página.</p>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-block bg-chalkboard px-4 py-1.5 font-display font-bold text-paper"
      >
        Cerrar
      </button>
    </div>
  );
}

function NoVoiceNoticePt({ kind, onClose }: { kind: Exclude<SpeakResult, "ok">; onClose: () => void }) {
  return (
    <div role="status" className={noticeClass}>
      {kind === "unsupported" ? (
        <p className="font-display font-bold">
          Este navegador não consegue ler em voz alta. Tente com o Chrome, o Edge, o Safari ou o Firefox.
        </p>
      ) : (
        <>
          <p className="font-display font-bold">Este aparelho não tem nenhuma voz em português.</p>
          <p className="mt-1 text-chalkboard/80">Para ouvir as letras e as palavras, adicione uma:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-chalkboard/80">
            <li>
              <strong>Android</strong>: Configurações › Acessibilidade › Conversão de texto em voz, e escolha o
              português (mecanismo do Google).
            </li>
            <li>
              <strong>iPhone, iPad</strong>: Ajustes › Acessibilidade › Conteúdo Falado › Vozes › Português.
            </li>
            <li>
              <strong>Windows</strong>: Configurações › Hora e idioma › Idioma e região, adicione o português
              (Brasil) com a opção de voz.
            </li>
          </ul>
          <p className="mt-2 text-chalkboard/60">Depois, recarregue a página.</p>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-block bg-chalkboard px-4 py-1.5 font-display font-bold text-paper"
      >
        Fechar
      </button>
    </div>
  );
}

function NoVoiceNotice({ kind, onClose }: { kind: Exclude<SpeakResult, "ok">; onClose: () => void }) {
  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-md rounded-block border-2 border-crayon-yellow bg-paper p-4 text-left text-sm text-chalkboard shadow-blockHover sm:inset-x-auto sm:right-4"
    >
      {kind === "unsupported" ? (
        <p className="font-display font-bold">
          Ce navigateur ne sait pas lire à voix haute. Essayez avec Chrome, Edge, Safari ou Firefox.
        </p>
      ) : (
        <>
          <p className="font-display font-bold">Aucune voix française n&apos;est installée sur cet appareil.</p>
          <p className="mt-1 text-chalkboard/80">Pour entendre les lettres et les mots, ajoutez-en une :</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-chalkboard/80">
            <li>
              <strong>Android</strong> : Paramètres › Accessibilité › Synthèse vocale, puis choisissez le français
              (moteur Google).
            </li>
            <li>
              <strong>iPhone, iPad</strong> : Réglages › Accessibilité › Contenu énoncé › Voix › Français.
            </li>
            <li>
              <strong>Windows</strong> : Paramètres › Heure et langue › Langue et région, ajoutez le français avec la
              synthèse vocale.
            </li>
          </ul>
          <p className="mt-2 text-chalkboard/60">Rechargez ensuite la page.</p>
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 rounded-block bg-chalkboard px-4 py-1.5 font-display font-bold text-paper"
      >
        Fermer
      </button>
    </div>
  );
}
