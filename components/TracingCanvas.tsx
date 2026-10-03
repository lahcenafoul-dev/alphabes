"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * School ruling drawn behind cursive: French Seyès lines (baseline, x-height
 * and two lines above, one below), the four guide lines of Spanish-language
 * "doble raya" notebooks (capital line, dashed middle line, baseline,
 * descender line), or Brazilian "caligrafia" lines, the same four lines
 * spaced for Playwrite BR's tall loops and tails (1.3 x-heights above the
 * middle line and below the baseline).
 */
export type Ruling = "seyes" | "doble-raya" | "caligrafia";

type Labels = {
  clear: string;
  styleGroup: string;
  script: string;
  cursive: string;
  canvas: string;
};

type Props = {
  /** English page: the letter to trace (drawn uppercase). */
  letter?: string;
  /** Exact text to trace in print ("A a"); overrides `letter`. */
  text?: string;
  /** Adds a print/cursive toggle; `fontFamily` must be loaded by the page. */
  cursive?: { text: string; fontFamily: string; ruling?: Ruling };
  /**
   * Several print styles instead of one, shown before cursive in the toggle
   * (Portuguese: letra bastão "A", letra de forma "a"). Replaces `text`.
   */
  prints?: { text: string; label: string }[];
  /** Visible text; defaults to the English page's labels. */
  labels?: Partial<Labels>;
};

const DEFAULT_LABELS: Labels = {
  clear: "🔄 Clear & Retry",
  styleGroup: "Letter style",
  script: "Print",
  cursive: "Cursive",
  canvas: "",
};

const GUIDE_COLOR = "#c7d2fe";
const LINE_COLOR = "#e0e7ff";
const INK_COLOR = "#2563eb";

// Draws the dotted guide the child traces over, scaled to fit the canvas.
// In cursive, school-style ruling (baseline, x-height, ascender line) is
// drawn behind the letters.
function drawGuide(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  text: string,
  font: string | null,
  ruling: Ruling = "seyes",
) {
  ctx.clearRect(0, 0, w, h);
  const family = font ?? "sans-serif";
  const weight = font ? "" : "bold ";
  ctx.font = `${weight}100px ${family}`;
  const widthAt100 = ctx.measureText(text).width || 1;
  // Print letters keep their original size (70% of the height) unless the
  // text would overflow a narrow screen; cursive needs room for loops.
  const size = Math.min(h * (font ? 0.45 : 0.7), ((w * 0.85) / widthAt100) * 100);
  ctx.font = `${weight}${size}px ${family}`;
  ctx.textAlign = "center";

  if (font) {
    const m = ctx.measureText(text);
    const xHeight = ctx.measureText("x").actualBoundingBoxAscent;
    const ascent = m.actualBoundingBoxAscent;
    // Caligrafia lines span 3.6 x-heights (2.3 above the baseline, 1.3 below):
    // centre the lines rather than the letters so all four stay on the canvas.
    const baseline =
      ruling === "caligrafia" ? h / 2 + xHeight / 2 : h / 2 + (ascent - m.actualBoundingBoxDescent) / 2;
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;
    if (ruling === "doble-raya" || ruling === "caligrafia") {
      const outer = ruling === "caligrafia" ? 1.3 : 1;
      for (const [y, dashed] of [
        [baseline - xHeight * (1 + outer), false],
        [baseline - xHeight, true],
        [baseline, false],
        [baseline + xHeight * outer, false],
      ] as const) {
        ctx.setLineDash(dashed ? [8, 6] : []);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    } else {
      for (const y of [baseline, baseline - xHeight, baseline - xHeight * 2, baseline - xHeight * 3, baseline + xHeight]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
    ctx.textBaseline = "alphabetic";
    ctx.strokeStyle = GUIDE_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeText(text, w / 2, baseline);
  } else {
    ctx.textBaseline = "middle";
    ctx.strokeStyle = GUIDE_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeText(text, w / 2, h / 2);
  }
  ctx.setLineDash([]);
}

export default function TracingCanvas({ letter = "", text, cursive, prints, labels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [style, setStyle] = useState(0);
  const l = { ...DEFAULT_LABELS, ...labels };

  // The styles offered by the toggle, in order: the print style(s), then cursive.
  const styles: { label: string; text: string; font: string | null }[] = [
    ...(prints ?? [{ label: l.script, text: text ?? letter.toUpperCase() }]).map((p) => ({ ...p, font: null })),
    ...(cursive ? [{ label: l.cursive, text: cursive.text, font: cursive.fontFamily }] : []),
  ];
  const guideText = styles[style].text;
  const guideFont = styles[style].font;
  const ruling = cursive?.ruling;

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGuide(ctx, rect.width, rect.height, guideText, guideFont, ruling);
  }, [guideText, guideFont, ruling]);

  useEffect(() => {
    let cancelled = false;
    reset();
    // The cursive font downloads on first use; redraw once it's there.
    if (guideFont && document.fonts) {
      document.fonts.load(`40px ${guideFont}`, guideText).then(() => !cancelled && reset(), () => {});
    }
    window.addEventListener("resize", reset);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", reset);
    };
  }, [reset, guideFont, guideText]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(e);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK_COLOR;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => {
    drawing.current = false;
  };

  return (
    <div className="mt-4">
      {styles.length > 1 && (
        <div role="group" aria-label={l.styleGroup} className="mb-3 inline-flex rounded-full border-2 border-chalkboard/15 p-0.5 font-display font-bold text-sm">
          {styles.map((s, i) => (
            <button
              key={s.label}
              type="button"
              aria-pressed={style === i}
              onClick={() => setStyle(i)}
              className={`rounded-full px-4 py-1.5 ${style === i ? "bg-chalkboard text-paper" : "text-chalkboard/70 hover:text-chalkboard"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={l.canvas || undefined}
        className="w-full h-64 rounded-block border-2 border-dashed border-crayon-blue/40 bg-white touch-none cursor-crosshair"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onPointerLeave={stop}
      />
      <button
        onClick={reset}
        className="mt-3 rounded-block bg-crayon-red text-white px-4 py-2 font-bold text-sm"
      >
        {l.clear}
      </button>
    </div>
  );
}
