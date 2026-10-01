import { Playwrite_MX } from "next/font/google";

// Spanish school cursive (letra cursiva / ligada), from Google Fonts'
// Playwrite project: Playwrite MX, the Mexican school model (owner's choice,
// docs/spanish-plan.md D7). SIL Open Font License 1.1 with no Reserved Font
// Name: use and embedding in a commercial product are allowed (checked
// 2026-10-01). It covers ñ, á é í ó ú, ü, ¿ and ¡, and its capitals are
// twice its x-height, which fits four-line "doble raya" guides. Imported
// only by the Spanish pages that show cursive.
//
// It has no subsets, so next/font never preloads it: the browser fetches it
// the first time cursive text is drawn.
export const cursivaFont = Playwrite_MX({ display: "swap" });
