"use client";

import { speak } from "@/lib/speech";

export default function SpeakButton({
  text,
  className,
  ariaLabel,
}: {
  text: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className={className}
      aria-label={ariaLabel}
    >
      🔊 Listen &amp; Repeat
    </button>
  );
}