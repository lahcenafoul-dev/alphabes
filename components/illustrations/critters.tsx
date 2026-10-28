// Birds, sea animals, reptiles, amphibians and small creatures.
import { C, Eye, Face, Tube, type Drawing } from "./parts";

/** A round bird in profile, facing left. */
function roundBird(body: string, wing: string, beak = C.orange) {
  return (
    <>
      <path d="M70 58 L90 48 L86 66 Z" fill={wing} />
      <ellipse cx="50" cy="56" rx="26" ry="23" fill={body} />
      <path d="M26 46 L14 50 L26 54 Z" fill={beak} />
      <path d="M44 58 Q56 50 68 58 Q62 72 48 70 Z" fill={wing} />
      <Eye x={36} y={46} />
      <path d="M44 79 L42 88 M56 79 L58 88" strokeWidth="3" stroke={C.orange} />
    </>
  );
}

const legs = (x1: number, x2: number, y: number, to: number) => (
  <path d={`M${x1} ${y} L${x1} ${to} M${x1 - 4} ${to} L${x1 + 4} ${to} M${x2} ${y} L${x2} ${to} M${x2 - 4} ${to} L${x2 + 4} ${to}`} stroke={C.orange} strokeWidth="3" />
);

export const critters: Record<string, Drawing> = {
  // ----- birds -----
  bird: roundBird(C.blue, C.navy),
  quail: (
    <>
      <path d="M40 30 Q40 16 52 12 Q46 22 46 30" fill="none" strokeWidth="3" />
      <circle cx="52" cy="12" r="4" fill={C.ink} />
      <path d="M70 58 L90 52 L84 68 Z" fill={C.woodDark} />
      <ellipse cx="52" cy="60" rx="28" ry="22" fill={C.wood} />
      <circle cx="38" cy="40" r="14" fill={C.wood} />
      <path d="M26 38 L16 42 L26 46 Z" fill={C.ink} />
      <path d="M44 62 Q58 52 72 62 Q64 76 50 72 Z" fill={C.woodDark} />
      {[[54, 52], [62, 56], [48, 70]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={C.white} stroke="none" />
      ))}
      <Eye x={36} y={38} />
      {legs(44, 58, 82, 89)}
    </>
  ),
  chick: (
    <>
      <circle cx="50" cy="56" r="27" fill={C.yellow} />
      <path d="M44 30 Q46 20 52 24 Q54 18 58 26" fill="none" strokeWidth="2.5" />
      <path d="M44 56 L56 56 L50 64 Z" fill={C.orange} strokeWidth="2.5" />
      <Face y={47} gap={18} mouth="none" />
      <path d="M22 60 Q14 52 20 46 M78 60 Q86 52 80 46" fill="none" />
      {legs(42, 58, 82, 89)}
    </>
  ),
  hen: (
    <>
      <path d="M70 40 Q88 30 86 56 Q80 50 72 54 Z" fill={C.white} />
      <path d="M22 54 Q22 34 40 30 Q50 30 56 44 Q76 44 78 62 Q76 82 50 82 Q24 80 22 54 Z" fill={C.white} />
      <path d="M32 30 Q32 20 38 24 Q40 16 46 22 Q50 18 50 30 Z" fill={C.red} />
      <path d="M22 42 L12 46 L22 50 Z" fill={C.yellow} />
      <path d="M24 50 Q20 58 26 60 Q30 56 28 50 Z" fill={C.red} />
      <path d="M44 62 Q56 54 68 62 Q62 74 48 72 Z" fill={C.cream} />
      <Eye x={33} y={40} />
      {legs(44, 58, 82, 89)}
    </>
  ),
  rooster: (
    <>
      <path d="M64 42 Q76 14 92 26 Q78 30 82 40 Q94 38 92 56 Q80 50 72 56 Z" fill={C.green} />
      <path d="M66 46 Q80 26 88 40 Q78 42 74 54 Z" fill={C.navy} />
      <path d="M22 54 Q22 34 40 30 Q50 30 56 44 Q76 44 78 62 Q76 82 50 82 Q24 80 22 54 Z" fill={C.orange} />
      <path d="M28 32 Q26 16 34 22 Q36 10 44 18 Q50 12 50 30 Z" fill={C.red} />
      <path d="M22 42 L12 46 L22 50 Z" fill={C.yellow} />
      <path d="M24 50 Q20 60 27 62 Q31 56 28 50 Z" fill={C.red} />
      <path d="M44 62 Q56 54 68 62 Q62 74 48 72 Z" fill={C.red} />
      <Eye x={33} y={40} />
      {legs(44, 58, 82, 89)}
    </>
  ),
  duck: (
    <>
      <path d="M30 62 Q30 50 46 52 L66 54 Q78 54 86 46 Q90 62 80 72 Q70 80 52 80 Q30 78 30 62 Z" fill={C.white} />
      <path d="M48 62 Q62 56 76 62 Q66 72 54 70 Z" fill={C.cream} />
      <circle cx="38" cy="38" r="15" fill={C.white} />
      <path d="M24 38 Q12 38 12 44 Q18 48 26 45 Z" fill={C.orange} />
      <Eye x={36} y={34} />

    </>
  ),
  eagle: (
    <>
      <path d="M40 46 Q30 70 40 88 L76 88 Q82 64 66 46 Z" fill={C.woodDark} />
      <circle cx="52" cy="36" r="20" fill={C.white} />
      <path d="M34 34 Q22 34 22 44 Q26 50 34 44 Z" fill={C.yellow} />
      <path d="M38 28 L54 30" strokeWidth="3" />
      <Eye x={46} y={34} />
      <path d="M52 62 Q60 70 58 84 M62 58 Q70 68 68 82" fill="none" strokeWidth="2.5" />
    </>
  ),
  owl: (
    <>
      <path d="M28 30 L24 14 L40 24 Z" fill={C.woodDark} />
      <path d="M72 30 L76 14 L60 24 Z" fill={C.woodDark} />
      <ellipse cx="50" cy="54" rx="28" ry="32" fill={C.woodDark} />
      <ellipse cx="50" cy="64" rx="17" ry="18" fill={C.woodLight} />
      <circle cx="39" cy="40" r="11" fill={C.white} />
      <circle cx="61" cy="40" r="11" fill={C.white} />
      <Eye x={39} y={40} r={5} />
      <Eye x={61} y={40} r={5} />
      <path d="M46 48 L54 48 L50 56 Z" fill={C.orange} strokeWidth="2" />
      <path d="M42 64 Q46 68 50 64 Q54 68 58 64 M42 72 Q46 76 50 72 Q54 76 58 72" fill="none" strokeWidth="2" />
    </>
  ),
  parrot: (
    <>
      <path d="M48 70 L42 92 L54 88 L60 92 L58 70 Z" fill={C.blue} />
      <path d="M36 36 Q36 20 52 20 Q68 22 66 44 L64 74 Q50 82 40 70 Q32 56 36 36 Z" fill={C.red} />
      <path d="M50 44 Q66 46 64 74 Q56 70 50 58 Z" fill={C.yellow} />
      <path d="M54 56 Q64 58 64 74 Q58 70 54 64 Z" fill={C.blue} />
      <path d="M36 32 Q24 30 24 42 Q28 44 30 40 Q34 44 38 40 Z" fill={C.cream} />
      <circle cx="46" cy="30" r="6" fill={C.white} />
      <Eye x={46} y={30} r={2.8} />
    </>
  ),
  penguin: (
    <>
      <ellipse cx="50" cy="54" rx="26" ry="34" fill={C.ink} />
      <path d="M50 32 Q68 34 68 58 Q66 82 50 84 Q34 82 32 58 Q32 34 50 32 Z" fill={C.white} />
      <path d="M24 50 Q14 64 20 72 Q26 64 28 56 Z" fill={C.ink} />
      <path d="M76 50 Q86 64 80 72 Q74 64 72 56 Z" fill={C.ink} />
      <Face y={44} gap={14} mouth="none" />
      <path d="M45 50 L55 50 L50 56 Z" fill={C.orange} strokeWidth="2" />
      <ellipse cx="41" cy="88" rx="7" ry="3" fill={C.orange} />
      <ellipse cx="59" cy="88" rx="7" ry="3" fill={C.orange} />
    </>
  ),
  flamingo: (
    <>
      <path d="M56 62 L56 90 M56 74 L66 70" stroke={C.ink} strokeWidth="3" />
      <Tube d="M52 56 Q38 50 40 30 Q42 14 30 16" fill={C.pink} width={6} />
      <path d="M50 54 Q50 40 66 40 Q86 42 84 56 Q80 68 60 66 Q50 64 50 54 Z" fill={C.pink} />
      <circle cx="28" cy="18" r="8" fill={C.pink} />
      <path d="M22 20 Q16 28 22 32 Q24 26 28 24 Z" fill={C.ink} />
      <Eye x={29} y={16} r={2.2} />
      <path d="M64 48 Q74 50 78 58" fill="none" strokeWidth="2" />
    </>
  ),
  ostrich: (
    <>
      <Tube d="M48 66 L46 89 M62 66 L64 89" fill={C.skin} width={3} />
      <path d="M30 56 Q30 36 56 38 Q82 40 84 58 Q80 72 56 72 Q30 72 30 56 Z" fill={C.ink} />
      <path d="M70 44 Q82 34 88 44 Q84 52 78 52 Z" fill={C.white} />
      <Tube d="M38 48 Q30 34 34 20" fill={C.skin} width={5} />
      <ellipse cx="34" cy="16" rx="9" ry="7" fill={C.skin} />
      <path d="M26 16 L17 18 L26 21 Z" fill={C.orange} />
      <Eye x={33} y={14} r={2.4} />
    </>
  ),
  swan: (
    <>
      <Tube d="M38 62 Q28 42 34 28 Q40 14 30 13 Q22 14 22 22" fill={C.white} width={7} />
      <path d="M30 60 Q30 80 56 80 Q84 80 88 58 Q78 64 64 56 Q48 50 30 60 Z" fill={C.white} />
      <path d="M20 22 L12 26 L22 28 Z" fill={C.orange} />
      <Eye x={27} y={17} r={2.2} />
      <path d="M50 62 Q62 58 74 64" fill="none" strokeWidth="2.5" />
      <path d="M28 84 Q50 90 80 84" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  dove: (
    <>
      <path d="M44 50 Q50 18 76 14 Q66 30 64 48 Z" fill={C.white} />
      <path d="M20 54 Q22 40 36 42 Q52 44 64 52 L86 50 L80 62 Q70 70 50 70 Q28 70 20 54 Z" fill={C.white} />
      <path d="M20 50 L10 54 L20 57 Z" fill={C.orange} />
      <Eye x={28} y={49} r={2.6} />
      <path d="M48 70 Q40 82 46 86 Q52 80 52 72 Z" fill={C.green} />
      <path d="M52 76 L62 74 M50 80 L58 82" stroke={C.green} strokeWidth="3" />
    </>
  ),
  // ----- sea -----
  fish: (
    <>
      <path d="M70 52 L92 36 L90 70 Z" fill={C.orange} />
      <ellipse cx="46" cy="52" rx="32" ry="22" fill={C.orange} />
      <path d="M44 30 Q54 18 64 34 Z" fill={C.orange} />
      <path d="M54 36 Q62 52 54 68 M64 40 Q70 52 64 64" fill="none" stroke={C.yellow} strokeWidth="3" />
      <Eye x={28} y={47} r={4} />
      <path d="M15 58 Q19 60 22 57" fill="none" strokeWidth="2.5" />
    </>
  ),
  aquarium: (
    <>
      <rect x="12" y="24" width="76" height="62" rx="10" fill={C.sky} />
      <path d="M12 38 L88 38" strokeWidth="2.5" />
      <path d="M22 86 Q24 70 20 62 M30 86 Q28 74 32 66" fill="none" stroke={C.green} strokeWidth="4" />
      <path d="M64 60 L76 52 L76 68 Z" fill={C.orange} />
      <ellipse cx="54" cy="60" rx="12" ry="8" fill={C.orange} />
      <circle cx="49" cy="58" r="1.8" fill={C.ink} stroke="none" />
      <circle cx="42" cy="48" r="2.5" fill={C.white} strokeWidth="1.5" />
      <circle cx="38" cy="42" r="1.8" fill={C.white} strokeWidth="1.5" />
      <rect x="12" y="24" width="76" height="62" rx="10" fill="none" />
    </>
  ),
  whale: (
    <>
      <path d="M46 26 Q42 14 34 14 M46 26 Q50 14 58 14 M46 26 L46 14" fill="none" stroke={C.blue} strokeWidth="3" />
      <path d="M78 54 Q88 40 94 44 Q88 52 90 62 Q84 58 78 62 Z" fill={C.blue} />
      <path d="M10 56 Q10 30 44 30 Q74 30 80 58 Q76 80 44 80 Q10 80 10 56 Z" fill={C.blue} />
      <path d="M14 64 Q40 76 74 66 Q66 80 44 80 Q20 80 14 64 Z" fill={C.sky} />
      <Eye x={28} y={52} />
      <path d="M18 60 Q24 64 30 60" fill="none" strokeWidth="2.5" />
    </>
  ),
  dolphin: (
    <>
      <path d="M14 70 Q24 38 58 34 Q74 32 84 44 L92 42 L86 52 Q82 66 64 70 Q40 74 26 64 Z" fill={C.stone} />
      <path d="M52 36 Q56 20 66 22 Q62 30 64 36 Z" fill={C.stone} />
      <path d="M16 70 L6 74 L12 64 Z" fill={C.stone} />
      <path d="M40 64 Q46 76 54 76 Q50 68 52 62 Z" fill={C.stone} />
      <path d="M22 62 Q40 70 66 66" fill="none" stroke={C.white} strokeWidth="3" />
      <Eye x={74} y={44} r={2.8} />
      <path d="M84 52 Q80 56 74 54" fill="none" strokeWidth="2" />
      <path d="M8 86 Q20 80 32 86 Q44 92 56 86 Q68 80 80 86 Q88 90 94 86" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  octopus: (
    <>
      {[22, 36, 50, 64, 78].map((x) => (
        <Tube key={x} d={`M${x} 60 Q${x - 6} 74 ${x + 2} 82 Q${x + 6} 86 ${x + 8} 82`} fill={C.purple} width={7} />
      ))}
      <path d="M22 62 Q16 34 50 18 Q84 34 78 62 Q50 72 22 62 Z" fill={C.purple} />
      <Face y={44} gap={18} />
    </>
  ),
  crab: (
    <>
      <Tube d="M26 64 L12 72 M28 70 L16 82 M74 64 L88 72 M72 70 L84 82 M30 50 L20 32 M70 50 L80 32" fill={C.red} width={3} />
      <path d="M14 18 Q26 12 28 26 L20 26 Q22 20 16 24 Q10 30 22 34 Q10 34 14 18 Z" fill={C.red} />
      <path d="M86 18 Q74 12 72 26 L80 26 Q78 20 84 24 Q90 30 78 34 Q90 34 86 18 Z" fill={C.red} />
      <ellipse cx="50" cy="62" rx="28" ry="18" fill={C.red} />
      <path d="M42 46 L42 36 M58 46 L58 36" strokeWidth="2.5" />
      <circle cx="42" cy="34" r="5" fill={C.white} />
      <circle cx="58" cy="34" r="5" fill={C.white} />
      <circle cx="42" cy="34" r="2.4" fill={C.ink} stroke="none" />
      <circle cx="58" cy="34" r="2.4" fill={C.ink} stroke="none" />
      <path d="M44 66 Q50 70 56 66" fill="none" strokeWidth="2.5" />
    </>
  ),
  turtle: (
    <>
      <ellipse cx="30" cy="78" rx="7" ry="5" fill={C.leaf} />
      <ellipse cx="70" cy="78" rx="7" ry="5" fill={C.leaf} />
      <path d="M84 66 L94 70 L84 72 Z" fill={C.leaf} />
      <circle cx="16" cy="58" r="11" fill={C.leaf} />
      <path d="M22 72 Q22 34 52 34 Q82 34 84 72 Z" fill={C.green} />
      <path d="M42 40 L52 52 L62 40 M52 52 L52 72 M34 56 L52 52 L72 56" fill="none" strokeWidth="2.5" />
      <path d="M18 72 L88 72" strokeWidth="3" />
      <Eye x={13} y={56} r={2.6} />
      <path d="M8 62 Q12 64 16 62" fill="none" strokeWidth="2" />
    </>
  ),
  // ----- reptiles and amphibians -----
  frog: (
    <>
      <ellipse cx="50" cy="62" rx="32" ry="22" fill={C.green} />
      <circle cx="34" cy="38" r="11" fill={C.green} />
      <circle cx="66" cy="38" r="11" fill={C.green} />
      <circle cx="34" cy="37" r="6" fill={C.white} />
      <circle cx="66" cy="37" r="6" fill={C.white} />
      <Eye x={34} y={37} r={3} />
      <Eye x={66} y={37} r={3} />
      <path d="M34 62 Q50 74 66 62" fill="none" strokeWidth="2.5" />
      <ellipse cx="28" cy="58" rx="4" ry="2.6" fill={C.pink} stroke="none" />
      <ellipse cx="72" cy="58" rx="4" ry="2.6" fill={C.pink} stroke="none" />
      <path d="M24 82 Q30 76 38 82 M62 82 Q70 76 76 82" fill={C.leaf} />
    </>
  ),
  snake: (
    <>
      <Tube d="M20 84 Q8 84 10 74 Q14 64 30 66 Q50 70 62 64 Q76 56 64 46 Q54 40 40 42 Q24 42 28 30" fill={C.green} width={11} />
      <path d="M20 84 Q8 84 10 74 Q14 64 30 66 Q50 70 62 64 Q76 56 64 46 Q54 40 40 42 Q24 42 28 30" fill="none" stroke={C.yellow} strokeWidth="3" strokeDasharray="4 8" />
      <ellipse cx="34" cy="24" rx="14" ry="10" fill={C.green} />
      <Eye x={30} y={21} r={2.6} />
      <Eye x={40} y={21} r={2.6} />
      <path d="M20 26 L12 28 M12 28 L8 25 M12 28 L8 31" stroke={C.red} strokeWidth="2" />
    </>
  ),
  crocodile: (
    <>
      <path d="M86 58 Q96 52 94 66 Q90 70 82 70 Z" fill={C.green} />
      <path d="M8 56 Q8 46 22 46 L44 46 Q50 38 58 44 Q74 44 86 56 Q86 72 60 72 L20 72 Q8 70 8 60 Z" fill={C.green} />
      <path d="M10 60 L46 60" strokeWidth="2.5" />
      <path d="M14 60 L17 55 L20 60 L23 55 L26 60 L29 55 L32 60 L35 55 L38 60" fill={C.white} strokeWidth="1.5" />
      <path d="M58 46 L62 40 L66 47 L70 41 L74 49 L78 44 L80 52" fill="none" strokeWidth="2.5" />
      <circle cx="50" cy="44" r="5" fill={C.green} />
      <Eye x={51} y={43} r={2.6} />
      <path d="M30 72 L28 82 L36 82 L38 72 M64 72 L62 82 L70 82 L72 72" fill={C.green} />
      <circle cx="12" cy="52" r="1.4" fill={C.ink} stroke="none" />
    </>
  ),
  lizard: (
    <>
      <path d="M58 60 Q80 64 86 78 Q88 88 78 86 Q80 76 62 70 Z" fill={C.green} />
      <Tube d="M24 44 L18 34 M34 58 L28 70 M54 52 L64 40 M58 62 L66 74" fill={C.green} width={4} />
      <path d="M14 40 Q20 30 34 40 L58 52 Q66 60 58 66 Q46 70 34 58 L18 48 Q10 46 14 40 Z" fill={C.green} />
      <path d="M36 50 L40 46 M44 54 L48 50 M52 58 L56 54" stroke={C.yellow} strokeWidth="2.5" />
      <Eye x={20} y={40} r={2.4} />
    </>
  ),
  dinosaur: (
    <>
      <path d="M70 66 Q90 64 94 82 Q84 74 70 76 Z" fill={C.green} />
      <path d="M40 60 L40 88 L50 88 L50 64 M62 64 L62 88 L72 88 L72 60" fill={C.green} />
      <Tube d="M38 56 Q30 36 26 20" fill={C.green} width={9} />
      <path d="M30 64 Q30 46 54 46 Q78 46 78 66 Q70 78 54 78 Q36 78 30 64 Z" fill={C.green} />
      <ellipse cx="26" cy="16" rx="12" ry="8" fill={C.green} />
      <Eye x={24} y={14} r={2.4} />
      <path d="M16 19 Q20 21 24 19" fill="none" strokeWidth="2" />
      <path d="M48 46 L52 38 L56 46 L60 39 L64 47 L68 41 L70 50" fill={C.yellow} strokeWidth="2" />
    </>
  ),
  // ----- small creatures -----
  bee: (
    <>
      <ellipse cx="38" cy="30" rx="12" ry="16" fill={C.sky} opacity="0.9" transform="rotate(-20 38 30)" />
      <ellipse cx="60" cy="30" rx="12" ry="16" fill={C.sky} opacity="0.9" transform="rotate(20 60 30)" />
      <path d="M80 56 L90 58 L80 62 Z" fill={C.ink} />
      <ellipse cx="52" cy="58" rx="30" ry="21" fill={C.yellow} />
      <path d="M48 38 Q42 58 48 78 M62 40 Q56 58 62 76" fill="none" stroke={C.ink} strokeWidth="6" />
      <Face x={32} y={54} gap={10} r={2.6} />
      <path d="M26 40 Q20 30 16 28 M34 38 Q32 28 30 24" fill="none" strokeWidth="2.5" />
    </>
  ),
  butterfly: (
    <>
      <path d="M48 46 Q30 14 14 22 Q4 30 14 44 Q24 54 48 50 Z" fill={C.purple} />
      <path d="M52 46 Q70 14 86 22 Q96 30 86 44 Q76 54 52 50 Z" fill={C.purple} />
      <path d="M48 52 Q26 54 20 68 Q20 82 34 78 Q46 72 48 56 Z" fill={C.pink} />
      <path d="M52 52 Q74 54 80 68 Q80 82 66 78 Q54 72 52 56 Z" fill={C.pink} />
      <circle cx="26" cy="34" r="5" fill={C.yellow} />
      <circle cx="74" cy="34" r="5" fill={C.yellow} />
      <ellipse cx="50" cy="54" rx="5" ry="22" fill={C.ink} />
      <path d="M48 34 Q42 22 38 20 M52 34 Q58 22 62 20" fill="none" strokeWidth="2.5" />
    </>
  ),
  ant: (
    <>
      <path d="M30 60 L22 80 M44 60 L44 82 M58 60 L66 80 M38 58 L30 40 M54 58 L60 40" stroke={C.ink} strokeWidth="3" />
      <ellipse cx="74" cy="58" rx="16" ry="13" fill={C.woodDark} />
      <ellipse cx="48" cy="58" rx="9" ry="8" fill={C.woodDark} />
      <circle cx="26" cy="52" r="12" fill={C.woodDark} />
      <path d="M20 42 Q14 28 8 26 M28 41 Q28 28 24 22" fill="none" strokeWidth="2.5" />
      <circle cx="22" cy="50" r="3" fill={C.white} stroke="none" />
      <circle cx="21.5" cy="50.5" r="1.6" fill={C.ink} stroke="none" />
    </>
  ),
  spider: (
    <>
      <path d="M50 8 L50 30" strokeWidth="2" />
      {[-1, 1].map((s) =>
        [40, 50, 60, 70].map((y, i) => (
          <path key={`${s}-${y}`} d={`M${50 + s * 12} ${y - 8} Q${50 + s * 28} ${y - 22 + i * 4} ${50 + s * 40} ${y + 4}`} fill="none" strokeWidth="3.5" />
        )),
      )}
      <ellipse cx="50" cy="58" rx="20" ry="22" fill={C.purple} />
      <circle cx="50" cy="38" r="13" fill={C.purple} />
      <Face y={36} gap={12} r={2.6} />
    </>
  ),
  caterpillar: (
    <>
      {[78, 64, 50, 36].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 66 : 62} r="11" fill={i % 2 ? C.leaf : C.green} />
      ))}
      <circle cx="22" cy="54" r="14" fill={C.green} />
      <path d="M16 42 L12 30 M26 41 L28 29" strokeWidth="2.5" />
      <circle cx="12" cy="29" r="2.5" fill={C.red} />
      <circle cx="28" cy="28" r="2.5" fill={C.red} />
      <Face x={22} y={52} gap={10} r={2.4} />
      <path d="M36 76 L36 82 M50 76 L50 82 M64 76 L64 82 M78 74 L78 82" strokeWidth="3" />
    </>
  ),
  worm: (
    <>
      <Tube d="M86 80 Q76 64 64 76 Q52 88 42 72 Q34 58 26 62" fill={C.pink} width={10} />
      <path d="M58 82 L62 74 M46 80 L50 72" stroke="#FF8FA3" strokeWidth="2.5" />
      <circle cx="22" cy="58" r="11" fill={C.pink} />
      <Face x={22} y={56} gap={9} r={2.2} cheeks={false} />
      <path d="M6 88 L94 88" stroke={C.woodDark} strokeWidth="3" />
    </>
  ),
  ladybug: (
    <>
      <path d="M30 58 L16 54 M30 68 L16 72 M70 58 L84 54 M70 68 L84 72" strokeWidth="3" />
      <circle cx="50" cy="34" r="13" fill={C.ink} />
      <path d="M44 24 Q40 14 34 12 M56 24 Q60 14 66 12" fill="none" strokeWidth="2.5" />
      <circle cx="50" cy="60" r="28" fill={C.red} />
      <path d="M50 32 L50 88" strokeWidth="3" />
      {[[38, 48], [62, 48], [34, 66], [66, 66], [42, 80], [58, 80]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={C.ink} stroke="none" />
      ))}
      <circle cx="45" cy="32" r="2.4" fill={C.white} stroke="none" />
      <circle cx="55" cy="32" r="2.4" fill={C.white} stroke="none" />
    </>
  ),
  snail: (
    <>
      <path d="M12 82 Q14 70 26 70 L32 48 Q34 40 30 34 L36 34 Q42 42 40 52 L40 70 L88 72 Q90 84 76 84 L20 84 Q12 84 12 82 Z" fill={C.skin} />
      <path d="M31 34 L26 20 M36 34 L40 20" strokeWidth="2.5" />
      <circle cx="26" cy="19" r="2.6" fill={C.ink} stroke="none" />
      <circle cx="40" cy="19" r="2.6" fill={C.ink} stroke="none" />
      <circle cx="62" cy="54" r="24" fill={C.orange} />
      <path d="M62 54 m0 0 Q70 46 74 56 Q72 70 58 68 Q46 62 50 48 Q58 34 74 40" fill="none" strokeWidth="2.5" />
      <path d="M30 76 Q34 78 38 76" fill="none" strokeWidth="2" />
    </>
  ),
  cricket: (
    <>
      <path d="M58 56 L74 30 L86 82 M44 64 L36 82 M54 66 L56 82" fill="none" strokeWidth="3" />
      <path d="M22 54 Q24 42 40 44 L82 52 Q84 62 70 66 L36 68 Q22 66 22 54 Z" fill={C.green} />
      <path d="M40 46 Q60 40 84 54 Q60 58 40 56 Z" fill={C.leaf} />
      <circle cx="24" cy="50" r="10" fill={C.green} />
      <path d="M18 42 Q12 20 30 10 M22 41 Q22 22 42 14" fill="none" strokeWidth="2" />
      <Eye x={20} y={48} r={2.6} />
    </>
  ),
  mosquito: (
    <>
      <ellipse cx="40" cy="36" rx="9" ry="18" fill={C.sky} opacity="0.9" transform="rotate(-30 40 36)" />
      <ellipse cx="60" cy="36" rx="9" ry="18" fill={C.sky} opacity="0.9" transform="rotate(30 60 36)" />
      <path d="M42 60 L28 82 M50 62 L50 86 M58 60 L72 82 M42 56 L22 60 M58 56 L78 60" fill="none" strokeWidth="2" />
      <ellipse cx="62" cy="56" rx="16" ry="7" fill={C.grayDark} transform="rotate(15 62 56)" />
      <circle cx="40" cy="52" r="8" fill={C.grayDark} />
      <path d="M34 56 L14 66" strokeWidth="2.5" />
      <circle cx="38" cy="50" r="2.4" fill={C.white} stroke="none" />
    </>
  ),
  fly: (
    <>
      <ellipse cx="36" cy="38" rx="12" ry="18" fill={C.sky} opacity="0.9" transform="rotate(-35 36 38)" />
      <ellipse cx="64" cy="38" rx="12" ry="18" fill={C.sky} opacity="0.9" transform="rotate(35 64 38)" />
      <path d="M36 66 L26 80 M50 68 L50 84 M64 66 L74 80" fill="none" strokeWidth="2.5" />
      <ellipse cx="50" cy="60" rx="18" ry="14" fill={C.grayDark} />
      <circle cx="50" cy="44" r="10" fill={C.grayDark} />
      <circle cx="44" cy="42" r="5" fill={C.red} />
      <circle cx="56" cy="42" r="5" fill={C.red} />
      <circle cx="45" cy="41" r="1.6" fill={C.white} stroke="none" />
      <circle cx="57" cy="41" r="1.6" fill={C.white} stroke="none" />
    </>
  ),
};
