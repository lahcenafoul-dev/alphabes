// Small happy sounds made in the browser (no audio files): the sliding
// puzzle's chime when it's solved, and the number games' chime and balloon
// pop. There is deliberately no "wrong" sound: a mistake only gets kind words.

type Note = { freq: number; at: number; length: number; gain: number; type?: OscillatorType; slideTo?: number };

function play(notes: Note[]) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    let end = 0;
    for (const n of notes) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = n.type ?? "triangle";
      const t = ctx.currentTime + n.at;
      o.frequency.setValueAtTime(n.freq, t);
      if (n.slideTo) o.frequency.exponentialRampToValueAtTime(n.slideTo, t + n.length);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(n.gain, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + n.length);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + n.length + 0.05);
      end = Math.max(end, n.at + n.length);
    }
    setTimeout(() => void ctx.close(), (end + 0.5) * 1000);
  } catch {
    // No sound: the owl and the message still show.
  }
}

/** A short happy chime (four rising notes). */
export function chime() {
  play([523.25, 659.25, 783.99, 1046.5].map((freq, i) => ({ freq, at: i * 0.12, length: 0.35, gain: 0.25 })));
}

/** A soft, quick "pop" going up, for a balloon. */
export function pop() {
  play([{ freq: 320, slideTo: 900, at: 0, length: 0.12, gain: 0.3, type: "sine" }]);
}
