// Shared palette and small building blocks for the word illustrations
// (components/WordIllustration.tsx documents the style). Every drawing is on
// a 100 x 100 canvas, inherits the ink outline from the root <svg>, and only
// sets its own fills.
import type { ReactNode } from "react";

export const C = {
  // tailwind.config.ts
  ink: "#1F2A44",
  paper: "#FFFDF7",
  red: "#FF5A5F",
  yellow: "#FFC93C",
  green: "#3FA35C",
  blue: "#3EA6FF",
  purple: "#8B5CF6",
  woodLight: "#F1D9A8",
  wood: "#D9A86C",
  woodDark: "#8A5A32",
  // Light and dark steps of the same hues, plus neutrals.
  white: "#FFFFFF",
  cream: "#FFF1C9",
  pink: "#FFB3C1",
  orange: "#FF9F43",
  leaf: "#8FD19E",
  sky: "#BFE3FF",
  navy: "#2F5DA8",
  lilac: "#C9B6FF",
  skin: "#F7C9A0",
  gray: "#C9CED8",
  stone: "#A9B4C8",
  grayDark: "#7A8394",
} as const;

/** A drawing: the shapes inside the 100 x 100 canvas. */
export type Drawing = ReactNode;

/** A round eye with a glint. */
export function Eye({ x, y, r = 3.2 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={C.ink} stroke="none" />
      <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.38} fill={C.white} stroke="none" />
    </>
  );
}

/**
 * The friendly face shared by the animals and people: two eyes, pink cheeks
 * and a small smile, centred on x.
 */
export function Face({
  x = 50,
  y,
  gap = 16,
  r = 3.2,
  mouth = "smile",
  cheeks = true,
}: {
  x?: number;
  y: number;
  gap?: number;
  r?: number;
  mouth?: "smile" | "open" | "none";
  cheeks?: boolean;
}) {
  const h = gap / 2;
  return (
    <>
      {cheeks && (
        <>
          <ellipse cx={x - h - 4} cy={y + 7} rx="4" ry="2.6" fill={C.pink} stroke="none" opacity="0.8" />
          <ellipse cx={x + h + 4} cy={y + 7} rx="4" ry="2.6" fill={C.pink} stroke="none" opacity="0.8" />
        </>
      )}
      <Eye x={x - h} y={y} r={r} />
      <Eye x={x + h} y={y} r={r} />
      {mouth === "smile" && <path d={`M${x - 4} ${y + 7} Q${x} ${y + 11} ${x + 4} ${y + 7}`} fill="none" strokeWidth="2.5" />}
      {mouth === "open" && <path d={`M${x - 4} ${y + 7} Q${x} ${y + 14} ${x + 4} ${y + 7} Z`} fill={C.red} strokeWidth="2.5" />}
    </>
  );
}

/** A leaf pointing from (x, y) in direction `angle` (degrees). */
export function Leaf({ x, y, angle = -45, size = 12, fill = C.green }: { x: number; y: number; angle?: number; size?: number; fill?: string }) {
  return (
    <path
      d={`M0 0 Q${size * 0.5} ${-size * 0.45} ${size} 0 Q${size * 0.5} ${size * 0.45} 0 0 Z`}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill={fill}
    />
  );
}

/** A five-pointed star centred on (cx, cy). */
export function starPath(cx: number, cy: number, outer: number, inner = outer * 0.45) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
}

/** Rays around a centre, for suns and sparkles. */
export function Rays({ cx, cy, from, to, count = 8 }: { cx: number; cy: number; from: number; to: number; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = ((Math.PI * 2) / count) * i;
        return (
          <line
            key={i}
            x1={(cx + from * Math.cos(a)).toFixed(1)}
            y1={(cy + from * Math.sin(a)).toFixed(1)}
            x2={(cx + to * Math.cos(a)).toFixed(1)}
            y2={(cy + to * Math.sin(a)).toFixed(1)}
          />
        );
      })}
    </>
  );
}

/**
 * A circle with `n` round bumps on its edge: wool, manes, clouds, bushes,
 * flower heads.
 */
export function wavyCircle(cx: number, cy: number, r: number, n: number, depth: number) {
  const step = (Math.PI * 2) / n;
  const p = (a: number, rr: number) => `${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`;
  let d = `M${p(0, r)}`;
  for (let i = 0; i < n; i++) d += ` Q${p(step * (i + 0.5), r + depth * 2)} ${p(step * (i + 1), r)}`;
  return d + " Z";
}

/** A thick, outlined line: necks, tails, tentacles, handles. */
export function Tube({ d, fill, width }: { d: string; fill: string; width: number }) {
  return (
    <>
      <path d={d} fill="none" strokeWidth={width + 6} />
      <path d={d} fill="none" stroke={fill} strokeWidth={width} />
    </>
  );
}
