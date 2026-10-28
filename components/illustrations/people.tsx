// People, storybook figures and parts of the body.
import { C, Eye, Face, starPath, type Drawing } from "./parts";

/** Head and shoulders, the base of every person. */
function bust({ shirt, skin = C.skin, back, front, face, collar }: { shirt: string; skin?: string; back?: Drawing; front?: Drawing; face?: Drawing; collar?: Drawing }) {
  return (
    <>
      {back}
      <path d="M18 92 Q18 66 50 64 Q82 66 82 92 Z" fill={shirt} />
      {collar}
      <circle cx="50" cy="42" r="22" fill={skin} />
      {face ?? <Face y={44} gap={14} r={2.8} />}
      {front}
    </>
  );
}

const shortHair = (fill: string) => <path d="M28 42 Q26 18 50 18 Q74 18 72 42 Q66 30 54 32 Q40 28 28 42 Z" fill={fill} />;
const longHairBack = (fill: string) => <path d="M26 44 Q22 16 50 16 Q78 16 74 44 L78 74 Q66 78 62 64 L38 64 Q34 78 22 74 Z" fill={fill} />;
const fringe = (fill: string) => <path d="M28 40 Q28 20 50 20 Q72 20 72 40 Q62 28 50 32 Q38 28 28 40 Z" fill={fill} />;
const crown = <path d="M34 22 L32 6 L42 14 L50 4 L58 14 L68 6 L66 22 Z" fill={C.yellow} />;
const wings = (fill: string) => (
  <>
    <path d="M30 70 Q6 56 8 34 Q24 40 34 60 Z" fill={fill} />
    <path d="M70 70 Q94 56 92 34 Q76 40 66 60 Z" fill={fill} />
  </>
);
const pointedHat = (fill: string, band: string) => (
  <>
    <path d="M22 30 L78 30 L58 2 Q52 0 50 10 Z" fill={fill} />
    <ellipse cx="50" cy="30" rx="34" ry="6" fill={fill} />
    <path d="M30 26 L70 26" stroke={band} strokeWidth="4" />
  </>
);

// Pointing up, as for "one": the index finger rises from the thumb side of
// the fist, the other fingers are curled.
const pointingFinger = (
  <>
    <rect x="30" y="44" width="46" height="44" rx="14" fill={C.skin} />
    <path d="M50 46 Q50 40 56 40 Q62 40 62 46 M62 46 Q62 40 68 40 Q74 40 74 48" fill={C.skin} strokeWidth="2.5" />
    <rect x="28" y="8" width="18" height="50" rx="9" fill={C.skin} />
    <path d="M32 14 Q37 11 42 14" fill="none" strokeWidth="2" />
    <path d="M46 60 L74 60 M46 72 L74 72" strokeWidth="2" />
    <path d="M30 68 Q44 62 58 66 Q64 70 58 74 Q44 76 32 78" fill={C.skin} strokeWidth="2.5" />
  </>
);

