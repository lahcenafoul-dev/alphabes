// Things that go.
import { C, type Drawing } from "./parts";

const wheel = (x: number, y: number, r = 8) => (
  <>
    <circle cx={x} cy={y} r={r} fill={C.ink} />
    <circle cx={x} cy={y} r={r * 0.4} fill={C.gray} stroke="none" />
  </>
);

/** A small car, facing left. */
function car(body: string, extra?: Drawing) {
  return (
    <>
      <path d="M26 50 L34 32 Q36 28 42 28 L62 28 Q68 28 70 32 L78 50 Z" fill={C.sky} />
      <path d="M50 28 L50 50" />
      <path d="M10 66 L10 56 Q10 50 18 50 L84 50 Q92 50 92 58 L92 66 Q92 72 86 72 L16 72 Q10 72 10 66 Z" fill={body} />
      <path d="M10 58 L16 58 M86 58 L92 58" stroke={C.yellow} strokeWidth="4" />
      {wheel(28, 72)}
      {wheel(72, 72)}
      {extra}
    </>
  );
}

/** A boxy van or bus body, facing left, with `n` windows. */
function longVehicle(body: string, n: number, extra?: Drawing) {
  const w = 64 / n;
  return (
    <>
      <path d="M8 70 L8 34 Q8 24 18 24 L84 24 Q92 24 92 34 L92 70 Q92 76 86 76 L14 76 Q8 76 8 70 Z" fill={body} />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={14 + i * w + 2} y="32" width={w - 6} height="16" rx="3" fill={C.sky} />
      ))}
      <path d="M8 56 L92 56" strokeWidth="2.5" />
      {wheel(26, 76)}
      {wheel(74, 76)}
      {extra}
    </>
  );
}

