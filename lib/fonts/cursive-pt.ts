import { Playwrite_BR } from "next/font/google";

// Brazilian school cursive (letra cursiva), from Google Fonts' Playwrite
// project: Playwrite BR, TypeTogether's Brazilian school model
// (docs/portuguese-plan.md, P6). SIL Open Font License 1.1, "Copyright 2023
// The Playwrite Project Authors", no Reserved Font Name: use and embedding in
// a commercial product are allowed (checked 2026-10-03). It covers ç, ã, õ,
// á â à é ê í ó ô ú and ü. Its x-height is 0.5 em, loops and capitals reach
// about 1.15 em and tails -0.65 em, so its guide lines ("caligrafia" in
// TracingCanvas) are 1.3 x-heights above and below the middle zone. Imported
// only by the Portuguese pages that show cursive.
//
// It has no subsets, so next/font never preloads it: the browser fetches it
// the first time cursive text is drawn.
export const cursivaFont = Playwrite_BR({ display: "swap" });
