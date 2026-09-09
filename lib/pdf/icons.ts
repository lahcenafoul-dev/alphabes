// Original, simple vector line-art for each letter's primary example word
// (lib/letters-data.ts exampleWords[0]), used by the coloring, matching, and
// beginning-sounds PDF templates. Drawn with jsPDF's own vector primitives
// (no raster images, no emoji -- jsPDF does not render color emoji glyphs)
// so output stays crisp at any print size and safe in black-and-white.
//
// All icons are built from a handful of shared shape primitives so the set
// stays visually consistent. Every shape is outline-only (stroke, no fill)
// so pages remain printer- and coloring-friendly.
import type { jsPDF } from "jspdf";

const INK: [number, number, number] = [60, 60, 60];

function setInk(doc: jsPDF, weight = 0.8) {
  doc.setDrawColor(...INK);
  doc.setLineWidth(weight);
}

// ---------- shared primitives ----------

/** A round fruit/object: circle body + stem + leaf. */
function roundFruit(doc: jsPDF, cx: number, cy: number, size: number, opts?: { leaf?: boolean; segments?: boolean }) {
  setInk(doc);
  const r = size / 2;
  doc.circle(cx, cy + r * 0.15, r, "S");
  // stem
  doc.line(cx, cy - r * 0.85, cx + r * 0.1, cy - r * 1.15);
  if (opts?.leaf !== false) {
    doc.triangle(cx + r * 0.1, cy - r * 1.1, cx + r * 0.55, cy - r * 1.25, cx + r * 0.3, cy - r * 0.75, "S");
  }
  if (opts?.segments) {
    doc.line(cx - r * 0.6, cy + r * 0.15, cx + r * 0.6, cy + r * 0.15);
    doc.line(cx, cy - r * 0.5, cx, cy + r * 0.85);
  }
}

type EarStyle = "triangle" | "round" | "floppy" | "none";

/** A simple animal head: circle + ears + eyes + optional snout. */
function animalHead(
  doc: jsPDF,
  cx: number,
  cy: number,
  size: number,
  ears: EarStyle,
  opts?: { snout?: boolean; mane?: boolean; stripes?: boolean; horns?: boolean; longEars?: boolean; trunk?: boolean }
) {
  setInk(doc);
  const r = size / 2;

  if (opts?.mane) {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const x1 = cx + Math.cos(angle) * r * 1.05;
      const y1 = cy + Math.sin(angle) * r * 1.05;
      const x2 = cx + Math.cos(angle) * r * 1.45;
      const y2 = cy + Math.sin(angle) * r * 1.45;
      doc.line(x1, y1, x2, y2);
    }
  }

  // ears
  if (ears === "triangle") {
    doc.triangle(cx - r * 0.8, cy - r * 0.5, cx - r * 0.35, cy - r * 1.35, cx - r * 0.05, cy - r * 0.55, "S");
    doc.triangle(cx + r * 0.8, cy - r * 0.5, cx + r * 0.35, cy - r * 1.35, cx + r * 0.05, cy - r * 0.55, "S");
  } else if (ears === "round") {
    doc.circle(cx - r * 0.75, cy - r * 0.85, r * 0.3, "S");
    doc.circle(cx + r * 0.75, cy - r * 0.85, r * 0.3, "S");
  } else if (ears === "floppy") {
    doc.ellipse(cx - r * 0.95, cy - r * 0.1, r * 0.28, r * (opts?.longEars ? 0.9 : 0.55), "S");
    doc.ellipse(cx + r * 0.95, cy - r * 0.1, r * 0.28, r * (opts?.longEars ? 0.9 : 0.55), "S");
  }

  if (opts?.horns) {
    doc.line(cx - r * 0.3, cy - r * 0.9, cx - r * 0.5, cy - r * 1.4);
    doc.line(cx + r * 0.3, cy - r * 0.9, cx + r * 0.5, cy - r * 1.4);
  }

  // head
  doc.circle(cx, cy, r, "S");

  // eyes
  doc.circle(cx - r * 0.35, cy - r * 0.1, r * 0.08, "S");
  doc.circle(cx + r * 0.35, cy - r * 0.1, r * 0.08, "S");

  // snout / trunk / nose
  if (opts?.trunk) {
    doc.line(cx, cy + r * 0.3, cx, cy + r * 1.1);
    doc.line(cx, cy + r * 1.1, cx + r * 0.25, cy + r * 1.15);
  } else if (opts?.snout) {
    doc.ellipse(cx, cy + r * 0.4, r * 0.35, r * 0.2, "S");
  } else {
    doc.circle(cx, cy + r * 0.35, r * 0.06, "S");
  }

  if (opts?.stripes) {
    for (let i = -1; i <= 1; i++) {
      doc.line(cx + i * r * 0.35, cy - r * 0.75, cx + i * r * 0.35 - r * 0.15, cy + r * 0.9);
    }
  }
}

