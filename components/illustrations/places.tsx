// Buildings, a few outdoor things, and shapes, numbers and signs.
import { C, type Drawing } from "./parts";

const house = (wall: string, roof: string) => (
  <>
    <rect x="62" y="20" width="10" height="20" fill={C.woodDark} />
    <rect x="20" y="46" width="60" height="42" fill={wall} />
    <path d="M10 50 L50 16 L90 50 Z" fill={roof} />
    <rect x="42" y="62" width="16" height="26" rx="2" fill={C.wood} />
    <rect x="26" y="56" width="12" height="12" rx="2" fill={C.sky} />
    <rect x="62" y="56" width="12" height="12" rx="2" fill={C.sky} />
  </>
);

const windows = (x0: number, y0: number, cols: number, rows: number, dx = 12, dy = 12) =>
  Array.from({ length: cols * rows }, (_, i) => (
    <rect key={i} x={x0 + (i % cols) * dx} y={y0 + Math.floor(i / cols) * dy} width="7" height="7" rx="1.5" fill={C.sky} strokeWidth="2" />
  ));

/** A rounded tile with a large digit or sign, for numbers and symbols. */
function tile(text: string, fill: string) {
  return (
    <>
      <rect x="16" y="14" width="68" height="72" rx="14" fill={fill} />
      <text x="50" y="52" textAnchor="middle" dominantBaseline="central" fontSize="56" fontWeight="800" fontFamily="var(--font-baloo), system-ui, sans-serif" fill={C.white} stroke="none">
        {text}
      </text>
    </>
  );
}

