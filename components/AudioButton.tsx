"use client";

export default function AudioButton({ scene }: { scene: string | null }) {
  if (!scene) return null;

  function play() {
    const audio = new Audio(`/audio/stories/${scene}.mp3`);
    audio.play().catch(() => {});
  }

  return (
    <button
      onClick={play}
      aria-label="Listen"
      className="rounded-block bg-crayon-blue text-white px-4 py-2 font-bold flex items-center gap-2"
    >
      🔊 Listen
    </button>
  );
}