export const vehicles: Record<string, Drawing> = {
  car: car(C.red),
  taxi: car(C.yellow, <rect x="40" y="18" width="20" height="10" rx="3" fill={C.ink} />),
  van: longVehicle(C.blue, 3),
  bus: longVehicle(C.yellow, 4, <path d="M8 64 L92 64" stroke={C.red} strokeWidth="3" />),
  ambulance: longVehicle(
    C.white,
    2,
    <>
      <path d="M44 60 L56 60 M50 54 L50 66" stroke={C.red} strokeWidth="5" />
      <rect x="40" y="16" width="20" height="8" rx="3" fill={C.red} />
    </>,
  ),
  wagon: longVehicle(C.green, 3, <path d="M2 86 L98 86" strokeWidth="3" />),
  "fast-train": (
    <>
      <path d="M90 34 L90 74 L20 74 Q8 74 8 62 Q10 40 40 34 Z" fill={C.white} />
      <path d="M14 56 Q16 44 38 40 L52 40 L52 52 Z" fill={C.sky} />
      <path d="M8 62 L90 62" stroke={C.red} strokeWidth="5" />
      <rect x="60" y="42" width="10" height="10" rx="2" fill={C.sky} />
      <rect x="76" y="42" width="10" height="10" rx="2" fill={C.sky} />
      <path d="M4 84 L96 84" strokeWidth="3" />
      {wheel(30, 78, 5)}
      {wheel(70, 78, 5)}
    </>
  ),
  train: (
    <>
      <rect x="20" y="16" width="12" height="20" rx="2" fill={C.ink} />
      <path d="M14 36 L14 30 Q14 26 18 26 L36 26 Q40 26 40 30 L40 36 Z" fill={C.red} stroke="none" />
      <rect x="12" y="36" width="50" height="34" rx="5" fill={C.red} />
      <rect x="54" y="22" width="34" height="48" rx="5" fill={C.blue} />
      <rect x="62" y="30" width="18" height="16" rx="3" fill={C.sky} />
      <path d="M50 18 L92 18" strokeWidth="5" />
      <path d="M12 60 L4 74 L12 74 Z" fill={C.yellow} />
      {wheel(26, 74)}
      {wheel(48, 74)}
      {wheel(74, 72, 11)}
    </>
  ),
  tractor: (
    <>
      <rect x="54" y="24" width="28" height="30" rx="4" fill={C.sky} />
      <path d="M50 22 L86 22 L86 58 L50 58 Z" fill="none" />
      <rect x="50" y="20" width="38" height="6" rx="2" fill={C.green} />
      <path d="M12 72 L12 54 Q12 48 18 48 L54 48 L54 72 Z" fill={C.green} />
      <path d="M50 52 L90 52 L90 72 L50 72 Z" fill={C.green} />
      <rect x="22" y="36" width="5" height="12" fill={C.ink} />
      {wheel(26, 74, 11)}
      {wheel(72, 70, 17)}
    </>
  ),
  bicycle: (
    <>
      <circle cx="24" cy="66" r="18" fill="none" strokeWidth="5" />
      <circle cx="76" cy="66" r="18" fill="none" strokeWidth="5" />
      <path d="M24 66 L42 38 L68 38 L76 66 M42 38 L52 66 L68 38 M52 66 L24 66" fill="none" stroke={C.red} strokeWidth="5" />
      <path d="M40 30 L50 30 M66 38 L62 24 L72 22" fill="none" strokeWidth="4" />
      <circle cx="52" cy="66" r="4" fill={C.ink} />
    </>
  ),
  motorbike: (
    <>
      <circle cx="22" cy="68" r="14" fill={C.ink} />
      <circle cx="78" cy="68" r="14" fill={C.ink} />
      <circle cx="22" cy="68" r="5" fill={C.gray} stroke="none" />
      <circle cx="78" cy="68" r="5" fill={C.gray} stroke="none" />
      <path d="M22 68 L36 46 L64 46 L78 68" fill="none" strokeWidth="4" />
      <path d="M34 46 Q36 34 52 36 L66 36 Q72 38 70 46 Z" fill={C.red} />
      <path d="M30 40 L44 40" strokeWidth="6" />
      <path d="M66 36 L72 24 L80 24" fill="none" strokeWidth="4" />
      <rect x="44" y="50" width="16" height="12" rx="3" fill={C.grayDark} />
    </>
  ),
  airplane: (
    <>
      <path d="M44 48 L24 20 L34 18 L62 46 Z" fill={C.blue} />
      <path d="M44 56 L24 84 L34 86 L62 58 Z" fill={C.blue} />
      <path d="M10 52 Q10 44 22 44 L80 44 Q94 46 94 52 Q94 58 80 60 L22 60 Q10 60 10 52 Z" fill={C.white} />
      <path d="M12 44 L6 30 L16 30 L26 44 Z" fill={C.red} />
      {[40, 52, 64].map((x) => (
        <circle key={x} cx={x} cy="51" r="3" fill={C.sky} strokeWidth="2" />
      ))}
      <path d="M82 46 Q90 48 92 52 L82 52 Z" fill={C.sky} strokeWidth="2" />
    </>
  ),
  helicopter: (
    <>
      <path d="M14 22 L86 22 M50 22 L50 32" strokeWidth="4" />
      <path d="M8 46 L4 38 M8 46 L12 54" strokeWidth="3" />
      <path d="M50 44 L8 46" strokeWidth="6" />
      <path d="M30 50 Q30 32 54 32 Q80 32 82 52 Q82 68 58 68 Q30 68 30 50 Z" fill={C.red} />
      <path d="M58 38 Q76 38 78 52 L58 52 Z" fill={C.sky} />
      <path d="M40 76 L78 76 M48 68 L46 76 M68 68 L70 76" fill="none" strokeWidth="3.5" />
    </>
  ),
  rocket: (
    <>
      <path d="M40 72 Q42 86 50 92 Q58 86 60 72 Z" fill={C.orange} />
      <path d="M34 56 L20 74 L36 72 Z" fill={C.red} />
      <path d="M66 56 L80 74 L64 72 Z" fill={C.red} />
      <path d="M50 8 Q70 24 68 54 L64 74 L36 74 L32 54 Q30 24 50 8 Z" fill={C.white} />
      <path d="M38 24 Q50 14 62 24 Z" fill={C.red} />
      <circle cx="50" cy="42" r="9" fill={C.sky} />
    </>
  ),
  sailboat: (
    <>
      <path d="M50 12 L50 66" strokeWidth="3.5" />
      <path d="M54 14 L54 60 L84 60 Z" fill={C.white} />
      <path d="M46 22 L46 60 L22 60 Z" fill={C.red} />
      <path d="M12 66 L88 66 L76 82 L24 82 Z" fill={C.wood} />
      <path d="M6 88 Q18 82 30 88 Q42 94 54 88 Q66 82 78 88 Q88 92 94 88" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  ship: (
    <>
      <rect x="36" y="22" width="12" height="18" fill={C.red} />
      <rect x="56" y="22" width="12" height="18" fill={C.red} />
      <rect x="26" y="38" width="52" height="18" rx="3" fill={C.white} />
      {[34, 46, 58, 70].map((x) => (
        <circle key={x} cx={x} cy="47" r="3" fill={C.sky} strokeWidth="2" />
      ))}
      <path d="M8 56 L92 56 L80 80 L20 80 Z" fill={C.navy} />
      <path d="M12 64 L88 64" stroke={C.white} strokeWidth="3" />
      <path d="M4 88 Q16 82 28 88 Q40 94 52 88 Q64 82 76 88 Q88 94 96 88" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  yacht: (
    <>
      <path d="M30 34 L58 34 L66 48 L24 48 Z" fill={C.white} />
      <path d="M36 38 L54 38 L58 46 L32 46 Z" fill={C.sky} strokeWidth="2" />
      <path d="M8 48 L92 48 Q86 70 70 72 L22 72 Q12 66 8 48 Z" fill={C.white} />
      <path d="M10 56 L88 56" stroke={C.blue} strokeWidth="4" />
      <path d="M4 82 Q16 76 28 82 Q40 88 52 82 Q64 76 76 82 Q88 88 96 82" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  canoe: (
    <>
      <path d="M60 14 L36 82" strokeWidth="4" />
      <path d="M34 80 Q30 88 36 90 Q40 86 38 82 Z" fill={C.wood} />
      <path d="M6 56 Q50 60 94 56 Q86 76 50 76 Q14 76 6 56 Z" fill={C.red} />
      <path d="M10 60 Q50 64 90 60" fill="none" stroke={C.yellow} strokeWidth="3" />
      <path d="M2 86 Q16 80 30 86 Q44 92 58 86 Q72 80 86 86 Q92 88 98 86" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  wheel: (
    <>
      <circle cx="50" cy="52" r="36" fill={C.ink} />
      <circle cx="50" cy="52" r="22" fill={C.gray} />
      <path d="M50 30 L50 74 M28 52 L72 52 M34 36 L66 68 M66 36 L34 68" stroke={C.grayDark} strokeWidth="3" />
      <circle cx="50" cy="52" r="7" fill={C.white} />
    </>
  ),
};
