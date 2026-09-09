"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import WorksheetIcon from "@/components/icons/WorksheetIcon";
import { WORKSHEET_TYPES } from "@/lib/worksheet-types";

export type LibraryCardData = {
  slug: string;
  title: string;
  letter: string;
  uppercase: string;
  worksheetType: string;
  typeLabel: string;
  ageLevelLabel: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  primaryWord: string;
};

const PAGE_SIZE = 24;

export default function WorksheetLibrary({ items }: { items: LibraryCardData[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("");
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const letters = useMemo(() => Array.from(new Set(items.map((i) => i.letter))).sort(), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (letter && item.letter !== letter) return false;
      if (type && item.worksheetType !== type) return false;
      if (difficulty && item.difficulty !== difficulty) return false;
      if (q && !item.title.toLowerCase().includes(q) && !item.primaryWord.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, letter, type, difficulty]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
          placeholder="Search worksheets…"
          aria-label="Search worksheets"
          className="rounded-block border border-chalkboard/20 px-3 py-2 sm:col-span-2"
        />
        <select
          value={letter}
          onChange={(e) => { setLetter(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label="Filter by letter"
          className="rounded-block border border-chalkboard/20 px-3 py-2"
        >
          <option value="">All letters</option>
          {letters.map((l) => (
            <option key={l} value={l}>Letter {l.toUpperCase()}</option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label="Filter by worksheet type"
          className="rounded-block border border-chalkboard/20 px-3 py-2"
        >
          <option value="">All types</option>
          {WORKSHEET_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); setVisible(PAGE_SIZE); }}
          aria-label="Filter by difficulty"
          className="rounded-block border border-chalkboard/20 px-3 py-2 sm:col-span-4 sm:w-56"
        >
          <option value="">All difficulty levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <p className="mt-4 text-sm text-chalkboard/60">
        {filtered.length} worksheet{filtered.length === 1 ? "" : "s"} found
      </p>

      <ul className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {shown.map((item) => (
          <li key={item.slug} className="rounded-block border border-chalkboard/10 p-5 shadow-block">
            <div className="flex items-center gap-3">
              <div className="letter-block bg-crayon-blue h-12 w-12 text-lg shrink-0">{item.uppercase}</div>
              <WorksheetIcon word={item.primaryWord} className="h-12 w-12 text-chalkboard/70" />
              <span className="sr-only">{item.primaryWord} illustration</span>
            </div>
            <p className="mt-3 font-display font-bold">{item.title}</p>
            <p className="mt-1 text-sm text-chalkboard/60">
              {item.typeLabel} · {item.ageLevelLabel}
            </p>
            <Link
              href={`/worksheets/${item.slug}`}
              className="mt-3 inline-block rounded-block bg-chalkboard text-paper font-display font-bold px-4 py-2 text-sm shadow-block hover:shadow-blockHover transition"
            >
              View Worksheet
            </Link>
          </li>
        ))}
      </ul>

      {visible < filtered.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-block border border-chalkboard/20 px-5 py-2.5 font-display font-bold hover:border-crayon-blue"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