/** A dome/building shape (igloo, crown-topped head). */
function boxShape(doc: jsPDF, cx: number, cy: number, size: number, opts?: { crown?: boolean }) {
  setInk(doc);
  const r = size / 2;
  if (opts?.crown) {
    doc.circle(cx, cy + r * 0.3, r * 0.55, "S");
    doc.triangle(cx - r * 0.5, cy - r * 0.15, cx - r * 0.15, cy - r * 0.75, cx, cy - r * 0.15, "S");
    doc.triangle(cx - r * 0.2, cy - r * 0.15, cx, cy - r * 0.9, cx + r * 0.2, cy - r * 0.15, "S");
    doc.triangle(cx, cy - r * 0.15, cx + r * 0.15, cy - r * 0.75, cx + r * 0.5, cy - r * 0.15, "S");
    doc.line(cx - r * 0.5, cy - r * 0.15, cx + r * 0.5, cy - r * 0.15);
    return;
  }
  // igloo: half-dome of stacked arcs + arched doorway
  doc.ellipse(cx, cy, r, r * 0.65, "S");
  doc.line(cx - r, cy, cx + r, cy);
  doc.line(cx - r * 0.7, cy, cx - r * 0.7, cy - r * 0.35);
  doc.line(cx - r * 0.2, cy, cx - r * 0.2, cy - r * 0.55);
  doc.line(cx + r * 0.3, cy, cx + r * 0.3, cy - r * 0.5);
  doc.ellipse(cx + r * 0.15, cy + r * 0.1, r * 0.22, r * 0.32, "S");
}

/** A sun-like burst: circle with radiating rays. */
function skyShape(doc: jsPDF, cx: number, cy: number, size: number) {
  setInk(doc);
  const r = size / 2;
  doc.circle(cx, cy, r * 0.55, "S");
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const x1 = cx + Math.cos(angle) * r * 0.7;
    const y1 = cy + Math.sin(angle) * r * 0.7;
    const x2 = cx + Math.cos(angle) * r * 1.05;
    const y2 = cy + Math.sin(angle) * r * 1.05;
    doc.line(x1, y1, x2, y2);
  }
}

/** A simple van/car: rounded body + wheels + window. */
function vehicle(doc: jsPDF, cx: number, cy: number, size: number) {
  setInk(doc);
  const w = size;
  const h = size * 0.55;
  doc.roundedRect(cx - w / 2, cy - h / 2, w, h, 3, 3, "S");
  doc.line(cx - w * 0.15, cy - h / 2, cx - w * 0.15, cy + h / 2);
  doc.rect(cx - w * 0.05, cy - h * 0.35, w * 0.32, h * 0.4, "S");
  doc.circle(cx - w * 0.28, cy + h / 2, h * 0.22, "S");
  doc.circle(cx + w * 0.28, cy + h / 2, h * 0.22, "S");
}

// ---------- per-word drawers ----------

