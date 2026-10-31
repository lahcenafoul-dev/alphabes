// Our own line drawings for the dot-to-dot and colouring sheets, drawn in a
// 100 × 100 box (y down). Every drawing has:
//   outline  one closed path: the dots of the dot-to-dot sheets follow it,
//            and it is the first colouring region (in `paint`)
//   regions  more closed shapes, painted in order on top of the outline
//            (`clip`: cut to the outline; `under`: painted before it)
//   details  eyes, mouths, lines: printed on every sheet, never numbered
//   start    where dot 1 goes (the dots then run clockwise)
//   levels   the dot-to-dot sheets made of it: only the levels where the
//            joined dots still clearly show the subject
//   dots     hand-placed dots for a level (1–10 always, 1–20 when the
//            automatic ones don't read well), clockwise from dot 1; the
//            other levels pick their dots along the outline
// On dot-to-dot sheets the clipped regions are left out (they'd float
// without the outline); the others are printed as part of the picture.
import { circle, ellipse } from "@/lib/sheets/geometry";
import type { L10n } from "@/lib/sheets/types";
import type { ColourId } from "./vocab";
import type { DotLevel } from "./dot-to-dot";

/** The colours of the colouring sheets: the seven of vocab.ts, plus brown and grey. */
export type Paint = ColourId | "brown" | "grey";

export type DrawingRegion = { d: string; paint: Paint; clip?: boolean; under?: boolean };
/** A line (stroke only), or a small shape filled in ink or white (eyes, noses). */
export type DrawingDetail = { d: string; fill?: "ink" | "white"; width?: number };

export type Drawing = {
  id: string;
  /** The subject's name, without article. */
  name: L10n;
  /** With the definite article ("le chat", "la manzana"). */
  the: L10n;
  outline: string;
  paint: Paint;
  regions: DrawingRegion[];
  details: DrawingDetail[];
  start: { x: number; y: number };
  levels: DotLevel[];
  dots?: Partial<Record<DotLevel, [number, number][]>>;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/** n points on a circle, the first at `deg` (0° points right; angles go clockwise, y being down). */
function ring(cx: number, cy: number, r: number, n: number, deg: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = ((deg + (360 * i) / n) * Math.PI) / 180;
    return [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))];
  });
}

