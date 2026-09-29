import { Playwrite_FR_Trad } from "next/font/google";

// French school cursive (écriture cursive, as taught on Seyès lines), from
// Google Fonts' Playwrite project. Licensed under the SIL Open Font License
// 1.1, which allows commercial use. Imported only by the French pages that
// show cursive, so no other page loads it.
//
// It has no subsets, so next/font never preloads it: the browser fetches it
// the first time cursive text is drawn.
export const cursiveFont = Playwrite_FR_Trad({ display: "swap" });