export const ICONS: Record<string, (doc: jsPDF, cx: number, cy: number, size: number) => void> = {
  apple: (doc, cx, cy, size) => roundFruit(doc, cx, cy, size),
  ball: (doc, cx, cy, size) => roundFruit(doc, cx, cy, size, { leaf: false, segments: true }),
  cat: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "triangle"),
  dog: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "floppy", { snout: true }),
  elephant: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "floppy", { longEars: true, trunk: true }),
  fish: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    doc.ellipse(cx, cy, r, r * 0.6, "S");
    doc.triangle(cx - r, cy, cx - r * 1.4, cy - r * 0.35, cx - r * 1.4, cy + r * 0.35, "S");
    doc.circle(cx + r * 0.5, cy - r * 0.1, r * 0.08, "S");
  },
  goat: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "none", { horns: true, snout: true }),
  horse: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "none", { mane: true, snout: true }),
  igloo: (doc, cx, cy, size) => boxShape(doc, cx, cy, size),
  jelly: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    doc.ellipse(cx, cy - r * 0.1, r, r * 0.75, "S");
    for (let i = -1; i <= 1; i++) {
      doc.line(cx + i * r * 0.35, cy + r * 0.55, cx + i * r * 0.35 - r * 0.1, cy + r * 1.1);
    }
  },
  kite: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    doc.triangle(cx, cy - r, cx - r * 0.7, cy, cx, cy + r * 0.2, "S");
    doc.triangle(cx, cy - r, cx + r * 0.7, cy, cx, cy + r * 0.2, "S");
    doc.line(cx, cy + r * 0.2, cx, cy + r * 1.3);
  },
  lion: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "round", { mane: true, snout: true }),
  monkey: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "round", { snout: true }),
  nest: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    doc.ellipse(cx, cy + r * 0.3, r, r * 0.5, "S");
    doc.ellipse(cx - r * 0.3, cy, r * 0.22, r * 0.16, "S");
    doc.ellipse(cx + r * 0.05, cy - r * 0.05, r * 0.22, r * 0.16, "S");
    doc.ellipse(cx + r * 0.4, cy, r * 0.22, r * 0.16, "S");
  },
  orange: (doc, cx, cy, size) => roundFruit(doc, cx, cy, size, { segments: true }),
  pig: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "triangle", { snout: true }),
  queen: (doc, cx, cy, size) => boxShape(doc, cx, cy, size, { crown: true }),
  rabbit: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "floppy", { longEars: true }),
  sun: (doc, cx, cy, size) => skyShape(doc, cx, cy, size),
  tiger: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "triangle", { stripes: true }),
  umbrella: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const x = cx - r + t * r * 2;
      doc.line(x, cy, cx, cy - r);
    }
    doc.line(cx - r, cy, cx + r, cy);
    doc.line(cx, cy, cx, cy + r * 1.2);
    doc.line(cx, cy + r * 1.2, cx + r * 0.2, cy + r * 1.1);
  },
  van: (doc, cx, cy, size) => vehicle(doc, cx, cy, size),
  whale: (doc, cx, cy, size) => {
    setInk(doc);
    const r = size / 2;
    doc.ellipse(cx, cy, r, r * 0.55, "S");
    doc.triangle(cx + r * 0.7, cy, cx + r * 1.2, cy - r * 0.3, cx + r * 1.2, cy + r * 0.3, "S");
    doc.line(cx - r * 0.3, cy - r * 0.55, cx - r * 0.3, cy - r * 0.9);
    doc.line(cx - r * 0.1, cy - r * 0.55, cx - r * 0.1, cy - r * 0.95);
  },
  xylophone: (doc, cx, cy, size) => {
    setInk(doc);
    const w = size;
    const bars = 5;
    for (let i = 0; i < bars; i++) {
      const barW = w * (1 - i * 0.12);
      const y = cy - size / 2 + i * (size / bars);
      doc.rect(cx - barW / 2, y, barW, size / bars - 2, "S");
    }
  },
  yak: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "none", { horns: true, mane: true, snout: true }),
  zebra: (doc, cx, cy, size) => animalHead(doc, cx, cy, size, "none", { mane: true, stripes: true, snout: true }),
};

/** Used only if a lookup ever misses one of the 26 primary words above. */
export function drawFallbackIcon(doc: jsPDF, cx: number, cy: number, size: number, letter: string): void {
  setInk(doc);
  const half = size / 2;
  doc.roundedRect(cx - half, cy - half, size, size, 3, 3, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size * 2.2);
  doc.setTextColor(...INK);
  doc.text(letter.toUpperCase(), cx, cy + size * 0.18, { align: "center" });
}
