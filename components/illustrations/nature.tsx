// Sky, weather, water, landscapes and plants.
import { C, Face, Leaf, Rays, starPath, Tube, wavyCircle, type Drawing } from "./parts";

const cloud = (fill: string) => (
  <path d="M24 66 Q10 66 12 52 Q14 40 28 42 Q30 24 48 24 Q64 24 68 38 Q84 34 88 50 Q90 66 74 66 Z" fill={fill} />
);

const tree = (
  <>
    <rect x="43" y="56" width="14" height="32" rx="3" fill={C.woodDark} />
    <path d={wavyCircle(50, 40, 26, 9, 3)} fill={C.green} />
    <circle cx="40" cy="36" r="3" fill={C.red} stroke="none" />
    <circle cx="60" cy="44" r="3" fill={C.red} stroke="none" />
  </>
);

const flower = (petal: string, heart = C.yellow) => (
  <>
    <Tube d="M50 52 L50 88" fill={C.green} width={4} />
    <Leaf x={50} y={76} angle={-35} size={18} />
    <Leaf x={50} y={70} angle={-145} size={16} />
    {Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i;
      return <circle key={i} cx={(50 + 15 * Math.cos(a)).toFixed(1)} cy={(34 + 15 * Math.sin(a)).toFixed(1)} r="10" fill={petal} />;
    })}
    <circle cx="50" cy="34" r="9" fill={heart} />
  </>
);

const planetEarth = (
  <>
    <circle cx="50" cy="52" r="34" fill={C.blue} />
    <path d="M30 28 Q40 30 38 40 Q30 46 34 56 Q26 60 20 52 Q16 36 30 28 Z" fill={C.green} />
    <path d="M58 22 Q70 26 66 36 Q56 40 60 50 Q72 50 76 60 Q74 74 62 78 Q56 70 50 72 Q44 62 52 56 Q48 44 54 36 Q50 26 58 22 Z" fill={C.green} />
    <path d="M30 70 Q36 66 40 72 Q36 80 30 76 Z" fill={C.green} />
  </>
);

