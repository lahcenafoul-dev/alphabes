"use client";

import { speak } from "@/lib/speech";
import { InlineIcon } from "@/components/UiIcon";

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
      <InlineIcon name="listen" />
      Listen &amp; Repeat
    </button>
  );
}