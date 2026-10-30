// The home page's owl mascot (OwlQuiz.tsx). Idle: blinks, flaps its wings and
// bobs. Happy: eyes smile and it hops. Sad: pupils drop and it tilts.
// Decorative: the quiz says in words what happened.
export type OwlMood = "idle" | "happy" | "sad";

const WRAPPER: Record<OwlMood, string> = {
  idle: "owl-bob owl-flap",
  happy: "owl-hop owl-flap",
  sad: "owl-tilt",
};

export default function Owl({ mood, className }: { mood: OwlMood; className?: string }) {
  return (
    <div className={`${WRAPPER[mood]} ${className ?? ""}`} aria-hidden="true">
      <svg width="150" height="120" viewBox="0 0 150 120" className="h-auto w-full overflow-visible">
        <ellipse className="owl-wing-l" cx="28" cy="80" rx="18" ry="30" fill="#4428C9" />
        <ellipse className="owl-wing-r" cx="122" cy="80" rx="18" ry="30" fill="#4428C9" />
        <path d="M30 26l16 16M120 26l-16 16" stroke="#6A4CFF" strokeWidth="12" strokeLinecap="round" />
        <ellipse cx="75" cy="76" rx="50" ry="48" fill="#6A4CFF" />
        <ellipse cx="75" cy="96" rx="30" ry="22" fill="#B8A9FF" />
        <circle cx="56" cy="62" r="17" fill="#FFFFFF" />
        <circle cx="94" cy="62" r="17" fill="#FFFFFF" />
        {mood === "happy" && (
          <>
            <path d="M46 64q10-12 20 0M84 64q10-12 20 0" stroke="#1D1846" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M68 76l7 10 7-10z" fill="#FFB020" />
          </>
        )}
        {mood === "sad" && (
          <>
            <circle cx="58" cy="66" r="7" fill="#1D1846" />
            <circle cx="92" cy="66" r="7" fill="#1D1846" />
            <path d="M68 80l7 8 7-8z" fill="#FFB020" />
          </>
        )}
        {mood === "idle" && (
          <>
            <circle cx="58" cy="62" r="8" fill="#1D1846" />
            <circle cx="92" cy="62" r="8" fill="#1D1846" />
            <circle cx="61" cy="59" r="2.5" fill="#FFFFFF" />
            <circle cx="95" cy="59" r="2.5" fill="#FFFFFF" />
            <rect className="owl-lid" x="39" y="45" width="34" height="34" rx="17" fill="#6A4CFF" />
            <rect className="owl-lid" x="77" y="45" width="34" height="34" rx="17" fill="#6A4CFF" />
            <path d="M68 76l7 10 7-10z" fill="#FFB020" />
          </>
        )}
      </svg>
    </div>
  );
}

/** The owl's head as the logo mark (header). */
export function OwlMark({ className }: { className?: string }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className={className}>
      <circle cx="22" cy="24" r="19" fill="#6A4CFF" />
      <path d="M8 10l7 6M36 10l-7 6" stroke="#6A4CFF" strokeWidth="5" strokeLinecap="round" />
      <circle cx="15" cy="22" r="7" fill="#FFFFFF" />
      <circle cx="29" cy="22" r="7" fill="#FFFFFF" />
      <circle cx="16" cy="23" r="3.4" fill="#1D1846" />
      <circle cx="28" cy="23" r="3.4" fill="#1D1846" />
      <path d="M19 30l3 4 3-4z" fill="#FFC94D" />
    </svg>
  );
}
