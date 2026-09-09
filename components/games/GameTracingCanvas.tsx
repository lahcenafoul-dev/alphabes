"use client";

// A dedicated tracing canvas for the Letter Tracing game. This is a
// near-copy of components/TracingCanvas.tsx, kept separate rather than
// reusing that component directly: TracingCanvas always uppercases its
// guide letter regardless of the `letter` prop, which would make this
// game's uppercase/lowercase toggle a no-op. Modifying the shared
// component to respect case would risk changing the existing
// /alphabet/[letter]/worksheet page's behavior, so this game gets its own
// copy instead, correctly respecting whatever exact string it's given.
import { useEffect, useRef } from "react";

export default function GameTracingCanvas({ letter }: { letter: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const drawGuideLetter = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = `bold ${h * 0.7}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#c7d2fe";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeText(letter, w / 2, h / 2);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGuideLetter(ctx, rect.width, rect.height);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [letter]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawing.current = true;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#2563eb";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGuideLetter(ctx, rect.width, rect.height);
  };

  return (
    <div className="mt-4">
      <canvas
        ref={canvasRef}
        className="w-full h-64 rounded-block border-2 border-dashed border-crayon-blue/40 bg-white touch-none cursor-crosshair"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <button
        onClick={clearCanvas}
        className="mt-3 rounded-block bg-crayon-red text-white px-4 py-2 font-bold text-sm"
      >
        🔄 Clear & Retry
      </button>
    </div>
  );
}