/** A closed polygon through the points. */
function polygon(pts: [number, number][]): string {
  return `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
}

/** A five-pointed star's ten corners, the top point first. */
const STAR_INNER = ring(50, 53, 19, 5, -54);
const STAR = ring(50, 53, 46, 5, -90).flatMap((p, i) => [p, STAR_INNER[i]]);

/** A sun's ray from radius r0 (hidden under the sun) out to r1, with a blunt tip (a sharp one would leave a sliver). */
function ray(cx: number, cy: number, r0: number, r1: number, deg: number, half: number): string {
  const [a] = ring(cx, cy, r0, 1, deg - half);
  const [b] = ring(cx, cy, r1, 1, deg - half / 4);
  const [c] = ring(cx, cy, r1, 1, deg + half / 4);
  const [d] = ring(cx, cy, r0, 1, deg + half);
  return polygon([a, b, c, d]);
}

/** A flower's outline: n round petals of radius r, their centres R from the middle (top petal first). */
function petals(cx: number, cy: number, n: number, R: number, r: number): string {
  const step = (2 * Math.PI) / n;
  // Where two neighbouring petals meet, on the side of the middle.
  const valley = R * Math.cos(step / 2) - Math.sqrt(r * r - (R * Math.sin(step / 2)) ** 2);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = -Math.PI / 2 + i * step;
    const c = { x: cx + R * Math.cos(t), y: cy + R * Math.sin(t) };
    const v0 = { x: cx + valley * Math.cos(t - step / 2), y: cy + valley * Math.sin(t - step / 2) };
    const v1 = { x: cx + valley * Math.cos(t + step / 2), y: cy + valley * Math.sin(t + step / 2) };
    const a0 = Math.atan2(v0.y - c.y, v0.x - c.x);
    let a1 = Math.atan2(v1.y - c.y, v1.x - c.x);
    while (a1 < a0) a1 += 2 * Math.PI;
    // The petal's round outer edge, from one valley to the next.
    for (let k = 0; k < 12; k++) {
      const a = a0 + ((a1 - a0) * k) / 12;
      pts.push([r2(c.x + r * Math.cos(a)), r2(c.y + r * Math.sin(a))]);
    }
  }
  return polygon(pts);
}

/**
 * Dots around a flower of petals(cx, cy, n, R, r): on each petal its tip and
 * a point on each side, then the valley before the next petal (the top tip first).
 */
function petalDots(cx: number, cy: number, n: number, R: number, r: number): [number, number][] {
  const step = 360 / n;
  const valley = R * Math.cos(Math.PI / n) - Math.sqrt(r * r - (R * Math.sin(Math.PI / n)) ** 2);
  return Array.from({ length: n }, (_, i) => {
    const t = -90 + i * step;
    const [c] = ring(cx, cy, R, 1, t);
    return [ring(c[0], c[1], r, 1, t)[0], ring(c[0], c[1], r, 1, t + 62)[0], ring(cx, cy, valley, 1, t + step / 2)[0], ring(cx + R * Math.cos(((t + step) * Math.PI) / 180), cy + R * Math.sin(((t + step) * Math.PI) / 180), r, 1, t + step - 62)[0]];
  }).flat();
}

/** An eye: white, with a big pupil and a highlight. */
function eye(x: number, y: number, r: number): DrawingDetail[] {
  return [
    { d: circle(x, y, r), fill: "ink" },
    { d: circle(x - r * 0.32, y - r * 0.35, r * 0.34), fill: "white" },
  ];
}

export const DRAWINGS: Drawing[] = [
  {
    id: "cat",
    name: { en: "cat", fr: "chat", es: "gato", pt: "gato" },
    the: { en: "the cat", fr: "le chat", es: "el gato", pt: "o gato" },
    // Sitting, facing us, the tail curled up on the right.
    outline:
      "M30 8 L41 23 Q50 20 59 23 L70 8 L73 29 C80 37 80 49 71 56 C77 61 79 68 79 74 C82 70 84 64 85 58 C86 53 92 53 92 58 C93 72 90 88 78 94 L24 94 C19 88 19 66 29 56 C20 49 20 37 27 29 Z",
    paint: "orange",
    regions: [
      // Inner ears.
      { d: "M31 13 L38 22.5 L29.5 26 Z", paint: "pink" },
      { d: "M69 13 L62 22.5 L70.5 26 Z", paint: "pink" },
      // Collar and bell.
      { d: "M15 54 Q50 66 85 54 L85 60 Q50 72 15 60 Z", paint: "red", clip: true },
      { d: circle(50, 70.5, 4), paint: "yellow" },
      // Belly and tail tip.
      { d: ellipse(50, 84, 13, 8), paint: "yellow" },
      { d: "M80 62 L100 62 L100 40 L80 40 Z", paint: "brown", clip: true },
    ],
    details: [
      ...eye(41, 39, 3.6),
      ...eye(59, 39, 3.6),
      { d: "M47.5 45 L52.5 45 L50 48 Z", fill: "ink" },
      { d: "M50 48 Q47 51.5 44.5 49.5 M50 48 Q53 51.5 55.5 49.5", width: 1 },
      { d: "M35 46 L27 44.5 M35 48.5 L27 49.5 M65 46 L73 44.5 M65 48.5 L73 49.5", width: 0.8 },
    ],
    start: { x: 30, y: 8 },
    levels: ["medium", "hard", "letters"],
  },
  {
    id: "fish",
    name: { en: "fish", fr: "poisson", es: "pez", pt: "peixe" },
    the: { en: "the fish", fr: "le poisson", es: "el pez", pt: "o peixe" },
    // Swimming left: round body, fins on top and below, a big tail.
    outline:
      "M8 52 C11 36 27 27 44 26 C49 18 58 13 67 15 C64 21 63 26 64 30 C70 34 74 38 77 43 L93 28 C88 42 88 60 93 74 L77 59 C72 67 62 73 54 75 C55 81 51 86 44 86 C45 81 43 78 41 76 C25 75 11 66 8 52 Z",
    paint: "blue",
    regions: [
      // Stripes, then the tail and fins over them, so the fins stay whole.
      { d: "M34 20 C30 40 30 62 34 82 L42 82 C38 62 38 40 42 20 Z", paint: "yellow", clip: true },
      { d: "M53 20 C49 40 49 62 53 82 L61 82 C57 62 57 40 61 20 Z", paint: "yellow", clip: true },
      { d: "M78 28 C73 42 73 60 78 76 L100 85 L100 20 Z", paint: "orange", clip: true },
      { d: "M44 28.5 Q55 25 66 31 L72 8 L40 8 Z", paint: "orange", clip: true },
      { d: "M40 74.5 Q47 77 55 73.5 L57 92 L36 92 Z", paint: "orange", clip: true },
    ],
    details: [
      { d: circle(22, 45, 5.2), fill: "white", width: 1.2 },
      { d: circle(23, 45.5, 2.8), fill: "ink" },
      { d: circle(22, 44.2, 0.9), fill: "white" },
      { d: "M12 54.5 Q15.5 57.5 19.5 55.5", width: 1.1 },
    ],
    start: { x: 8, y: 52 },
    levels: ["easy", "medium", "letters"],
    dots: { easy: [[8, 52], [20.8, 33.4], [44, 26], [67, 15], [64, 30], [77, 43], [93, 28], [93, 74], [77, 59], [16.3, 66.2]] },
  },
  {
    id: "apple",
    name: { en: "apple", fr: "pomme", es: "manzana", pt: "maçã" },
    the: { en: "the apple", fr: "la pomme", es: "la manzana", pt: "a maçã" },
    // Two lobes on top, a stem and a leaf.
    outline:
      "M50 33 C58 24 80 22 86 42 C91 60 81 86 67 91 C61 93 56 91 50 89 C44 91 39 93 33 91 C19 86 9 60 14 42 C20 22 42 24 50 33 Z",
    paint: "red",
    regions: [
      { d: "M47 34 C47 26 48 19 52 12 L57 14 C53 20 52.5 27 53 34 Z", paint: "brown", under: true },
      { d: "M55 19 C60 9 72 7 78 11 C74 19 64 23 55 19 Z", paint: "green", under: true },
      // A shine on the left lobe (colouring sheets only: on its own it reads as a stray shape).
      { d: "M22 44 C24 36 30 32 36 32 C33 36 28 41 27 48 C26 52 21 51 22 44 Z", paint: "pink", clip: true },
    ],
    details: [{ d: "M56 18 C62 15 68 13 74 12", width: 0.9 }],
    start: { x: 50, y: 33 },
    levels: ["easy", "medium", "letters"],
    dots: { easy: [[31.3, 26.6], [45.6, 29.5], [54.4, 29.5], [68.8, 26.6], [86, 42], [85.5, 65.6], [67, 91], [33, 91], [14.5, 65.6], [14, 42]] },
  },
  {
    id: "car",
    name: { en: "car", fr: "voiture", es: "carro", pt: "carro" },
    the: { en: "the car", fr: "la voiture", es: "el carro", pt: "o carro" },
    // Side view, driving right. The wheels are tucked under the body (only
    // their lower half shows), so even 10 dots draw a clear car body.
    outline:
      "M8 72 L8 58 C8 52 12 49.5 19 49 L28 48 C32 34 38 28 50 28 L62 28 C70 28 75 34 80 46 C88 47 93 51 93 58 L93 72 Z",
    paint: "red",
    regions: [
      // Wheels and hubcaps.
      { d: circle(73, 74, 9), paint: "grey", under: true },
      { d: circle(27, 74, 9), paint: "grey", under: true },
      { d: circle(73, 74, 4.2), paint: "yellow", under: true },
      { d: circle(27, 74, 4.2), paint: "yellow", under: true },
      // Windows.
      { d: "M33 47 C36 38 41 33.5 48 33.5 L48 47 Z", paint: "blue" },
      { d: "M53 33.5 L61 33.5 C67 33.5 70.5 38 74 47 L53 47 Z", paint: "blue" },
    ],
    details: [
      { d: "M50.5 50 L50.5 66", width: 0.9 },
      { d: "M42 54 L46 54 M56 54 L60 54", width: 1.1 },
      { d: ellipse(88.5, 55, 2.2, 2.6), fill: "white", width: 1 },
    ],
    start: { x: 8, y: 72 },
    levels: ["medium", "hard", "letters"],
  },
  {
    id: "butterfly",
    name: { en: "butterfly", fr: "papillon", es: "mariposa", pt: "borboleta" },
    the: { en: "the butterfly", fr: "le papillon", es: "la mariposa", pt: "a borboleta" },
    // Wings open, seen from above; antennae on top.
    outline:
      "M50 24 C53 24 55 27 55 30 C62 16 78 8 88 12 C96 16 94 34 86 42 C82 46 74 48 66 49 C78 54 86 64 82 76 C78 86 64 86 58 76 L55 80 C55 83 53 86 50 86 C47 86 45 83 45 80 L42 76 C36 86 22 86 18 76 C14 64 22 54 34 49 C26 48 18 46 14 42 C6 34 4 16 12 12 C22 8 38 16 45 30 C45 27 47 24 50 24 Z",
    paint: "purple",
    regions: [
      // Lower wings in another colour.
      { d: "M53 49 L100 49 L100 100 L53 100 Z", paint: "blue", clip: true },
      { d: "M47 49 L0 49 L0 100 L47 100 Z", paint: "blue", clip: true },
      // Spots.
      { d: circle(76, 27, 7), paint: "yellow" },
      { d: circle(24, 27, 7), paint: "yellow" },
      { d: circle(70, 69, 5.5), paint: "pink" },
      { d: circle(30, 69, 5.5), paint: "pink" },
      // Body.
      // Its ends follow the outline, so no sliver of wing shows above or below it.
      { d: "M45 30 C45 27 47 24 50 24 C53 24 55 27 55 30 L55 80 C55 83 53 86 50 86 C47 86 45 83 45 80 Z", paint: "brown" },
    ],
    details: [
      { d: "M47.5 25.5 C46 18 43 13 37 10 M52.5 25.5 C54 18 57 13 63 10", width: 1 },
      { d: circle(37, 10, 1.6), fill: "ink" },
      { d: circle(63, 10, 1.6), fill: "ink" },
    ],
    start: { x: 50, y: 86 },
    levels: ["medium", "hard", "letters"],
  },
  {
    id: "rocket",
    name: { en: "rocket", fr: "fusée", es: "cohete", pt: "foguete" },
    the: { en: "the rocket", fr: "la fusée", es: "el cohete", pt: "o foguete" },
    // Standing up, with a round window, two fins and a flame.
    outline:
      "M50 5 C60 13 66 27 66 43 L66 60 L80 73 L80 88 L66 80 C60 82 40 82 34 80 L20 88 L20 73 L34 60 L34 43 C34 27 40 13 50 5 Z",
    paint: "blue",
    regions: [
      { d: "M42 85 C42 92 47 96 50 99 C53 96 58 92 58 85 Z", paint: "orange", under: true },
      { d: "M39 78 L61 78 L59 87 L41 87 Z", paint: "grey", under: true },
      // Nose cone and fins.
      { d: "M30 27 Q50 22 70 27 L70 0 L30 0 Z", paint: "red", clip: true },
      { d: "M66 55 L100 55 L100 100 L66 100 Z", paint: "red", clip: true },
      { d: "M34 55 L0 55 L0 100 L34 100 Z", paint: "red", clip: true },
      // Window.
      { d: circle(50, 46, 8.5), paint: "yellow" },
    ],
    details: [{ d: "M45 43 Q46.5 39.5 50 39", width: 1.2 }],
    start: { x: 50, y: 5 },
    levels: ["easy", "hard", "letters"],
    dots: { easy: [[50, 5], [66, 36], [66, 68], [80, 88], [66, 80], [50, 81.5], [34, 80], [20, 88], [34, 68], [34, 36]] },
  },
  {
    id: "house",
    name: { en: "house", fr: "maison", es: "casa", pt: "casa" },
    the: { en: "the house", fr: "la maison", es: "la casa", pt: "a casa" },
    // A pointed roof with a chimney, a door and two windows.
    outline: "M50 8 L92 44 L84 44 L84 90 L16 90 L16 44 L8 44 Z",
    paint: "yellow",
    regions: [
      { d: "M60 28 L60 11 L68 11 L68 28 Z", paint: "brown", under: true },
      { d: "M0 0 L100 0 L100 44 L0 44 Z", paint: "red", clip: true },
      { d: "M43 90 L43 71 C43 65 57 65 57 71 L57 90 Z", paint: "green" },
      { d: "M22 54 L36 54 L36 66 L22 66 Z", paint: "blue" },
      { d: "M64 54 L78 54 L78 66 L64 66 Z", paint: "blue" },
    ],
    details: [{ d: circle(53.5, 79, 1.2), fill: "ink" }],
    start: { x: 50, y: 8 },
    levels: ["easy", "medium"],
    dots: { easy: [[50, 8], [71, 26], [92, 44], [84, 44], [84, 90], [50, 90], [16, 90], [16, 44], [8, 44], [29, 26]] },
  },
  {
    id: "star",
    name: { en: "star", fr: "étoile", es: "estrella", pt: "estrela" },
    the: { en: "the star", fr: "l'étoile", es: "la estrella", pt: "a estrela" },
    // Five points and a smiling face.
    outline: polygon(STAR),
    paint: "yellow",
    regions: [
      { d: circle(39.5, 60, 3.2), paint: "pink" },
      { d: circle(60.5, 60, 3.2), paint: "pink" },
    ],
    details: [...eye(43.5, 51, 2.6), ...eye(56.5, 51, 2.6), { d: "M46 58.5 Q50 62.5 54 58.5", width: 1 }],
    start: { x: 50, y: 7 },
    levels: ["easy", "medium"],
    dots: { easy: STAR },
  },
  {
    id: "heart",
    name: { en: "heart", fr: "cœur", es: "corazón", pt: "coração" },
    the: { en: "the heart", fr: "le cœur", es: "el corazón", pt: "o coração" },
    // A round heart with a smiling face.
    outline:
      "M50 88 C30 74 8 58 8 36 C8 20 20 12 31 12 C40 12 46 17 50 25 C54 17 60 12 69 12 C80 12 92 20 92 36 C92 58 70 74 50 88 Z",
    paint: "red",
    regions: [
      { d: circle(32, 52, 3.6), paint: "pink" },
      { d: circle(68, 52, 3.6), paint: "pink" },
    ],
    details: [...eye(39, 42, 3), ...eye(61, 42, 3), { d: "M44 53 Q50 59 56 53", width: 1 }],
    start: { x: 50, y: 25 },
    levels: ["easy", "medium"],
    dots: { easy: [[50, 25], [62, 13], [80, 14], [91, 30], [84, 57], [50, 88], [16, 57], [9, 30], [20, 14], [38, 13]] },
  },
  {
    id: "balloon",
    name: { en: "balloon", fr: "ballon", es: "globo", pt: "balão" },
    the: { en: "the balloon", fr: "le ballon", es: "el globo", pt: "o balão" },
    // A round balloon, its knot and a wavy string.
    outline: "M50 8 C70 8 84 23 84 42 C84 62 64 77 50 78 C36 77 16 62 16 42 C16 23 30 8 50 8 Z",
    paint: "red",
    regions: [
      { d: "M46 76 L54 76 L57 83 L43 83 Z", paint: "orange", under: true },
      { d: "M26 40 C26 30 31 22 39 19 C35 25 33 31 32 40 C32 45 26 45 26 40 Z", paint: "pink", clip: true },
    ],
    details: [{ d: "M50 86 C46 90 54 94 50 99", width: 0.9 }],
    start: { x: 50, y: 8 },
    levels: ["easy", "medium"],
    dots: { easy: [[50, 8], [68, 12], [80, 24], [84, 44], [74, 64], [50, 78], [26, 64], [16, 44], [20, 24], [32, 12]] },
  },
  {
    id: "sun",
    name: { en: "sun", fr: "soleil", es: "sol", pt: "sol" },
    the: { en: "the sun", fr: "le soleil", es: "el sol", pt: "o sol" },
    // A smiling sun; its ten rays sit between the dots.
    outline: circle(50, 50, 26),
    paint: "yellow",
    regions: [
      ...Array.from({ length: 10 }, (_, i): DrawingRegion => ({ d: ray(50, 50, 22, 45, -72 + 36 * i, 9), paint: "orange", under: true })),
      { d: circle(36, 56, 3.5), paint: "pink" },
      { d: circle(64, 56, 3.5), paint: "pink" },
    ],
    details: [...eye(42, 46, 3), ...eye(58, 46, 3), { d: "M43 56 Q50 62.5 57 56", width: 1 }],
    start: { x: 50, y: 24 },
    levels: ["easy"],
    dots: { easy: ring(50, 50, 26, 10, -90) },
  },
  {
    id: "sailboat",
    name: { en: "sailboat", fr: "bateau", es: "velero", pt: "veleiro" },
    the: { en: "the sailboat", fr: "le bateau", es: "el velero", pt: "o veleiro" },
    // Two sails on a mast, the hull below, little waves.
    outline: "M48 8 L86 64 L92 64 L78 86 L22 86 L8 64 L44 20 L44 64 L48 64 Z",
    paint: "yellow",
    regions: [{ d: "M0 64 L100 64 L100 100 L0 100 Z", paint: "red", clip: true }],
    details: [{ d: "M12 93 Q19 89 26 93 Q33 97 40 93 M60 93 Q67 89 74 93 Q81 97 88 93", width: 0.9 }],
    start: { x: 48, y: 8 },
    levels: ["easy", "medium"],
    dots: { easy: [[48, 8], [67, 36], [86, 64], [92, 64], [78, 86], [22, 86], [8, 64], [26, 42], [44, 20], [44, 64]] },
  },
  {
    id: "kite",
    name: { en: "kite", fr: "cerf-volant", es: "papalote", pt: "pipa" },
    the: { en: "the kite", fr: "le cerf-volant", es: "el papalote", pt: "a pipa" },
    // A diamond kite in two colours, with its tail.
    outline: "M50 6 L80 40 L50 82 L20 40 Z",
    paint: "yellow",
    regions: [
      { d: "M50 0 L100 0 L100 40 L50 40 Z", paint: "red", clip: true },
      { d: "M0 40 L50 40 L50 100 L0 100 Z", paint: "red", clip: true },
    ],
    details: [{ d: "M50 86 C44 90 56 94 50 99", width: 0.9 }],
    start: { x: 50, y: 6 },
    levels: ["easy"],
    dots: { easy: [[50, 6], [65, 23], [80, 40], [70, 54], [60, 68], [50, 82], [40, 68], [30, 54], [20, 40], [35, 23]] },
  },
  {
    id: "ice-cream",
    name: { en: "ice cream", fr: "cornet de glace", es: "helado", pt: "sorvete" },
    the: { en: "the ice cream", fr: "le cornet de glace", es: "el helado", pt: "o sorvete" },
    // A scoop with sprinkles on a waffle cone.
    outline:
      "M50 10 C64 10 75 20 75 33 C79 35 81 39 80 43 L50 94 L20 43 C19 39 21 35 25 33 C25 20 36 10 50 10 Z",
    paint: "pink",
    regions: [
      {
        d: "M0 42 L22 42 Q26 48 30 42 Q35 50 40 42 Q45 48 50 42 Q55 50 60 42 Q65 48 70 42 Q74 48 78 42 L100 42 L100 100 L0 100 Z",
        paint: "orange",
        clip: true,
      },
    ],
    details: [
      { d: "M40 22 L43 20 M55 18 L58 20 M47 29 L50 28 M60 30 L62 33 M38 34 L40 31 M51 37 L54 36", width: 1.1 },
      { d: "M40 58 L56 74 M60 58 L46 72", width: 0.7 },
    ],
    start: { x: 50, y: 10 },
    levels: ["easy", "medium"],
    dots: { easy: [[50, 10], [66, 14], [75, 30], [80, 42], [65, 68], [50, 94], [35, 68], [20, 42], [25, 30], [34, 14]] },
  },
  {
    id: "mushroom",
    name: { en: "mushroom", fr: "champignon", es: "hongo", pt: "cogumelo" },
    the: { en: "the mushroom", fr: "le champignon", es: "el hongo", pt: "o cogumelo" },
    // A spotted cap on a stem with a little face.
    outline:
      "M50 10 C74 10 92 28 92 46 C92 52 86 54 66 54 L66 80 C66 88 60 92 50 92 C40 92 34 88 34 80 L34 54 C14 54 8 52 8 46 C8 28 26 10 50 10 Z",
    paint: "red",
    regions: [
      { d: "M0 54 L100 54 L100 100 L0 100 Z", paint: "brown", clip: true },
      { d: circle(30, 34, 6), paint: "yellow" },
      { d: circle(55, 22, 5.5), paint: "yellow" },
      { d: circle(73, 38, 5), paint: "yellow" },
      { d: circle(50, 42, 4.5), paint: "yellow" },
    ],
    details: [...eye(44, 67, 2.4), ...eye(56, 67, 2.4), { d: "M46 74 Q50 78 54 74", width: 1 }],
    start: { x: 50, y: 10 },
    levels: ["easy", "medium"],
    dots: { easy: [[50, 10], [78, 18], [92, 44], [66, 54], [66, 86], [50, 92], [34, 86], [34, 54], [8, 44], [22, 18]] },
  },
  {
    id: "tree",
    name: { en: "tree", fr: "arbre", es: "árbol", pt: "árvore" },
    the: { en: "the tree", fr: "l'arbre", es: "el árbol", pt: "a árvore" },
    // A round leafy crown with apples, on a trunk.
    outline:
      "M50 8 C62 8 70 16 70 24 C80 24 88 32 86 44 C92 50 90 64 78 66 C72 72 62 72 56 68 L56 90 L44 90 L44 68 C38 72 28 72 22 66 C10 64 8 50 14 44 C12 32 20 24 30 24 C30 16 38 8 50 8 Z",
    paint: "green",
    regions: [
      { d: "M40 68 L60 68 L60 100 L40 100 Z", paint: "brown", clip: true },
      { d: circle(36, 38, 4), paint: "red" },
      { d: circle(62, 32, 4), paint: "red" },
      { d: circle(64, 52, 4), paint: "red" },
      { d: circle(32, 52, 3.6), paint: "red" },
    ],
    details: [],
    start: { x: 60, y: 9 },
    levels: ["easy", "medium"],
    dots: { easy: [[60, 9], [80, 26], [88, 52], [56, 70], [56, 90], [44, 90], [44, 70], [12, 52], [20, 26], [40, 9]] },
  },
  {
    id: "umbrella",
    name: { en: "umbrella", fr: "parapluie", es: "paraguas", pt: "guarda-chuva" },
    the: { en: "the umbrella", fr: "le parapluie", es: "el paraguas", pt: "o guarda-chuva" },
    // An open umbrella in stripes, with a hooked handle.
    outline:
      "M50 12 C74 12 92 30 94 52 Q83 46 72 52 Q61 46 50 52 Q39 46 28 52 Q17 46 6 52 C8 30 26 12 50 12 Z",
    paint: "red",
    regions: [
      { d: "M48 50 L52 50 L52 82 C52 90 40 90 40 82 L44 82 C44 86 48 86 48 82 Z", paint: "brown", under: true },
      { d: "M50 10 Q34 28 28 56 L50 56 Z", paint: "yellow", clip: true },
      { d: "M50 10 Q66 28 72 56 L100 56 L100 0 Z", paint: "yellow", clip: true },
    ],
    details: [],
    start: { x: 60, y: 13 },
    levels: ["easy"],
    dots: { easy: [[60, 13], [84, 26], [94, 52], [72, 52], [58, 49], [42, 49], [28, 52], [6, 52], [16, 26], [40, 13]] },
  },
  {
    id: "carrot",
    name: { en: "carrot", fr: "carotte", es: "zanahoria", pt: "cenoura" },
    the: { en: "the carrot", fr: "la carotte", es: "la zanahoria", pt: "a cenoura" },
    // A carrot with its green top.
    outline: "M50 92 C44 80 30 46 30 36 C30 28 38 24 50 24 C62 24 70 28 70 36 C70 46 56 80 50 92 Z",
    paint: "orange",
    regions: [
      { d: "M46 27 C40 15 38 7 42 3 C48 9 50 17 50 27 Z", paint: "green", under: true },
      { d: "M50 27 C50 17 54 7 60 4 C62 11 58 21 54 27 Z", paint: "green", under: true },
    ],
    details: [{ d: "M38 44 L45 44 M55 54 L62 54 M42 66 L48 66 M52 76 L56 76", width: 0.9 }],
    start: { x: 50, y: 92 },
    levels: ["medium"],
  },
  {
    id: "pear",
    name: { en: "pear", fr: "poire", es: "pera", pt: "pera" },
    the: { en: "the pear", fr: "la poire", es: "la pera", pt: "a pera" },
    // A pear with a stem and a leaf.
    outline:
      "M50 14 C56 14 58 20 59 28 C60 38 76 50 76 68 C76 84 64 92 50 92 C36 92 24 84 24 68 C24 50 40 38 41 28 C42 20 44 14 50 14 Z",
    paint: "green",
    regions: [
      { d: "M49 16 C49 10 50 6 53 3 L56 5 C53 8 52 11 52 16 Z", paint: "brown", under: true },
      { d: "M55 9 C59 3 67 3 71 6 C67 11 61 13 55 9 Z", paint: "green", under: true },
      { d: "M32 66 C32 58 36 52 40 50 C38 56 37 62 38 70 C38 74 32 74 32 66 Z", paint: "yellow", clip: true },
    ],
    details: [],
    start: { x: 50, y: 14 },
    levels: ["medium"],
  },
  {
    id: "strawberry",
    name: { en: "strawberry", fr: "fraise", es: "fresa", pt: "morango" },
    the: { en: "the strawberry", fr: "la fraise", es: "la fresa", pt: "o morango" },
    // A strawberry with seeds and a leafy top.
    outline: "M50 22 C64 18 82 22 84 36 C86 54 66 82 50 92 C34 82 14 54 16 36 C18 22 36 18 50 22 Z",
    paint: "red",
    regions: [
      { d: "M48 21 L48 10 L52 10 L52 21 Z", paint: "brown", under: true },
      { d: "M22 30 L30 22 L36 32 L44 18 L50 30 L56 18 L64 32 L70 22 L78 30 L78 10 L22 10 Z", paint: "green", clip: true },
    ],
    details: [
      [38, 44], [50, 42], [62, 44], [32, 56], [44, 56], [56, 56], [68, 56], [40, 68], [52, 68], [60, 68], [48, 79],
    ].map(([x, y]): DrawingDetail => ({ d: ellipse(x, y, 0.9, 1.5), fill: "ink" })),
    start: { x: 50, y: 22 },
    levels: ["medium"],
  },
  {
    id: "flower",
    name: { en: "flower", fr: "fleur", es: "flor", pt: "flor" },
    the: { en: "the flower", fr: "la fleur", es: "la flor", pt: "a flor" },
    // Five round petals, a stem and two leaves.
    outline: petals(50, 41, 5, 24, 14.5),
    paint: "pink",
    regions: [
      { d: "M48 68 L52 68 L52 97 L48 97 Z", paint: "green", under: true },
      { d: "M52 89 C58 81 68 79 74 81 C70 89 60 93 52 91 Z", paint: "green", under: true },
      { d: "M48 85 C42 77 32 75 26 77 C30 85 40 89 48 87 Z", paint: "green", under: true },
      { d: circle(50, 41, 12), paint: "yellow" },
    ],
    details: [...eye(45.5, 38.5, 2.2), ...eye(54.5, 38.5, 2.2), { d: "M46 45 Q50 48.5 54 45", width: 1 }],
    start: { x: 50, y: 2.5 },
    levels: ["medium"],
    dots: { medium: petalDots(50, 41, 5, 24, 14.5) },
  },
  {
    id: "dog",
    name: { en: "dog", fr: "chien", es: "perro", pt: "cachorro" },
    the: { en: "the dog", fr: "le chien", es: "el perro", pt: "o cachorro" },
    // A puppy's face with floppy ears and a patch over one eye.
    outline:
      "M30 22 C38 14 62 14 70 22 C76 16 88 18 90 30 C92 44 86 56 78 56 C76 70 64 82 50 82 C36 82 24 70 22 56 C14 56 8 44 10 30 C12 18 24 16 30 22 Z",
    paint: "yellow",
    regions: [
      { d: "M70 22 C74 32 76 44 78 56 L100 56 L100 0 L70 0 Z", paint: "brown", clip: true },
      { d: "M30 22 C26 32 24 44 22 56 L0 56 L0 0 L30 0 Z", paint: "brown", clip: true },
      { d: circle(60, 43, 8), paint: "brown" },
    ],
    details: [
      ...eye(40, 44, 3.4),
      ...eye(60, 44, 3.4),
      { d: ellipse(50, 59, 4.5, 3.2), fill: "ink" },
      { d: "M50 62 L50 67 M50 67 Q46 71 42.5 68 M50 67 Q54 71 57.5 68", width: 1 },
    ],
    start: { x: 50, y: 82 },
    levels: ["medium", "hard"],
  },
  {
    id: "bird",
    name: { en: "bird", fr: "oiseau", es: "pájaro", pt: "passarinho" },
    the: { en: "the bird", fr: "l'oiseau", es: "el pájaro", pt: "o passarinho" },
    // A round little bird facing left, a wing and two thin legs.
    outline:
      "M10 36 L22 30 C24 20 36 14 46 18 C54 22 56 30 54 38 C64 40 76 36 88 26 C88 42 84 60 72 70 C62 78 44 80 34 72 C24 64 22 52 26 44 Z",
    paint: "blue",
    regions: [
      { d: "M42 72 L45 72 L45 89 L42 89 Z", paint: "orange", under: true },
      { d: "M52 73 L55 73 L55 89 L52 89 Z", paint: "orange", under: true },
      { d: "M0 20 L24 28 L27 46 L0 50 Z", paint: "orange", clip: true },
      { d: "M42 52 C50 44 66 44 74 52 C66 62 50 62 42 52 Z", paint: "green" },
    ],
    details: [...eye(34, 29, 2.8)],
    start: { x: 10, y: 36 },
    levels: ["medium", "letters"],
  },
  {
    id: "turtle",
    name: { en: "turtle", fr: "tortue", es: "tortuga", pt: "tartaruga" },
    the: { en: "the turtle", fr: "la tortue", es: "la tortuga", pt: "a tartaruga" },
    // Walking right: a round shell, four short legs, a smiling head.
    outline:
      "M14 66 C14 40 30 26 50 26 C70 26 84 40 86 58 C90 50 98 52 98 60 C98 68 90 70 86 66 L86 70 L78 70 L78 80 L66 80 L66 70 L34 70 L34 80 L22 80 L22 70 L14 70 Z",
    paint: "yellow",
    regions: [
      { d: "M0 0 L86 0 L86 66 L0 66 Z", paint: "green", clip: true },
      { d: "M38 44 L50 36 L62 44 L62 56 L50 62 L38 56 Z", paint: "brown" },
      { d: circle(28, 54, 5), paint: "brown" },
      { d: circle(72, 54, 5), paint: "brown" },
    ],
    details: [...eye(91.5, 58, 2.2), { d: "M89 63.5 Q92.5 65.5 95.5 62.5", width: 0.9 }],
    start: { x: 14, y: 70 },
    levels: ["medium"],
  },
  {
    id: "snail",
    name: { en: "snail", fr: "escargot", es: "caracol", pt: "caracol" },
    the: { en: "the snail", fr: "l'escargot", es: "el caracol", pt: "o caracol" },
    // A round spiral shell on a long body, the head up on the left.
    outline:
      "M8 84 L8 66 C8 58 14 54 20 54 C26 54 30 58 30 64 L30 74 L37 74 C37 50 47 32 63 32 C79 32 91 44 91 60 C91 70 87 76 81 78 L94 80 C96 82 94 84 92 84 Z",
    paint: "yellow",
    regions: [{ d: "M37 0 L100 0 L100 78 L37 78 Z", paint: "orange", clip: true }],
    details: [
      { d: "M63 56 C63 52 69 52 69 57 C69 63 59 64 57 57 C55 48 67 44 73 50 C79 58 73 70 61 70 C49 70 45 56 49 48", width: 0.9 },
      { d: "M14 55 L10 45 M22 54.5 L26 45", width: 0.9 },
      { d: circle(10, 45, 1.5), fill: "ink" },
      { d: circle(26, 45, 1.5), fill: "ink" },
      ...eye(17, 64, 2.2),
      { d: "M14 71 Q18 74 22 71", width: 0.9 },
    ],
    start: { x: 8, y: 84 },
    levels: ["medium", "hard"],
  },
  {
    id: "whale",
    name: { en: "whale", fr: "baleine", es: "ballena", pt: "baleia" },
    the: { en: "the whale", fr: "la baleine", es: "la ballena", pt: "a baleia" },
    // A happy whale blowing water, its tail up on the right.
    outline:
      "M8 56 C8 36 26 26 46 26 C66 26 80 38 82 52 L92 40 C96 38 98 42 96 46 L90 58 L98 66 C98 72 94 72 90 70 L80 64 C74 76 60 84 42 84 C22 84 8 74 8 56 Z",
    paint: "blue",
    regions: [
      { d: "M44 28 C42 20 36 14 30 14 C36 10 44 12 48 18 C52 12 60 10 66 14 C60 14 54 20 52 28 Z", paint: "blue", under: true },
      { d: "M0 66 Q44 80 84 60 L100 100 L0 100 Z", paint: "yellow", clip: true },
    ],
    details: [...eye(25, 50, 2.6), { d: "M13 60 Q21 66 31 62", width: 1 }],
    start: { x: 8, y: 56 },
    levels: ["medium", "hard"],
  },
  {
    id: "owl",
    name: { en: "owl", fr: "chouette", es: "búho", pt: "coruja" },
    the: { en: "the owl", fr: "la chouette", es: "el búho", pt: "a coruja" },
    // Ear tufts, big round eyes, a beak and a round belly.
    outline:
      "M24 18 L36 28 C44 25 56 25 64 28 L76 18 L78 38 C84 48 84 64 78 76 C72 88 60 92 50 92 C40 92 28 88 22 76 C16 64 16 48 22 38 Z",
    paint: "purple",
    regions: [
      { d: "M38 88 L35 97 L45 97 L44 90 Z", paint: "orange", under: true },
      { d: "M62 88 L65 97 L55 97 L56 90 Z", paint: "orange", under: true },
      { d: circle(38, 46, 10), paint: "yellow" },
      { d: circle(62, 46, 10), paint: "yellow" },
      { d: "M46 56 L54 56 L50 63 Z", paint: "orange" },
      { d: ellipse(50, 77, 15, 10), paint: "pink" },
    ],
    details: [...eye(38, 46, 4.5), ...eye(62, 46, 4.5)],
    start: { x: 24, y: 18 },
    levels: ["medium", "letters"],
  },
  {
    id: "airplane",
    name: { en: "airplane", fr: "avion", es: "avión", pt: "avião" },
    the: { en: "the airplane", fr: "l'avion", es: "el avión", pt: "o avião" },
    // Seen from above: long body, wide wings, a small tail.
    outline:
      "M50 6 C54 6 56 12 56 18 L56 38 L92 54 L92 62 L56 54 L56 76 L68 86 L68 92 L50 88 L32 92 L32 86 L44 76 L44 54 L8 62 L8 54 L44 38 L44 18 C44 12 46 6 50 6 Z",
    paint: "grey",
    regions: [
      { d: "M56 0 L100 0 L100 100 L56 100 Z", paint: "red", clip: true },
      { d: "M44 0 L0 0 L0 100 L44 100 Z", paint: "red", clip: true },
      { d: "M46 20 C46 13 54 13 54 20 L54 24 L46 24 Z", paint: "blue" },
    ],
    details: [32, 40, 48, 56, 64].map((y): DrawingDetail => ({ d: circle(50, y, 1.6), fill: "white", width: 0.7 })),
    start: { x: 50, y: 6 },
    levels: ["medium", "hard"],
  },
  {
    id: "truck",
    name: { en: "truck", fr: "camion", es: "camión", pt: "caminhão" },
    the: { en: "the truck", fr: "le camion", es: "el camión", pt: "o caminhão" },
    // Side view, driving right: a big box, the cab, two wheels.
    outline: "M6 74 L6 30 L58 30 L58 44 L76 44 C82 44 86 50 90 58 L94 62 L94 74 Z",
    paint: "red",
    regions: [
      { d: circle(76, 76, 9), paint: "grey", under: true },
      { d: circle(24, 76, 9), paint: "grey", under: true },
      { d: circle(76, 76, 4.2), paint: "yellow", under: true },
      { d: circle(24, 76, 4.2), paint: "yellow", under: true },
      { d: "M0 0 L58 0 L58 100 L0 100 Z", paint: "green", clip: true },
      { d: "M62 48 L76 48 C79 48 81.5 51 84 57 L62 57 Z", paint: "blue" },
    ],
    details: [{ d: ellipse(91, 67, 1.8, 2.4), fill: "white", width: 0.9 }],
    start: { x: 6, y: 74 },
    levels: ["medium"],
  },
  {
    id: "cupcake",
    name: { en: "cupcake", fr: "cupcake", es: "pastelito", pt: "cupcake" },
    the: { en: "the cupcake", fr: "le cupcake", es: "el pastelito", pt: "o cupcake" },
    // Swirly frosting and a cherry, in a striped paper cup.
    outline:
      "M50 10 C58 10 62 16 62 20 C72 20 80 28 80 36 C86 38 88 44 84 50 L76 90 L24 90 L16 50 C12 44 14 38 20 36 C20 28 28 20 38 20 C38 16 42 10 50 10 Z",
    paint: "pink",
    regions: [
      { d: circle(50, 6, 5), paint: "red", under: true },
      { d: "M0 50 L100 50 L100 100 L0 100 Z", paint: "purple", clip: true },
    ],
    details: [
      { d: "M36 55 L38 86 M50 55 L50 86 M64 55 L62 86", width: 0.8 },
      { d: "M34 30 L37 28 M58 26 L61 28 M46 36 L49 35 M66 40 L68 43 M28 42 L30 39", width: 1.1 },
    ],
    start: { x: 16, y: 50 },
    levels: ["medium"],
  },
];

export function getDrawing(id: string): Drawing {
  const d = DRAWINGS.find((x) => x.id === id);
  if (!d) throw new Error(`No drawing "${id}"`);
  return d;
}