export const people: Record<string, Drawing> = {
  boy: bust({ shirt: C.blue, front: shortHair(C.woodDark) }),
  man: bust({
    shirt: C.green,
    front: (
      <>
        {shortHair(C.ink)}
        <path d="M40 54 Q50 50 60 54 Q56 58 50 56 Q44 58 40 54 Z" fill={C.ink} />
      </>
    ),
    face: <Face y={42} gap={14} r={2.8} mouth="none" />,
  }),
  woman: bust({
    shirt: C.purple,
    back: longHairBack(C.woodDark),
    front: (
      <>
        {fringe(C.woodDark)}
        <circle cx="28" cy="52" r="3" fill={C.yellow} />
        <circle cx="72" cy="52" r="3" fill={C.yellow} />
      </>
    ),
  }),
  grandma: bust({
    shirt: C.lilac,
    back: <circle cx="50" cy="18" r="10" fill={C.gray} />,
    front: (
      <>
        {fringe(C.gray)}
        <circle cx="43" cy="44" r="6" fill="none" strokeWidth="2.5" />
        <circle cx="57" cy="44" r="6" fill="none" strokeWidth="2.5" />
        <path d="M49 44 L51 44" strokeWidth="2.5" />
      </>
    ),
  }),
  grandpa: bust({
    shirt: C.woodLight,
    collar: <path d="M42 66 L50 76 L58 66" fill="none" strokeWidth="2.5" />,
    front: (
      <>
        <path d="M28 40 Q26 30 32 26 Q32 36 34 40 Z M72 40 Q74 30 68 26 Q68 36 66 40 Z" fill={C.gray} />
        <path d="M40 54 Q50 48 60 54 Q56 58 50 56 Q44 58 40 54 Z" fill={C.gray} />
        <circle cx="43" cy="42" r="6" fill="none" strokeWidth="2.5" />
        <circle cx="57" cy="42" r="6" fill="none" strokeWidth="2.5" />
        <path d="M49 42 L51 42" strokeWidth="2.5" />
      </>
    ),
    face: <Face y={42} gap={14} r={2.4} mouth="none" />,
  }),
  girl: bust({
    shirt: C.pink,
    back: longHairBack(C.orange),
    front: (
      <>
        {fringe(C.orange)}
        <path d="M68 24 Q80 14 84 24 Q80 30 72 28 Z" fill={C.red} />
      </>
    ),
  }),
  child: bust({ shirt: C.yellow, front: <path d="M28 40 Q26 18 50 18 Q74 18 72 40 L70 32 L64 36 L58 30 L50 34 L42 30 L36 36 L30 32 Z" fill={C.yellow} /> }),
  baby: (
    <>
      <path d="M26 92 Q26 70 50 70 Q74 70 74 92 Z" fill={C.sky} />
      <path d="M40 72 Q50 82 60 72" fill={C.white} />
      <circle cx="50" cy="44" r="26" fill={C.skin} />
      <path d="M48 18 Q42 12 50 10 Q58 12 52 20" fill="none" stroke={C.woodDark} strokeWidth="3" />
      <Face y={46} gap={16} r={3} mouth="none" />
      <circle cx="50" cy="58" r="5" fill={C.pink} />
      <circle cx="50" cy="58" r="2" fill={C.white} stroke="none" />
    </>
  ),
  king: bust({
    shirt: C.red,
    collar: <path d="M24 74 Q50 84 76 74 L80 88 Q50 96 20 88 Z" fill={C.white} />,
    front: (
      <>
        {shortHair(C.woodDark)}
        {crown}
        <path d="M36 52 Q50 70 64 52 Q60 62 50 64 Q40 62 36 52 Z" fill={C.woodDark} />
      </>
    ),
    face: <Face y={42} gap={14} r={2.8} mouth="none" />,
  }),
  queen: bust({
    shirt: C.blue,
    back: longHairBack(C.woodDark),
    collar: <path d="M30 70 Q50 80 70 70" fill="none" stroke={C.yellow} strokeWidth="4" />,
    front: (
      <>
        {fringe(C.woodDark)}
        {crown}
        <circle cx="50" cy="12" r="2.5" fill={C.red} />
      </>
    ),
  }),
  princess: bust({
    shirt: C.purple,
    back: longHairBack(C.yellow),
    front: (
      <>
        {fringe(C.yellow)}
        <path d="M38 22 L40 10 L46 18 L50 8 L54 18 L60 10 L62 22 Z" fill={C.yellow} />
        <circle cx="50" cy="14" r="2.5" fill={C.red} />
      </>
    ),
  }),
  firefighter: bust({
    shirt: C.yellow,
    collar: <path d="M22 80 L78 80" stroke={C.white} strokeWidth="5" />,
    front: (
      <>
        <path d="M24 38 Q24 12 50 12 Q76 12 76 38 Z" fill={C.red} />
        <path d="M16 38 L84 38 Q84 44 76 44 L24 44 Q16 44 16 38 Z" fill={C.red} />
        <path d={starPath(50, 26, 7)} fill={C.yellow} strokeWidth="2" />
      </>
    ),
    face: <Face y={52} gap={14} r={2.6} />,
  }),
  astronaut: (
    <>
      <path d="M16 92 Q16 64 50 62 Q84 64 84 92 Z" fill={C.white} />
      <rect x="40" y="72" width="20" height="12" rx="3" fill={C.sky} />
      <circle cx="44" cy="78" r="2" fill={C.red} stroke="none" />
      <circle cx="50" cy="40" r="28" fill={C.white} />
      <circle cx="50" cy="42" r="19" fill={C.navy} />
      <circle cx="50" cy="44" r="13" fill={C.skin} stroke="none" />
      <Face y={44} gap={10} r={2.2} cheeks={false} />
      <path d="M38 30 Q42 26 48 26" fill="none" stroke={C.white} strokeWidth="3" />
    </>
  ),
  clown: bust({
    shirt: C.green,
    collar: <path d="M24 72 Q32 62 40 72 Q48 62 56 72 Q64 62 72 72 Q64 80 50 78 Q34 80 24 72 Z" fill={C.white} />,
    back: (
      <>
        <circle cx="26" cy="38" r="10" fill={C.orange} />
        <circle cx="74" cy="38" r="10" fill={C.orange} />
      </>
    ),
    front: (
      <>
        <path d="M36 24 L50 0 L64 24 Z" fill={C.blue} />
        <circle cx="50" cy="2" r="4" fill={C.yellow} />
        <circle cx="50" cy="50" r="5" fill={C.red} />
      </>
    ),
    face: (
      <>
        <Eye x={43} y={40} r={2.8} />
        <Eye x={57} y={40} r={2.8} />
        <path d="M38 56 Q50 68 62 56 Q50 62 38 56 Z" fill={C.red} />
      </>
    ),
  }),
  witch: bust({
    shirt: C.ink,
    back: longHairBack(C.orange),
    front: pointedHat(C.purple, C.green),
  }),
  wizard: bust({
    shirt: C.blue,
    front: (
      <>
        {pointedHat(C.navy, C.yellow)}
        <path d={starPath(54, 14, 4)} fill={C.yellow} strokeWidth="1.5" />
        <path d="M32 50 Q34 82 50 86 Q66 82 68 50 Q60 60 50 58 Q40 60 32 50 Z" fill={C.white} />
      </>
    ),
    face: <Face y={42} gap={14} r={2.8} mouth="none" />,
  }),
  angel: bust({
    shirt: C.white,
    back: (
      <>
        {wings(C.white)}
        <ellipse cx="50" cy="12" rx="16" ry="4" fill="none" stroke={C.yellow} strokeWidth="4" />
      </>
    ),
    front: fringe(C.yellow),
  }),
  fairy: bust({
    shirt: C.green,
    back: (
      <>
        {wings(C.sky)}
        {longHairBack(C.woodDark)}
      </>
    ),
    front: (
      <>
        {fringe(C.woodDark)}
        <path d={starPath(70, 22, 6)} fill={C.yellow} strokeWidth="2" />
      </>
    ),
  }),
  elf: bust({
    shirt: C.green,
    back: (
      <>
        <path d="M30 40 L12 30 L30 50 Z" fill={C.skin} />
        <path d="M70 40 L88 30 L70 50 Z" fill={C.skin} />
      </>
    ),
    front: (
      <>
        <path d="M26 30 Q50 14 74 30 L90 14 Q60 0 38 14 Z" fill={C.green} />
        <path d="M26 30 Q50 22 74 30" fill="none" />
        <circle cx="90" cy="14" r="4" fill={C.red} />
      </>
    ),
  }),
  mermaid: bust({
    shirt: C.green,
    back: (
      <>
        <path d="M68 78 L92 66 L90 92 Z" fill={C.green} />
        {longHairBack(C.red)}
      </>
    ),
    collar: (
      <>
        <path d="M26 82 Q30 78 34 82 M40 86 Q44 82 48 86 M54 86 Q58 82 62 86 M68 82 Q72 78 76 82" fill="none" stroke={C.leaf} strokeWidth="2.5" />
        <circle cx="42" cy="72" r="5" fill={C.purple} />
        <circle cx="58" cy="72" r="5" fill={C.purple} />
      </>
    ),
    front: fringe(C.red),
  }),
  ghost: (
    <>
      <path d="M22 88 L22 44 Q22 12 50 12 Q78 12 78 44 L78 88 L70 80 L62 88 L54 80 L46 88 L38 80 L30 88 Z" fill={C.white} />
      <Face y={42} gap={16} mouth="open" />
    </>
  ),
  skull: (
    <>
      <path d="M22 46 Q22 14 50 14 Q78 14 78 46 Q78 60 68 64 L68 78 L32 78 L32 64 Q22 60 22 46 Z" fill={C.white} />
      <circle cx="38" cy="46" r="8" fill={C.ink} />
      <circle cx="62" cy="46" r="8" fill={C.ink} />
      <path d="M50 54 L46 62 L54 62 Z" fill={C.ink} />
      <path d="M42 70 L42 78 M50 70 L50 78 M58 70 L58 78" strokeWidth="2.5" />
    </>
  ),
  dragon: (
    <>
      <path d="M58 70 Q84 76 90 56 Q94 72 80 84 Q66 90 56 84 Z" fill={C.green} />
      <path d="M36 40 L46 26 L50 40 L58 26 L62 42 L70 32 L70 48" fill={C.yellow} />
      <path d="M30 60 Q30 36 50 36 Q70 36 72 60 Q72 86 50 86 Q30 86 30 60 Z" fill={C.green} />
      <path d="M40 62 Q50 56 60 62 Q60 82 50 84 Q40 82 40 62 Z" fill={C.leaf} />
      <path d="M14 30 Q14 12 34 12 Q50 12 52 26 Q52 40 36 42 L20 42 Q12 40 14 30 Z" fill={C.green} />
      <path d="M38 12 L40 2 L46 12 M46 14 L52 6 L52 18" fill={C.yellow} strokeWidth="2.5" />
      <Eye x={36} y={24} />
      <circle cx="18" cy="28" r="1.6" fill={C.ink} stroke="none" />
      <path d="M20 36 Q28 38 34 34" fill="none" strokeWidth="2.5" />
      <path d="M12 34 Q4 36 2 30 Q6 30 4 24 Q10 28 12 34 Z" fill={C.orange} strokeWidth="2" />
    </>
  ),
  // ----- faces -----
  secret: (
    <>
      <circle cx="50" cy="48" r="34" fill={C.yellow} />
      <Face y={40} gap={20} mouth="none" />
      <path d="M42 60 L58 60" strokeWidth="3" />
      <rect x="45" y="50" width="10" height="34" rx="5" fill={C.skin} />
    </>
  ),
  sleep: (
    <>
      <circle cx="46" cy="54" r="32" fill={C.yellow} />
      <path d="M30 50 Q36 56 42 50 M50 50 Q56 56 62 50" fill="none" strokeWidth="2.5" />
      <ellipse cx="46" cy="68" rx="5" ry="4" fill={C.white} />
      <path d="M72 14 L84 14 L72 26 L84 26 M86 32 L94 32 L86 40 L94 40" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  // ----- body -----
  hand: (
    <>
      <path d="M30 88 L28 56 Q22 46 14 40 Q10 34 18 32 Q26 34 32 44 L32 18 Q32 12 38 12 Q44 12 44 18 L44 40 L44 12 Q44 6 50 6 Q56 6 56 12 L56 40 L56 16 Q56 10 62 10 Q68 10 68 16 L68 42 L68 26 Q68 20 74 20 Q80 20 80 26 L80 58 Q80 76 66 88 Z" fill={C.skin} />
      <path d="M44 40 L44 30 M56 40 L56 30 M68 42 L68 34" strokeWidth="2" />
    </>
  ),
  arm: (
    <>
      <path d="M10 88 L10 62 Q14 50 30 48 L46 48 Q40 34 44 22 Q50 12 62 16 Q72 22 66 34 L64 36 Q82 40 88 60 Q90 80 70 88 Z" fill={C.skin} />
      <path d="M50 58 Q62 52 72 60" fill="none" strokeWidth="2.5" />
      <path d="M52 22 Q58 26 60 34" fill="none" strokeWidth="2.5" />
    </>
  ),
  finger: pointingFinger,
  "index-finger": pointingFinger,
  foot: (
    <>
      <path d="M30 88 Q16 84 18 64 Q20 46 28 34 Q34 24 46 26 Q58 30 56 48 Q54 64 52 76 Q50 90 30 88 Z" fill={C.skin} />
      <circle cx="30" cy="20" r="6" fill={C.skin} />
      <circle cx="42" cy="14" r="6" fill={C.skin} />
      <circle cx="54" cy="14" r="5" fill={C.skin} />
      <circle cx="64" cy="20" r="4.5" fill={C.skin} />
      <circle cx="70" cy="28" r="4" fill={C.skin} />
    </>
  ),
  ear: (
    <>
      <path d="M36 70 Q22 60 24 36 Q28 12 52 12 Q76 14 76 38 Q76 56 62 64 Q58 68 58 76 Q56 90 42 86 Q36 82 36 70 Z" fill={C.skin} />
      <path d="M40 38 Q42 24 54 24 Q66 26 64 40 Q62 50 52 54 Q48 58 50 66" fill="none" strokeWidth="2.5" />
    </>
  ),
  eye: (
    <>
      <path d="M8 52 Q50 8 92 52 Q50 92 8 52 Z" fill={C.white} />
      <circle cx="50" cy="52" r="18" fill={C.blue} />
      <circle cx="50" cy="52" r="9" fill={C.ink} stroke="none" />
      <circle cx="55" cy="46" r="4" fill={C.white} stroke="none" />
      <path d="M22 30 L16 22 M36 22 L34 12 M50 20 L50 10 M64 22 L66 12 M78 30 L84 22" strokeWidth="3" />
    </>
  ),
  eyes: (
    <>
      {[28, 72].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="52" rx="20" ry="26" fill={C.white} />
          <circle cx={x + 4} cy="56" r="11" fill={C.green} />
          <circle cx={x + 4} cy="56" r="5.5" fill={C.ink} stroke="none" />
          <circle cx={x + 7} cy="52" r="2.6" fill={C.white} stroke="none" />
        </g>
      ))}
    </>
  ),
  nose: (
    <>
      <path d="M50 12 Q44 44 32 58 Q24 70 36 76 Q42 80 50 74 Q58 80 64 76 Q76 70 68 58 Q56 44 50 12 Z" fill={C.skin} />
      <path d="M38 66 Q42 70 46 68 M54 68 Q58 70 62 66" fill="none" strokeWidth="2.5" />
    </>
  ),
  mouth: (
    <>
      <path d="M10 46 Q30 30 50 40 Q70 30 90 46 Q72 82 50 82 Q28 82 10 46 Z" fill={C.red} />
      <path d="M14 48 Q50 56 86 48 Q80 60 50 62 Q20 60 14 48 Z" fill={C.white} />
      <path d="M38 52 L38 61 M50 54 L50 62 M62 52 L62 61" strokeWidth="2" />
    </>
  ),
  tooth: (
    <>
      <path d="M22 30 Q22 12 38 14 Q46 16 50 20 Q54 16 62 14 Q78 12 78 30 Q78 48 70 60 Q66 88 58 88 Q52 88 52 74 Q50 66 48 74 Q48 88 42 88 Q34 88 30 60 Q22 48 22 30 Z" fill={C.white} />
      <Face y={38} gap={14} r={2.6} />
    </>
  ),
  hair: (
    <>
      <path d="M18 70 Q10 30 34 16 Q50 6 66 16 Q90 30 82 70 Q86 84 74 88 Q74 70 70 56 L30 56 Q26 70 26 88 Q14 84 18 70 Z" fill={C.woodDark} />
      <circle cx="50" cy="48" r="22" fill={C.skin} />
      <Face y={52} gap={14} r={2.6} />
      <path d="M26 44 Q30 18 50 18 Q72 18 74 44 Q64 30 50 34 Q40 26 26 44 Z" fill={C.woodDark} />
    </>
  ),
  "thumbs-up": (
    <>
      <rect x="18" y="44" width="16" height="42" rx="4" fill={C.blue} />
      <path d="M34 48 L46 46 Q54 34 52 18 Q52 10 60 12 Q68 16 66 30 L64 42 L80 42 Q90 44 86 54 Q90 58 84 64 Q88 70 82 74 Q84 82 76 84 L34 84 Z" fill={C.skin} />
      <path d="M68 54 L84 54 M68 64 L82 64 M68 74 L80 74" strokeWidth="2" />
    </>
  ),
  dream: (
    <>
      <path d="M26 64 Q8 62 12 46 Q14 34 28 36 Q30 18 50 18 Q66 18 70 30 Q88 28 90 44 Q92 60 74 62 Q70 72 56 70 Q44 76 34 68 Z" fill={C.white} />
      <path d={starPath(42, 44, 7)} fill={C.yellow} strokeWidth="2" />
      <path d="M60 36 Q50 40 52 50 Q56 58 66 54 Q58 52 58 44 Q58 38 60 36 Z" fill={C.yellow} strokeWidth="2" />
      <circle cx="26" cy="78" r="6" fill={C.white} />
      <circle cx="16" cy="88" r="3.5" fill={C.white} strokeWidth="2.5" />
    </>
  ),
  heart: (
    <>
      <path d="M50 86 Q12 60 12 36 Q12 16 32 16 Q44 16 50 28 Q56 16 68 16 Q88 16 88 36 Q88 60 50 86 Z" fill={C.red} />
      <path d="M26 30 Q24 38 28 44" fill="none" stroke={C.white} strokeWidth="4" opacity="0.8" />
    </>
  ),
};
