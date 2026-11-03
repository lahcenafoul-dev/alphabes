"use client";

// Small drawings shared by the number games: groups of pictures to count,
// dots in a five-wide frame, and hands holding up fingers (the hand of the
// number tracing sheets, scripts/numbers-layout.ts, in colour).
import { dotLayout } from "@/lib/number-games-logic";

/** n copies of a picture, in rows of up to five. Each one is announced, so a screen reader can count them too. */
export function PictureGroup({
  n,
  src,
  alt,
  size = "md",
  label,
}: {
  n: number;
  src: string;
  alt: string;
  size?: "sm" | "md";
  label?: string;
}) {
  const img = size === "sm" ? "h-8 w-8 sm:h-11 sm:w-11" : "h-12 w-12 sm:h-16 sm:w-16";
  return (
    <ul aria-label={label} className="flex max-w-[22rem] flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
      {Array.from({ length: n }, (_, i) => (
        <li key={i} className="flex-none">
          {/* A plain <img>: next/image's optimizer doesn't run on Cloudflare Workers (see WordIllustration). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} width={64} height={64} decoding="async" draggable={false} className={`${img} select-none object-contain mix-blend-multiply`} />
        </li>
      ))}
    </ul>
  );
}

/** n dots (1–10) in a 5 × 2 frame, like a ten-frame. Decorative: the button around it says how many. */
export function Dots({ n, color = "#6A4CFF" }: { n: number; color?: string }) {
  const cells = dotLayout(n);
  return (
    <svg viewBox="0 0 110 48" className="h-auto w-full max-w-[150px]" aria-hidden="true">
      {[0, 1].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect key={`${row}-${col}`} x={2 + col * 21.5} y={2 + row * 22} width={20} height={20} rx={5} fill="#EEEAFF" opacity={n > 5 ? 1 : 0} />
        )),
      )}
      {cells.map(([col, row], i) => (
        <circle key={i} cx={12 + col * 21.5} cy={12 + row * 22} r={8} fill={color} />
      ))}
    </svg>
  );
}

const INK = "#1D1846";

function finger(x: number, base: number, w: number, len: number, deg = 0) {
  return <rect x={x} y={base - len} width={w} height={len + 3} rx={w / 2} transform={`rotate(${deg} ${x + w / 2} ${base})`} />;
}

const FINGERS = [
  { x: 10, w: 5.2, len: 16 }, // index
  { x: 15.6, w: 5.2, len: 18 }, // middle
  { x: 21.2, w: 5, len: 16.5 }, // ring
  { x: 26.6, w: 4.6, len: 13 }, // little
];

/** One hand holding up `up` fingers (0–5): raised ones behind the palm, curled ones on it, the thumb last. */
function Hand({ up, x }: { up: number; x: number }) {
  const raised = FINGERS.filter((_, i) => i < Math.min(up, 4));
  const curled = FINGERS.filter((_, i) => i >= Math.min(up, 4));
  return (
    <g transform={`translate(${x} 0)`} fill="#FFE2C6" stroke={INK} strokeWidth={1.1} strokeLinejoin="round">
      {raised.map((f, i) => (
        <g key={i}>{finger(f.x, 23, f.w, f.len)}</g>
      ))}
      {up >= 5 && finger(6.5, 33, 5.2, 13, -40)}
      <path d="M9 22 H32.5 V34 Q32.5 40 28.5 42 V47 H13.5 V42 Q9 40 9 34 Z" />
      {curled.map((f, i) => (
        <rect key={i} x={f.x} y={19} width={f.w} height={8} rx={f.w / 2} />
      ))}
      {up < 5 && <rect x={7.5} y={28.5} width={15} height={5.4} rx={2.7} />}
    </g>
  );
}

/** The hands for n (1–10): one hand up to 5, then a full hand and a second one. Decorative. */
export function Hands({ n }: { n: number }) {
  const counts = n <= 5 ? [n] : [5, n - 5];
  const w = 40;
  return (
    <svg viewBox={`-2 0 ${w * counts.length} 49`} className="h-auto w-full max-w-[150px]" aria-hidden="true">
      {counts.map((c, i) => (
        <Hand key={i} up={c} x={i * w} />
      ))}
    </svg>
  );
}
