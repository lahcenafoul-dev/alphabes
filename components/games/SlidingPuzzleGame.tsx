"use client";

// A sliding puzzle (lib/puzzles.ts): the picture cut into 3 × 3 or 4 × 4
// tiles, one missing. Tap or click a tile next to the gap to slide it, or use
// the arrow keys. Shuffles are made of random legal moves from the solved
// picture, so every puzzle can be solved. Progress lives in memory only.
import { useCallback, useEffect, useRef, useState } from "react";
import Owl from "@/components/home/Owl";
import type { PuzzleSize } from "@/lib/puzzles";
import { chime } from "@/lib/sounds";

export type SlidingPuzzleText = {
  moves: string;
  shuffle: string;
  showNumbers: string;
  size: string;
  /** "How it should look". */
  model: string;
  /** "Tile {n}", for screen readers. */
  tile: string;
  board: string;
  /** "You did it in {n} moves!" */
  solved: string;
  playAgain: string;
};

type Props = { image: string; alt: string; size: PuzzleSize; text: SlidingPuzzleText };

/** tiles[position] = the tile there; the last tile number (n² − 1) is the gap. */
function solvedTiles(n: number): number[] {
  return Array.from({ length: n * n }, (_, i) => i);
}

const isSolved = (tiles: number[]) => tiles.every((t, i) => t === i);

function neighbours(pos: number, n: number): number[] {
  const r = Math.floor(pos / n);
  const c = pos % n;
  const out: number[] = [];
  if (r > 0) out.push(pos - n);
  if (r < n - 1) out.push(pos + n);
  if (c > 0) out.push(pos - 1);
  if (c < n - 1) out.push(pos + 1);
  return out;
}

/** Random legal moves from the solved picture (never undoing the last one). */
export function shuffled(n: number): number[] {
  const tiles = solvedTiles(n);
  let gap = n * n - 1;
  let prev = -1;
  const steps = n === 3 ? 80 : 200;
  for (let k = 0; k < steps || isSolved(tiles); k++) {
    const options = neighbours(gap, n).filter((p) => p !== prev);
    const next = options[Math.floor(Math.random() * options.length)];
    [tiles[gap], tiles[next]] = [tiles[next], tiles[gap]];
    prev = gap;
    gap = next;
  }
  return tiles;
}

export default function SlidingPuzzleGame({ image, alt, size: initialSize, text }: Props) {
  const [size, setSize] = useState<PuzzleSize>(initialSize);
  const [tiles, setTiles] = useState<number[]>(() => shuffled(initialSize));
  const [moves, setMoves] = useState(0);
  const [numbers, setNumbers] = useState(false);
  const [won, setWon] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const n = size;
  const gapTile = n * n - 1;
  const gap = tiles.indexOf(gapTile);

  const restart = useCallback((s: PuzzleSize) => {
    setSize(s);
    setTiles(shuffled(s));
    setMoves(0);
    setWon(false);
  }, []);

  const slide = useCallback(
    (pos: number) => {
      if (won || !neighbours(gap, n).includes(pos)) return;
      const next = [...tiles];
      [next[gap], next[pos]] = [next[pos], next[gap]];
      setTiles(next);
      setMoves((m) => m + 1);
      if (isSolved(next)) {
        setWon(true);
        chime();
      }
    },
    [gap, n, tiles, won],
  );

  // Arrow keys move the tile next to the gap in that direction into it.
  const onKey = (e: React.KeyboardEvent) => {
    const r = Math.floor(gap / n);
    const c = gap % n;
    const from: Record<string, number | null> = {
      ArrowLeft: c < n - 1 ? gap + 1 : null,
      ArrowRight: c > 0 ? gap - 1 : null,
      ArrowUp: r < n - 1 ? gap + n : null,
      ArrowDown: r > 0 ? gap - n : null,
    };
    if (!(e.key in from)) return;
    e.preventDefault();
    const pos = from[e.key];
    if (pos !== null) slide(pos);
  };

  useEffect(() => {
    if (won) boardRef.current?.focus();
  }, [won]);

  const pct = 100 / n;
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <div
          ref={boardRef}
          role="group"
          aria-label={text.board}
          tabIndex={0}
          onKeyDown={onKey}
          className="relative mx-auto aspect-square w-full max-w-[480px] touch-manipulation select-none rounded-block bg-chalkboard/10 p-1 outline-none focus-visible:ring-4 focus-visible:ring-crayon-blue/50"
        >
          <div className="relative h-full w-full">
            {tiles.map((tile, pos) => {
              if (tile === gapTile && !won) return null;
              const r = Math.floor(pos / n);
              const c = pos % n;
              const tr = Math.floor(tile / n);
              const tc = tile % n;
              const movable = !won && neighbours(gap, n).includes(pos);
              return (
                <button
                  key={tile}
                  type="button"
                  onClick={() => slide(pos)}
                  disabled={!movable}
                  aria-label={text.tile.replace("{n}", String(tile + 1))}
                  className="absolute p-[2px] motion-safe:transition-[left,top] motion-safe:duration-150 disabled:cursor-default"
                  style={{ left: `${c * pct}%`, top: `${r * pct}%`, width: `${pct}%`, height: `${pct}%` }}
                >
                  <span
                    className={`relative block h-full w-full overflow-hidden ${won ? "" : "rounded-md shadow-sm"} ${movable ? "ring-2 ring-white/80" : ""}`}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${n * 100}% ${n * 100}%`,
                      backgroundPosition: `${(tc / (n - 1)) * 100}% ${(tr / (n - 1)) * 100}%`,
                    }}
                  >
                    {numbers && !won && (
                      <span className="absolute left-1 top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-white/90 px-1 font-display text-base font-extrabold text-chalkboard shadow">
                        {tile + 1}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p aria-live="polite" className="mt-3 text-center font-bold text-chalkboard/80">
          {won ? text.solved.replace("{n}", String(moves)) : `${text.moves}: ${moves}`}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 md:w-48">
        <figure className="w-36 md:w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} width={192} height={192} className="w-full rounded-block border border-chalkboard/10" />
          <figcaption className="mt-1 text-center text-sm text-chalkboard/70">{text.model}</figcaption>
        </figure>

        {won && <Owl mood="happy" className="w-28" />}

        <div className="flex w-full flex-wrap justify-center gap-2">
          <button type="button" onClick={() => restart(size)} className="rounded-full bg-crayon-blue px-4 py-2 font-bold text-white">
            {won ? text.playAgain : text.shuffle}
          </button>
          <button
            type="button"
            aria-pressed={numbers}
            onClick={() => setNumbers((v) => !v)}
            className={`rounded-full border-2 border-crayon-blue px-4 py-2 font-bold ${numbers ? "bg-crayon-blue/15" : ""}`}
          >
            {text.showNumbers}
          </button>
        </div>

        <fieldset className="flex items-center gap-2 text-sm font-bold">
          <legend className="sr-only">{text.size}</legend>
          {([3, 4] as PuzzleSize[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={size === s}
              onClick={() => restart(s)}
              className={`rounded-full px-3 py-1 ${size === s ? "bg-chalkboard text-white" : "border border-chalkboard/30"}`}
            >
              {s}×{s}
            </button>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