export const nature: Record<string, Drawing> = {
  // ----- sky and weather -----
  sun: (
    <>
      <Rays cx={50} cy={50} from={30} to={42} count={12} />
      <circle cx="50" cy="50" r="24" fill={C.yellow} />
      <Face y={47} gap={16} />
    </>
  ),
  moon: (
    <>
      <path d="M58 12 Q26 18 24 50 Q26 84 60 88 Q40 74 40 50 Q40 26 58 12 Z" fill={C.yellow} />
      <path d={starPath(74, 34, 8)} fill={C.yellow} strokeWidth="2" />
      <path d={starPath(70, 66, 5)} fill={C.yellow} strokeWidth="2" />
    </>
  ),
  star: <path d={starPath(50, 52, 38)} fill={C.yellow} />,
  night: (
    <>
      <rect x="10" y="14" width="80" height="74" rx="12" fill={C.navy} />
      <path d="M62 24 Q42 28 42 46 Q44 64 64 66 Q52 58 52 46 Q52 32 62 24 Z" fill={C.yellow} />
      <path d={starPath(28, 30, 5)} fill={C.yellow} strokeWidth="1.5" />
      <path d={starPath(76, 44, 4)} fill={C.yellow} strokeWidth="1.5" />
      <path d="M10 70 L26 58 L38 66 L52 54 L68 66 L80 58 L90 64 L90 76 Q90 88 78 88 L22 88 Q10 88 10 76 Z" fill={C.ink} />
      <rect x="10" y="14" width="80" height="74" rx="12" fill="none" />
    </>
  ),
  cloud: cloud(C.white),
  rain: (
    <>
      {cloud(C.gray)}
      <path d="M30 74 L26 84 M48 74 L44 86 M66 74 L62 84" stroke={C.blue} strokeWidth="4" />
    </>
  ),
  lightning: (
    <>
      {cloud(C.stone)}
      <path d="M52 56 L40 76 L50 76 L44 94 L64 70 L54 70 L60 56 Z" fill={C.yellow} />
    </>
  ),
  rainbow: (
    <>
      {[[C.red, 38], [C.orange, 32], [C.yellow, 26], [C.green, 20], [C.blue, 14]].map(([color, r]) => (
        <path key={r} d={`M${50 - Number(r)} 74 A${r} ${r} 0 0 1 ${50 + Number(r)} 74`} fill="none" stroke={String(color)} strokeWidth="6" />
      ))}
      <path d="M8 74 A42 42 0 0 1 92 74 M30 74 A20 20 0 0 1 70 74" fill="none" strokeWidth="2.5" />
      <path d="M6 78 Q4 68 14 66 Q18 58 26 64 Q34 64 32 74 Q32 80 24 80 L12 80 Q6 80 6 78 Z" fill={C.white} />
      <path d="M68 78 Q66 68 76 66 Q80 58 88 64 Q96 64 94 74 Q94 80 86 80 L74 80 Q68 80 68 78 Z" fill={C.white} />
    </>
  ),
  snowflake: (
    <>
      <path d="M50 12 L50 88 M17 31 L83 69 M17 69 L83 31" stroke={C.blue} strokeWidth="6" />
      <path d="M42 18 L50 26 L58 18 M42 82 L50 74 L58 82 M18 42 L28 38 L24 28 M82 58 L72 62 L76 72 M18 58 L28 62 L24 72 M82 42 L72 38 L76 28" fill="none" stroke={C.blue} strokeWidth="4" />
      <circle cx="50" cy="50" r="7" fill={C.white} stroke={C.blue} strokeWidth="4" />
    </>
  ),
  cold: (
    <>
      <circle cx="50" cy="52" r="32" fill={C.sky} />
      <Face y={46} gap={18} mouth="none" />
      <path d="M38 64 L42 60 L46 64 L50 60 L54 64 L58 60 L62 64" fill="none" strokeWidth="2.5" />
      <path d="M50 10 L50 22 M44 13 L56 19 M44 19 L56 13" stroke={C.blue} strokeWidth="2.5" />
      <path d="M84 30 L84 40 M79 32 L89 38 M79 38 L89 32" stroke={C.blue} strokeWidth="2.5" />
    </>
  ),
  fire: (
    <>
      <path d="M50 10 Q60 30 72 38 Q86 52 80 70 Q74 88 50 88 Q26 88 20 70 Q14 52 30 40 Q34 52 42 52 Q36 30 50 10 Z" fill={C.orange} />
      <path d="M50 44 Q58 56 64 62 Q68 78 50 80 Q34 80 36 66 Q38 58 46 60 Q44 52 50 44 Z" fill={C.yellow} />
    </>
  ),
  "water-drop": (
    <>
      <path d="M50 10 Q30 40 24 56 Q20 84 50 86 Q80 84 76 56 Q70 40 50 10 Z" fill={C.blue} />
      <path d="M36 58 Q34 68 40 74" fill="none" stroke={C.white} strokeWidth="4" />
    </>
  ),
  wave: (
    <>
      <path d="M8 88 L8 60 Q20 30 50 28 Q76 28 80 48 Q72 40 62 44 Q54 50 62 58 Q70 62 78 56 Q88 64 92 60 L92 88 Z" fill={C.blue} />
      <path d="M14 66 Q24 46 46 40" fill="none" stroke={C.white} strokeWidth="3" />
      <path d="M8 76 Q20 70 32 76 Q44 82 56 76 Q68 70 80 76 Q88 80 92 76" fill="none" stroke={C.sky} strokeWidth="3" />
    </>
  ),
  ice: (
    <>
      <path d="M22 40 L52 26 L80 38 L80 72 L50 86 L22 74 Z" fill={C.sky} />
      <path d="M22 40 L50 52 L80 38 M50 52 L50 86" fill="none" />
      <path d="M30 50 L30 64 M60 62 L68 58" stroke={C.white} strokeWidth="4" />
    </>
  ),
  // ----- places -----
  island: (
    <>
      <path d="M6 82 Q20 76 34 82 Q48 88 62 82 Q76 76 94 82 L94 90 L6 90 Z" fill={C.blue} stroke="none" />
      <path d="M18 80 Q30 62 50 62 Q72 62 84 80 Z" fill={C.yellow} />
      <path d="M50 64 Q48 40 56 24" fill="none" stroke={C.woodDark} strokeWidth="5" />
      <path d="M56 24 Q40 14 26 22 Q40 22 46 30 Z M56 24 Q72 12 86 22 Q70 22 64 30 Z M56 24 Q64 30 66 44 Q56 36 52 30 Z" fill={C.green} />
      <path d="M6 82 Q20 76 34 82 Q48 88 62 82 Q76 76 94 82" fill="none" />
    </>
  ),
  beach: (
    <>
      <rect x="8" y="12" width="84" height="76" rx="12" fill={C.sky} />
      <circle cx="74" cy="30" r="9" fill={C.yellow} />
      <path d="M8 56 Q30 50 50 56 Q70 62 92 56 L92 70 L8 70 Z" fill={C.blue} stroke="none" />
      <path d="M8 68 Q50 60 92 68 L92 76 Q92 88 80 88 L20 88 Q8 88 8 76 Z" fill={C.yellow} />
      <path d="M34 80 L44 40" strokeWidth="3" />
      <path d="M20 46 Q40 22 66 40 Z" fill={C.red} />
      <rect x="8" y="12" width="84" height="76" rx="12" fill="none" />
    </>
  ),
  lake: (
    <>
      <path d="M8 60 L30 26 L44 44 L56 30 L86 60 Z" fill={C.green} />
      <path d="M30 26 L36 36 L30 40 L24 36 Z" fill={C.white} strokeWidth="2" />
      <ellipse cx="50" cy="72" rx="42" ry="16" fill={C.blue} />
      <path d="M30 72 L44 72 M56 78 L70 78" stroke={C.white} strokeWidth="3" />
    </>
  ),
  mountain: (
    <>
      <path d="M6 86 L38 26 L54 54 L66 38 L94 86 Z" fill={C.stone} />
      <path d="M38 26 L48 44 L42 40 L36 46 L30 40 Z" fill={C.white} strokeWidth="2.5" />
      <path d="M66 38 L74 52 L68 50 L62 54 L60 48 Z" fill={C.white} strokeWidth="2.5" />
    </>
  ),
  volcano: (
    <>
      <path d="M40 30 Q30 18 38 8 Q44 16 50 10 Q56 18 62 8 Q70 18 60 30 Z" fill={C.orange} />
      <path d="M8 88 L36 32 L64 32 L92 88 Z" fill={C.woodDark} />
      <path d="M36 32 L64 32 L60 42 L54 50 L52 42 L46 54 L42 42 Z" fill={C.red} strokeWidth="2.5" />
    </>
  ),
  galaxy: (
    <>
      <circle cx="50" cy="50" r="38" fill={C.navy} />
      <path d="M50 50 Q60 40 68 48 Q74 62 58 70 Q38 74 30 56 Q26 34 48 26 Q70 22 80 40" fill="none" stroke={C.lilac} strokeWidth="5" />
      <circle cx="50" cy="50" r="6" fill={C.yellow} />
      <path d={starPath(28, 30, 4)} fill={C.yellow} strokeWidth="1.5" />
      <path d={starPath(74, 70, 4)} fill={C.yellow} strokeWidth="1.5" />
    </>
  ),
  planet: (
    <>
      <circle cx="50" cy="50" r="26" fill={C.orange} />
      <path d="M34 42 Q50 38 66 42 M30 54 Q50 50 70 54" fill="none" stroke={C.yellow} strokeWidth="4" />
      <ellipse cx="50" cy="52" rx="44" ry="10" fill="none" transform="rotate(-15 50 52)" stroke={C.purple} strokeWidth="5" />
      <path d="M24 50 A26 26 0 0 0 76 50" fill="none" />
    </>
  ),
  earth: planetEarth,
  world: planetEarth,
  // ----- plants -----
  tree,
  "fir-tree": (
    <>
      <rect x="44" y="72" width="12" height="16" rx="2" fill={C.woodDark} />
      <path d="M50 10 L72 40 L62 40 L80 62 L66 62 L86 78 L14 78 L34 62 L20 62 L38 40 L28 40 Z" fill={C.green} />
    </>
  ),
  "christmas-tree": (
    <>
      <rect x="44" y="72" width="12" height="16" rx="2" fill={C.woodDark} />
      <path d="M50 14 L72 40 L62 40 L80 62 L66 62 L86 78 L14 78 L34 62 L20 62 L38 40 L28 40 Z" fill={C.green} />
      <path d={starPath(50, 14, 9)} fill={C.yellow} strokeWidth="2" />
      <circle cx="44" cy="40" r="3.5" fill={C.red} />
      <circle cx="58" cy="54" r="3.5" fill={C.blue} />
      <circle cx="38" cy="62" r="3.5" fill={C.yellow} />
      <circle cx="64" cy="70" r="3.5" fill={C.red} />
      <circle cx="32" cy="74" r="3" fill={C.blue} />
    </>
  ),
  log: (
    <>
      <path d="M22 36 L76 36 Q90 52 76 68 L22 68 Z" fill={C.wood} />
      <ellipse cx="22" cy="52" rx="12" ry="16" fill={C.woodLight} />
      <ellipse cx="22" cy="52" rx="6" ry="8" fill="none" stroke={C.wood} strokeWidth="2.5" />
      <path d="M40 46 L62 46 M46 58 L70 58" stroke={C.woodDark} strokeWidth="2.5" />
      <path d="M58 36 Q60 26 68 24 Q66 32 62 36" fill={C.green} strokeWidth="2.5" />
    </>
  ),
  flower: flower(C.pink),
  sunflower: (
    <>
      <Tube d="M50 52 L50 88" fill={C.green} width={4} />
      <Leaf x={50} y={76} angle={-35} size={18} />
      <Leaf x={50} y={70} angle={-145} size={16} />
      <path d={wavyCircle(50, 36, 20, 12, 5)} fill={C.yellow} />
      <circle cx="50" cy="36" r="13" fill={C.woodDark} />
      <Face y={34} gap={10} r={2.2} cheeks={false} />
    </>
  ),
  rose: (
    <>
      <Tube d="M50 48 L50 88" fill={C.green} width={4} />
      <Leaf x={50} y={72} angle={-35} size={18} />
      <Leaf x={50} y={64} angle={-145} size={16} />
      <path d="M28 28 Q30 52 50 54 Q70 52 72 28 Q62 34 50 22 Q38 34 28 28 Z" fill={C.red} />
      <path d="M40 34 Q50 46 60 34 M44 28 Q50 34 56 28" fill="none" strokeWidth="2.5" />
    </>
  ),
  tulip: (
    <>
      <Tube d="M50 50 L50 88" fill={C.green} width={4} />
      <path d="M50 88 Q32 80 28 56 Q42 64 50 80 Z" fill={C.green} />
      <path d="M30 24 L40 32 L50 18 L60 32 L70 24 Q72 52 50 54 Q28 52 30 24 Z" fill={C.purple} />
    </>
  ),
  sprout: (
    <>
      <Tube d="M50 76 L50 42" fill={C.green} width={4} />
      <path d="M50 46 Q28 48 22 28 Q44 24 50 46 Z" fill={C.leaf} />
      <path d="M50 42 Q70 42 78 22 Q56 18 50 42 Z" fill={C.green} />
      <path d="M14 82 Q50 66 86 82 L86 88 L14 88 Z" fill={C.woodDark} />
    </>
  ),
  "potted-plant": (
    <>
      <path d="M50 54 Q28 50 24 26 Q46 30 50 54 Z" fill={C.green} />
      <path d="M50 54 Q72 50 76 26 Q54 30 50 54 Z" fill={C.green} />
      <path d="M50 56 Q44 30 50 12 Q56 30 50 56 Z" fill={C.leaf} />
      <path d="M26 56 L74 56 L68 88 L32 88 Z" fill={C.orange} />
      <rect x="22" y="52" width="56" height="10" rx="3" fill={C.orange} />
    </>
  ),
  leaf: (
    <>
      <path d="M20 82 Q14 34 58 18 Q86 10 84 20 Q88 66 46 78 Q30 82 20 82 Z" fill={C.green} />
      <path d="M20 82 Q44 54 76 24 M40 62 L36 44 M52 50 L66 52 M56 42 L54 30" fill="none" strokeWidth="2.5" />
    </>
  ),
  cactus: (
    <>
      <rect x="38" y="18" width="24" height="64" rx="12" fill={C.green} />
      <path d="M38 58 L28 58 Q20 58 20 50 L20 38 Q20 32 26 32 Q32 32 32 38 L32 48 L38 48" fill={C.green} />
      <path d="M62 50 L72 50 Q80 50 80 42 L80 30 Q80 24 74 24 Q68 24 68 30 L68 40 L62 40" fill={C.green} />
      <path d="M46 30 L48 32 M54 44 L56 46 M46 58 L48 60" strokeWidth="2" />
      <path d="M30 76 L70 76 L66 90 L34 90 Z" fill={C.orange} />
    </>
  ),
  rock: (
    <>
      <path d="M12 82 Q10 60 24 48 Q36 30 56 32 Q78 34 86 58 Q92 78 80 84 Z" fill={C.stone} />
      <path d="M40 46 Q50 42 58 48 M64 62 Q70 60 74 66" fill="none" stroke={C.white} strokeWidth="3" />
    </>
  ),
  nest: (
    <>
      <ellipse cx="38" cy="46" rx="9" ry="12" fill={C.sky} />
      <ellipse cx="54" cy="44" rx="9" ry="12" fill={C.cream} />
      <ellipse cx="66" cy="48" rx="8" ry="11" fill={C.sky} />
      <path d="M12 52 Q14 84 50 84 Q86 84 88 52 Q50 62 12 52 Z" fill={C.wood} />
      <path d="M18 60 Q50 72 82 60 M22 70 Q50 80 78 70 M30 56 L38 66 M60 58 L54 70" fill="none" stroke={C.woodDark} strokeWidth="2.5" />
    </>
  ),
  feather: (
    <>
      <path d="M78 14 Q40 18 26 56 Q22 70 30 74 Q60 70 76 36 Q82 22 78 14 Z" fill={C.blue} />
      <path d="M80 12 L18 88" strokeWidth="3" />
      <path d="M50 44 L62 38 M42 54 L56 50 M56 34 L66 28" stroke={C.white} strokeWidth="2.5" />
    </>
  ),
  bone: (
    <>
      <path d="M30 40 L70 62" strokeWidth="18" />
      <path d="M30 40 L70 62" stroke={C.white} strokeWidth="12" />
      <circle cx="22" cy="44" r="9" fill={C.white} />
      <circle cx="30" cy="30" r="9" fill={C.white} />
      <circle cx="70" cy="72" r="9" fill={C.white} />
      <circle cx="78" cy="58" r="9" fill={C.white} />
      <path d="M26 38 L72 64" stroke={C.white} strokeWidth="12" />
    </>
  ),
  peanut: (
    <>
      <path d="M50 12 Q30 12 30 32 Q30 42 38 50 Q28 58 28 70 Q30 88 50 88 Q70 88 72 70 Q72 58 62 50 Q70 42 70 32 Q70 12 50 12 Z" fill={C.woodLight} />
      <path d="M40 28 L42 30 M58 26 L60 28 M50 36 L52 38 M40 68 L42 70 M58 66 L60 68 M50 76 L52 78" stroke={C.wood} strokeWidth="2.5" />
    </>
  ),
};
