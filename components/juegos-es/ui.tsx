"use client";

// Pieces shared by the Spanish games (components/juegos-es). The feedback
// line and button styles are the French games' ones; the score and the end
// screen are written in Spanish here.
export { FeedbackLine, choiceClass, listenClass, type Feedback } from "@/components/games-fr/ui";

export function ScoreBar({ round, total, score }: { round: number; total: number; score: number }) {
  return (
    <p className="text-sm font-bold text-chalkboard/70">
      Ronda {round}/{total} · Puntos: {score}
    </p>
  );
}

/** Kind words whatever the score: the point is to come back and play again. */
export function EndScreen({ score, total, onAgain }: { score: number; total: number; onAgain: () => void }) {
  const cheer = score === total ? "¡Perfecto!" : score >= total * 0.7 ? "¡Muy bien!" : "¡Bien hecho!";
  return (
    <div className="text-center py-8">
      <p className="text-5xl" aria-hidden="true">
        🎉
      </p>
      <p className="mt-3 text-2xl font-display font-bold">{cheer}</p>
      <p className="mt-2 text-chalkboard/70">
        {score} {score === 1 ? "respuesta correcta" : "respuestas correctas"} de {total}.
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="mt-6 rounded-block bg-crayon-blue text-white px-6 py-3 font-display font-bold shadow-block hover:shadow-blockHover transition"
      >
        Jugar otra vez
      </button>
    </div>
  );
}