export const places: Record<string, Drawing> = {
  // ----- buildings -----
  house: house(C.yellow, C.red),
  hut: (
    <>
      <path d="M16 88 L16 56 Q50 48 84 56 L84 88 Z" fill={C.woodLight} />
      <path d="M6 60 Q50 4 94 60 Q50 50 6 60 Z" fill={C.yellow} />
      <path d="M20 44 L28 50 M34 32 L40 40 M50 24 L50 34 M66 32 L60 40 M80 44 L72 50" stroke={C.wood} strokeWidth="2.5" />
      <path d="M40 88 L40 70 Q50 60 60 70 L60 88 Z" fill={C.woodDark} />
    </>
  ),
  igloo: (
    <>
      <path d="M8 86 Q8 30 50 30 Q92 30 92 86 Z" fill={C.white} />
      <path d="M14 70 L86 70 M10 56 Q50 50 90 56 M22 42 Q50 36 78 42 M30 30 L28 42 M50 30 L50 40 M70 30 L72 42 M20 56 L18 70 M40 52 L38 70 M66 52 L68 70 M84 56 L86 70" fill="none" stroke={C.sky} strokeWidth="2.5" />
      <path d="M8 86 Q8 30 50 30 Q92 30 92 86 Z" fill="none" />
      <path d="M36 86 L36 70 Q50 56 64 70 L64 86 Z" fill={C.navy} />
    </>
  ),
  zoo: (
    <>
      <path d="M8 88 L8 30 M92 88 L92 30" strokeWidth="6" stroke={C.woodDark} />
      <path d="M4 30 Q50 6 96 30 L96 40 Q50 18 4 40 Z" fill={C.green} />
      {[20, 32, 44, 56, 68, 80].map((x) => (
        <path key={x} d={`M${x} 46 L${x} 88`} strokeWidth="3" stroke={C.grayDark} />
      ))}
      <circle cx="50" cy="66" r="14" fill={C.orange} />
      <circle cx="50" cy="67" r="9" fill={C.yellow} />
      <circle cx="46" cy="65" r="1.6" fill={C.ink} stroke="none" />
      <circle cx="54" cy="65" r="1.6" fill={C.ink} stroke="none" />
      <path d="M48 70 L52 70 L50 72 Z" fill={C.ink} strokeWidth="1.5" />
    </>
  ),
  village: (
    <>
      <rect x="10" y="54" width="30" height="32" fill={C.yellow} />
      <path d="M6 56 L25 38 L44 56 Z" fill={C.red} />
      <rect x="20" y="70" width="10" height="16" fill={C.wood} />
      <rect x="58" y="44" width="34" height="42" fill={C.white} />
      <path d="M54 46 L75 26 L96 46 Z" fill={C.blue} />
      <rect x="70" y="68" width="10" height="18" fill={C.wood} />
      <rect x="62" y="52" width="8" height="8" fill={C.sky} strokeWidth="2" />
      <rect x="80" y="52" width="8" height="8" fill={C.sky} strokeWidth="2" />
      <circle cx="48" cy="70" r="8" fill={C.green} />
      <path d="M48 78 L48 86" strokeWidth="3" />
    </>
  ),
  castle: (
    <>
      <rect x="24" y="40" width="52" height="48" fill={C.stone} />
      <path d="M24 40 L24 32 L32 32 L32 40 L40 40 L40 32 L48 32 L48 40 L52 40 L52 32 L60 32 L60 40 L68 40 L68 32 L76 32 L76 40" fill={C.stone} />
      <rect x="8" y="30" width="20" height="58" fill={C.gray} />
      <rect x="72" y="30" width="20" height="58" fill={C.gray} />
      <path d="M6 30 L18 12 L30 30 Z M70 30 L82 12 L94 30 Z" fill={C.red} />
      <path d="M18 12 L18 4 L26 7 L18 10" fill={C.yellow} strokeWidth="2" />
      <path d="M40 88 L40 66 Q50 54 60 66 L60 88 Z" fill={C.woodDark} />
      <rect x="14" y="44" width="8" height="12" rx="4" fill={C.ink} />
      <rect x="78" y="44" width="8" height="12" rx="4" fill={C.ink} />
    </>
  ),
  church: (
    <>
      <rect x="38" y="30" width="24" height="58" fill={C.white} />
      <path d="M34 32 L50 12 L66 32 Z" fill={C.blue} />
      <path d="M50 12 L50 2 M45 6 L55 6" strokeWidth="3" />
      <circle cx="50" cy="42" r="5" fill={C.yellow} />
      <rect x="14" y="54" width="72" height="34" fill={C.white} />
      <path d="M10 56 L38 40 M90 56 L62 40" strokeWidth="3" />
      <path d="M44 88 L44 70 Q50 62 56 70 L56 88 Z" fill={C.wood} />
      <rect x="22" y="64" width="8" height="12" rx="4" fill={C.sky} />
      <rect x="70" y="64" width="8" height="12" rx="4" fill={C.sky} />
    </>
  ),
  school: (
    <>
      <path d="M50 22 L50 6 L64 10 L50 14" fill={C.red} strokeWidth="2.5" />
      <rect x="10" y="44" width="80" height="44" fill={C.red} />
      <path d="M6 46 L50 22 L94 46 Z" fill={C.woodDark} />
      <circle cx="50" cy="36" r="6" fill={C.white} />
      <path d="M50 32 L50 36 L53 38" fill="none" strokeWidth="2" />
      <rect x="42" y="64" width="16" height="24" fill={C.wood} />
      {windows(18, 54, 2, 2, 12, 14)}
      {windows(66, 54, 2, 2, 12, 14)}
    </>
  ),
  hospital: (
    <>
      <rect x="14" y="28" width="72" height="60" fill={C.white} />
      <rect x="36" y="10" width="28" height="22" rx="4" fill={C.blue} />
      <path d="M44 15 L44 27 M56 15 L56 27 M44 21 L56 21" stroke={C.white} strokeWidth="3.5" />
      {windows(22, 40, 5, 2, 12, 14)}
      <rect x="40" y="68" width="20" height="20" fill={C.sky} />
      <path d="M50 68 L50 88" strokeWidth="2" />
    </>
  ),
  hotel: (
    <>
      <rect x="22" y="16" width="56" height="72" fill={C.purple} />
      <rect x="30" y="8" width="40" height="12" rx="3" fill={C.yellow} />
      <path d="M38 14 L62 14" stroke={C.ink} strokeWidth="2.5" strokeDasharray="3 4" />
      {windows(30, 28, 4, 4, 11, 11)}
      <rect x="40" y="72" width="20" height="16" fill={C.red} />
    </>
  ),
  factory: (
    <>
      <rect x="64" y="12" width="12" height="40" fill={C.gray} />
      <path d="M70 8 Q78 2 86 6 Q90 0 96 4" fill="none" stroke={C.gray} strokeWidth="3" />
      <path d="M8 88 L8 46 L30 34 L30 46 L52 34 L52 46 L74 34 L92 34 L92 88 Z" fill={C.orange} />
      {windows(16, 56, 6, 1, 12)}
      <rect x="40" y="72" width="20" height="16" fill={C.woodDark} />
    </>
  ),
  city: (
    <>
      <rect x="6" y="40" width="24" height="48" fill={C.blue} />
      <rect x="30" y="16" width="22" height="72" fill={C.purple} />
      <rect x="52" y="30" width="20" height="58" fill={C.green} />
      <rect x="72" y="48" width="22" height="40" fill={C.orange} />
      {windows(11, 48, 2, 4, 9, 10)}
      {windows(35, 24, 2, 6, 9, 10)}
      {windows(56, 38, 2, 5, 8, 10)}
      {windows(77, 56, 2, 3, 9, 10)}
    </>
  ),
  bridge: (
    <>
      <path d="M4 84 Q16 78 28 84 Q40 90 52 84 Q64 78 76 84 Q88 90 96 84 L96 92 L4 92 Z" fill={C.blue} stroke="none" />
      <path d="M4 46 L96 46 L96 56 L4 56 Z" fill={C.red} />
      <path d="M14 56 L14 86 M86 56 L86 86" strokeWidth="6" />
      <path d="M14 82 Q50 50 86 82" fill="none" strokeWidth="5" />
      <path d="M4 30 L96 30 M14 30 L14 46 M32 30 L32 46 M50 30 L50 46 M68 30 L68 46 M86 30 L86 46" strokeWidth="3" />
    </>
  ),
  tent: (
    <>
      <path d="M50 14 L46 6 M50 14 L58 8" strokeWidth="3" />
      <path d="M6 86 L50 14 L94 86 Z" fill={C.green} />
      <path d="M50 14 L36 86 L64 86 Z" fill={C.leaf} />
      <path d="M50 40 L50 86" strokeWidth="2.5" />
    </>
  ),
  // ----- outdoors -----
  umbrella: (
    <>
      <path d="M50 46 L50 80 Q50 88 42 88 Q36 88 36 82" fill="none" strokeWidth="5" />
      <path d="M8 48 Q10 12 50 12 Q90 12 92 48 Q84 40 78 48 Q72 40 64 48 Q58 40 50 48 Q42 40 36 48 Q28 40 22 48 Q16 40 8 48 Z" fill={C.red} />
      <path d="M50 12 Q36 24 36 48 M50 12 Q64 24 64 48" fill="none" strokeWidth="2.5" />
      <path d="M50 12 L50 6" strokeWidth="4" />
    </>
  ),
  anchor: (
    <>
      <circle cx="50" cy="18" r="8" fill="none" strokeWidth="9" />
      <circle cx="50" cy="18" r="8" fill="none" stroke={C.navy} strokeWidth="4" />
      <path d="M50 26 L50 84 M34 38 L66 38 M16 58 Q20 84 50 84 Q80 84 84 58" fill="none" strokeWidth="9" />
      <path d="M50 26 L50 84 M34 38 L66 38 M16 58 Q20 84 50 84 Q80 84 84 58" fill="none" stroke={C.navy} strokeWidth="4" />
      <path d="M10 62 L16 52 L24 62 Z M90 62 L84 52 L76 62 Z" fill={C.navy} />
    </>
  ),
  brick: (
    <>
      <rect x="10" y="22" width="38" height="18" rx="2" fill={C.red} />
      <rect x="52" y="22" width="38" height="18" rx="2" fill={C.red} />
      <rect x="10" y="44" width="18" height="18" rx="2" fill={C.red} />
      <rect x="32" y="44" width="38" height="18" rx="2" fill={C.red} />
      <rect x="74" y="44" width="16" height="18" rx="2" fill={C.red} />
      <rect x="10" y="66" width="38" height="18" rx="2" fill={C.red} />
      <rect x="52" y="66" width="38" height="18" rx="2" fill={C.red} />
    </>
  ),
  globe: (
    <>
      <path d="M50 76 L50 86 M32 88 L68 88" strokeWidth="5" />
      <path d="M18 40 Q20 74 54 76" fill="none" strokeWidth="4" />
      <circle cx="50" cy="42" r="30" fill={C.blue} />
      <path d="M34 24 Q44 26 42 34 Q34 40 38 48 Q30 50 26 42 Q24 30 34 24 Z M58 18 Q68 22 64 32 Q56 34 60 44 Q70 44 74 52 Q72 64 62 66 Q56 58 52 60 Q48 52 54 48 Q50 38 56 32 Q52 22 58 18 Z" fill={C.green} />
    </>
  ),
  // ----- shapes, numbers and signs -----
  square: <rect x="18" y="18" width="64" height="64" rx="4" fill={C.red} />,
  "black-circle": <circle cx="50" cy="50" r="34" fill={C.ink} />,
  "blue-circle": <circle cx="50" cy="50" r="34" fill={C.blue} />,
  "number-0": tile("0", C.blue),
  "number-2": tile("2", C.green),
  "number-3": tile("3", C.purple),
  "number-4": tile("4", C.red),
  "number-5": tile("5", C.orange),
  "number-8": tile("8", C.blue),
  "question-mark": tile("?", C.purple),
  "up-arrow": <path d="M50 10 L84 46 L62 46 L62 88 L38 88 L38 46 L16 46 Z" fill={C.green} />,
  zigzag: (
    <>
      <path d="M8 66 L24 34 L40 66 L56 34 L72 66 L88 34" fill="none" strokeWidth="14" />
      <path d="M8 66 L24 34 L40 66 L56 34 L72 66 L88 34" fill="none" stroke={C.purple} strokeWidth="8" />
    </>
  ),
  "mexico-flag": (
    <>
      <path d="M12 12 L12 92" strokeWidth="4" />
      <rect x="14" y="18" width="24" height="50" fill={C.green} />
      <rect x="38" y="18" width="24" height="50" fill={C.white} />
      <rect x="62" y="18" width="24" height="50" fill={C.red} />
      <circle cx="50" cy="43" r="7" fill={C.wood} />
      <path d="M43 48 Q50 54 57 48" fill="none" stroke={C.green} strokeWidth="2.5" />
      <rect x="14" y="18" width="72" height="50" fill="none" />
    </>
  ),
  "pirate-flag": (
    <>
      <path d="M14 10 L14 92" strokeWidth="4" stroke={C.woodDark} />
      <path d="M16 16 L86 16 Q80 40 86 64 L16 64 Z" fill={C.ink} />
      <circle cx="50" cy="34" r="10" fill={C.white} stroke="none" />
      <rect x="44" y="40" width="12" height="7" rx="2" fill={C.white} stroke="none" />
      <circle cx="46" cy="34" r="2.6" fill={C.ink} stroke="none" />
      <circle cx="54" cy="34" r="2.6" fill={C.ink} stroke="none" />
      <path d="M34 48 L66 58 M66 48 L34 58" stroke={C.white} strokeWidth="4" />
    </>
  ),
};
