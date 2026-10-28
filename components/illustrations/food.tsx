// Fruit, vegetables, meals and treats.
import { C, Leaf, wavyCircle, type Drawing } from "./parts";

const stem = (x: number, y: number) => <path d={`M${x} ${y} Q${x + 1} ${y - 8} ${x + 5} ${y - 12}`} fill="none" stroke={C.woodDark} strokeWidth="4" />;

const broccoli = (
  <>
    <path d="M44 56 L40 88 L60 88 L56 56 Z" fill={C.leaf} />
    <path d={wavyCircle(34, 44, 13, 7, 2.5)} fill={C.green} />
    <path d={wavyCircle(66, 44, 13, 7, 2.5)} fill={C.green} />
    <path d={wavyCircle(50, 32, 15, 8, 2.5)} fill={C.green} />
  </>
);

export const food: Record<string, Drawing> = {
  // ----- fruit -----
  apple: (
    <>
      {stem(50, 30)}
      <Leaf x={54} y={20} angle={-20} size={18} />
      <path d="M50 32 Q34 22 22 36 Q12 52 22 70 Q32 88 50 82 Q68 88 78 70 Q88 52 78 36 Q66 22 50 32 Z" fill={C.red} />
      <path d="M30 44 Q28 52 31 58" fill="none" stroke={C.white} strokeWidth="4" opacity="0.7" />
    </>
  ),
  pear: (
    <>
      {stem(50, 22)}
      <Leaf x={54} y={14} angle={-25} size={14} />
      <path d="M50 22 Q38 22 38 38 Q38 46 30 56 Q22 70 32 80 Q42 88 50 86 Q58 88 68 80 Q78 70 70 56 Q62 46 62 38 Q62 22 50 22 Z" fill={C.leaf} />
      <path d="M36 62 Q34 68 36 72" fill="none" stroke={C.white} strokeWidth="4" opacity="0.7" />
    </>
  ),
  orange: (
    <>
      <circle cx="50" cy="56" r="30" fill={C.orange} />
      <Leaf x={50} y={26} angle={-30} size={16} />
      <circle cx="50" cy="27" r="2.5" fill={C.woodDark} stroke="none" />
      {[[40, 48], [60, 44], [56, 66], [38, 66], [68, 58]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={C.ink} stroke="none" opacity="0.35" />
      ))}
    </>
  ),
  lemon: (
    <>
      <path d="M14 56 Q14 40 26 34 Q50 24 74 34 Q86 40 86 56 Q86 72 74 78 Q50 88 26 78 Q14 72 14 56 Z" fill={C.yellow} />
      <path d="M14 56 L8 56 M86 56 L92 56" strokeWidth="4" />
      <Leaf x={66} y={30} angle={-40} size={16} />
      <path d="M30 46 Q26 52 28 58" fill="none" stroke={C.white} strokeWidth="4" opacity="0.7" />
    </>
  ),
  banana: (
    <>
      <path d="M20 30 Q12 62 36 80 Q60 94 86 76 Q88 72 84 70 Q60 82 42 66 Q28 52 30 30 Z" fill={C.yellow} />
      <path d="M24 32 Q24 54 40 70" fill="none" strokeWidth="2" />
      <path d="M20 30 L22 18 L30 20 L30 30 Z" fill={C.woodDark} />
      <path d="M86 76 L90 72" strokeWidth="4" />
    </>
  ),
  grapes: (
    <>
      {stem(50, 22)}
      <Leaf x={54} y={14} angle={-10} size={18} />
      {[[38, 32], [50, 30], [62, 32], [32, 46], [44, 44], [56, 44], [68, 46], [38, 58], [50, 58], [62, 58], [44, 71], [56, 71], [50, 83]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill={C.purple} />
      ))}
    </>
  ),
  strawberry: (
    <>
      <path d="M50 26 Q24 22 20 42 Q20 64 50 88 Q80 64 80 42 Q76 22 50 26 Z" fill={C.red} />
      <path d="M30 24 L40 30 L50 18 L60 30 L70 24 L64 36 L50 32 L36 36 Z" fill={C.green} />
      {[[36, 46], [50, 44], [64, 46], [42, 58], [58, 58], [50, 70], [32, 58], [68, 58]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry="2.4" fill={C.yellow} stroke="none" />
      ))}
    </>
  ),
  cherry: (
    <>
      <path d="M34 62 Q40 36 58 18 Q62 40 68 58" fill="none" stroke={C.woodDark} strokeWidth="3.5" />
      <Leaf x={58} y={18} angle={-10} size={18} />
      <circle cx="32" cy="68" r="15" fill={C.red} />
      <circle cx="68" cy="66" r="15" fill={C.red} />
      <path d="M24 62 Q24 58 28 56 M60 60 Q60 56 64 54" fill="none" stroke={C.white} strokeWidth="3" opacity="0.7" />
    </>
  ),
  pineapple: (
    <>
      <path d="M50 34 L38 10 L48 20 L50 6 L54 20 L64 10 Z" fill={C.green} />
      <ellipse cx="50" cy="60" rx="24" ry="28" fill={C.yellow} />
      <path d="M32 44 L62 84 M42 36 L72 72 M30 62 L48 86 M68 44 L38 84 M58 36 L28 72 M70 62 L52 86" fill="none" stroke={C.orange} strokeWidth="2.5" />
      <ellipse cx="50" cy="60" rx="24" ry="28" fill="none" />
    </>
  ),
  watermelon: (
    <>
      <path d="M10 40 L90 40 Q90 84 50 84 Q10 84 10 40 Z" fill={C.green} />
      <path d="M16 40 L84 40 Q84 76 50 76 Q16 76 16 40 Z" fill={C.red} stroke="none" />
      <path d="M10 40 L90 40" />
      {[[34, 50], [50, 54], [66, 50], [42, 64], [58, 64]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2" ry="3.2" fill={C.ink} stroke="none" />
      ))}
    </>
  ),
  melon: (
    <>
      <ellipse cx="50" cy="56" rx="34" ry="28" fill={C.leaf} />
      <path d="M50 28 Q36 56 50 84 M50 28 Q64 56 50 84 M28 34 Q20 56 28 78 M72 34 Q80 56 72 78" fill="none" stroke={C.green} strokeWidth="2.5" />
      <ellipse cx="50" cy="56" rx="34" ry="28" fill="none" />
      {stem(50, 28)}
    </>
  ),
  kiwi: (
    <>
      <circle cx="50" cy="54" r="32" fill={C.woodDark} />
      <circle cx="50" cy="54" r="26" fill={C.leaf} stroke="none" />
      <circle cx="50" cy="54" r="9" fill={C.cream} stroke="none" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI / 5) * i;
        return <ellipse key={i} cx={(50 + 15 * Math.cos(a)).toFixed(1)} cy={(54 + 15 * Math.sin(a)).toFixed(1)} rx="1.4" ry="2.2" fill={C.ink} stroke="none" />;
      })}
    </>
  ),
  coconut: (
    <>
      <circle cx="50" cy="56" r="32" fill={C.woodDark} />
      <path d="M28 40 Q32 36 36 38 M60 32 Q64 30 68 34 M38 72 Q42 70 46 74" fill="none" stroke={C.wood} strokeWidth="2.5" />
      <circle cx="44" cy="46" r="3" fill={C.ink} stroke="none" />
      <circle cx="56" cy="46" r="3" fill={C.ink} stroke="none" />
      <circle cx="50" cy="56" r="3" fill={C.ink} stroke="none" />
    </>
  ),
  olive: (
    <>
      <path d="M30 26 Q50 16 72 24" fill="none" stroke={C.woodDark} strokeWidth="3.5" />
      <Leaf x={50} y={20} angle={-150} size={16} />
      <Leaf x={62} y={22} angle={-30} size={16} />
      <ellipse cx="38" cy="56" rx="15" ry="20" fill={C.green} transform="rotate(-15 38 56)" />
      <ellipse cx="66" cy="60" rx="15" ry="20" fill={C.green} transform="rotate(15 66 60)" />
      <path d="M32 44 Q30 48 32 52 M60 48 Q58 52 60 56" fill="none" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  // ----- vegetables -----
  carrot: (
    <>
      <path d="M50 28 L40 10 M50 28 L50 8 M50 28 L60 10" stroke={C.green} strokeWidth="5" />
      <path d="M36 30 Q50 22 64 30 Q60 60 50 90 Q40 60 36 30 Z" fill={C.orange} />
      <path d="M42 42 L48 44 M52 54 L58 52 M44 64 L50 66" strokeWidth="2.5" />
    </>
  ),
  tomato: (
    <>
      <path d="M50 32 Q22 26 16 52 Q14 80 50 84 Q86 80 84 52 Q78 26 50 32 Z" fill={C.red} />
      <path d="M36 30 L44 34 L50 24 L56 34 L64 30 L58 38 L50 36 L42 38 Z" fill={C.green} />
      <path d="M28 46 Q26 52 28 56" fill="none" stroke={C.white} strokeWidth="4" opacity="0.7" />
    </>
  ),
  potato: (
    <>
      <path d="M18 54 Q16 34 40 32 Q60 28 76 38 Q90 50 82 66 Q72 82 48 80 Q20 78 18 54 Z" fill={C.wood} />
      {[[36, 48], [58, 44], [70, 60], [44, 66]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={C.woodDark} stroke="none" />
      ))}
    </>
  ),
  onion: (
    <>
      <path d="M50 22 L50 10 M46 12 Q50 18 54 12" fill="none" stroke={C.green} strokeWidth="3" />
      <path d="M50 22 Q20 40 22 64 Q26 84 50 84 Q74 84 78 64 Q80 40 50 22 Z" fill={C.lilac} />
      <path d="M50 26 Q34 50 40 82 M50 26 Q66 50 60 82" fill="none" strokeWidth="2" />
      <path d="M42 84 L40 90 M50 84 L50 91 M58 84 L60 90" strokeWidth="2" />
    </>
  ),
  garlic: (
    <>
      <path d="M50 16 L50 26" strokeWidth="4" />
      <path d="M50 24 Q26 40 22 62 Q22 82 50 84 Q78 82 78 62 Q74 40 50 24 Z" fill={C.white} />
      <path d="M50 30 Q36 50 38 82 M50 30 Q64 50 62 82" fill="none" strokeWidth="2" />
    </>
  ),
  broccoli,
  vegetable: broccoli,
  corn: (
    <>
      <path d="M50 88 Q24 70 28 40 Q36 60 50 64 Z" fill={C.green} />
      <path d="M50 88 Q76 70 72 40 Q64 60 50 64 Z" fill={C.green} />
      <ellipse cx="50" cy="44" rx="14" ry="32" fill={C.yellow} />
      <path d="M38 34 L62 34 M37 46 L63 46 M38 58 L62 58 M50 14 L50 74 M43 18 L43 72 M57 18 L57 72" fill="none" stroke={C.orange} strokeWidth="2" />
      <ellipse cx="50" cy="44" rx="14" ry="32" fill="none" />
      <path d="M50 88 Q30 76 34 54 M50 88 Q70 76 66 54" fill={C.green} />
    </>
  ),
  cucumber: (
    <>
      <path d="M14 66 Q14 50 32 44 L72 30 Q88 26 90 38 Q92 50 76 56 L36 72 Q14 80 14 66 Z" fill={C.green} />
      {[[30, 58], [46, 50], [62, 44], [76, 40], [40, 62], [58, 54]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill={C.leaf} stroke="none" />
      ))}
    </>
  ),
  pumpkin: (
    <>
      <path d="M50 30 Q50 18 58 14" fill="none" stroke={C.woodDark} strokeWidth="5" />
      <ellipse cx="30" cy="58" rx="18" ry="26" fill={C.orange} />
      <ellipse cx="70" cy="58" rx="18" ry="26" fill={C.orange} />
      <ellipse cx="50" cy="58" rx="18" ry="28" fill={C.orange} />
      <Leaf x={56} y={24} angle={-10} size={16} />
    </>
  ),
  mushroom: (
    <>
      <path d="M38 50 Q36 74 34 86 L66 86 Q64 74 62 50 Z" fill={C.cream} />
      <path d="M10 52 Q12 16 50 14 Q88 16 90 52 Q50 60 10 52 Z" fill={C.red} />
      <circle cx="34" cy="32" r="6" fill={C.white} stroke="none" />
      <circle cx="58" cy="26" r="5" fill={C.white} stroke="none" />
      <circle cx="72" cy="42" r="5" fill={C.white} stroke="none" />
      <circle cx="48" cy="44" r="4" fill={C.white} stroke="none" />
    </>
  ),
  salad: (
    <>
      <path d={wavyCircle(50, 44, 26, 10, 3)} fill={C.leaf} />
      <circle cx="40" cy="42" r="7" fill={C.red} />
      <circle cx="60" cy="38" r="6" fill={C.red} />
      <path d="M50 30 Q54 40 48 48" fill="none" stroke={C.green} strokeWidth="4" />
      <path d="M12 50 L88 50 Q86 84 50 86 Q14 84 12 50 Z" fill={C.blue} />
      <path d="M22 62 Q50 70 78 62" fill="none" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  beans: (
    <>
      {[[34, 40, -20], [56, 34, 15], [70, 54, -35], [44, 60, 25], [28, 66, -10], [60, 72, 10]].map(([x, y, a]) => (
        <path key={`${x}-${y}`} d="M-12 0 Q-12 -8 -2 -7 Q2 -5 6 -7 Q14 -8 13 1 Q12 9 0 8 Q-12 8 -12 0 Z" transform={`translate(${x} ${y}) rotate(${a})`} fill={C.woodDark} />
      ))}
      <path d="M30 36 Q32 34 34 35 M52 31 Q54 29 56 30" fill="none" stroke={C.wood} strokeWidth="2" />
    </>
  ),
  // ----- meals -----
  bread: (
    <>
      <path d="M12 60 Q10 34 32 32 Q50 30 70 32 Q92 34 88 60 Q86 76 50 78 Q14 76 12 60 Z" fill={C.wood} />
      <path d="M30 42 L38 56 M46 40 L54 56 M62 42 L70 56" fill="none" stroke={C.woodLight} strokeWidth="4" />
    </>
  ),
  egg: (
    <>
      <path d="M50 14 Q24 16 22 54 Q22 84 50 86 Q78 84 78 54 Q76 16 50 14 Z" fill={C.cream} />
      <path d="M36 36 Q32 44 32 52" fill="none" stroke={C.white} strokeWidth="5" />
    </>
  ),
  cheese: (
    <>
      <path d="M12 72 L12 46 L76 26 L88 46 L88 72 Z" fill={C.yellow} />
      <path d="M12 46 L88 46" />
      <circle cx="30" cy="60" r="6" fill={C.orange} />
      <circle cx="58" cy="56" r="4" fill={C.orange} />
      <circle cx="72" cy="64" r="5" fill={C.orange} />
      <circle cx="50" cy="38" r="3" fill={C.orange} />
    </>
  ),
  rice: (
    <>
      <path d={wavyCircle(50, 44, 22, 10, 2.5)} fill={C.white} />
      <path d="M40 38 L42 40 M52 32 L54 34 M60 42 L62 44 M46 46 L48 48" strokeWidth="2" />
      <path d="M12 50 L88 50 Q86 84 50 86 Q14 84 12 50 Z" fill={C.red} />
      <path d="M22 62 Q50 70 78 62" fill="none" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  soup: (
    <>
      <path d="M38 26 Q34 18 40 12 M50 26 Q46 18 52 12 M62 26 Q58 18 64 12" fill="none" stroke={C.grayDark} strokeWidth="2.5" />
      <ellipse cx="50" cy="44" rx="38" ry="8" fill={C.orange} />
      <path d="M12 44 L88 44 Q86 82 50 84 Q14 82 12 44 Z" fill={C.blue} />
      <circle cx="38" cy="43" r="3" fill={C.green} stroke="none" />
      <circle cx="60" cy="42" r="3" fill={C.red} stroke="none" />
      <path d="M70 40 L90 18" strokeWidth="5" />
    </>
  ),
  noodles: (
    <>
      <path d="M60 10 L46 46 M72 12 L54 46" strokeWidth="3.5" stroke={C.woodDark} />
      <path d="M26 44 Q36 30 44 44 Q52 30 60 44 Q68 30 76 44" fill="none" stroke={C.yellow} strokeWidth="5" />
      <path d="M12 44 L88 44 Q86 82 50 84 Q14 82 12 44 Z" fill={C.red} />
      <path d="M26 58 L74 58" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  "chicken-leg": (
    <>
      <path d="M58 54 L78 74" strokeWidth="9" />
      <path d="M58 54 L78 74" stroke={C.white} strokeWidth="4" />
      <circle cx="80" cy="70" r="5" fill={C.white} />
      <circle cx="74" cy="78" r="5" fill={C.white} />
      <path d="M20 40 Q18 20 40 18 Q62 18 66 40 Q68 56 52 62 Q34 68 24 58 Q18 50 20 40 Z" fill={C.wood} />
      <path d="M30 32 Q34 28 40 30" fill="none" stroke={C.woodLight} strokeWidth="3" />
    </>
  ),
  hamburger: (
    <>
      <path d="M16 46 Q16 18 50 18 Q84 18 84 46 Z" fill={C.wood} />
      <path d="M36 30 L38 32 M50 26 L52 28 M64 30 L66 32" strokeWidth="2" stroke={C.cream} />
      <path d="M12 52 Q22 44 32 52 Q42 44 52 52 Q62 44 72 52 Q82 44 88 52" fill="none" stroke={C.green} strokeWidth="5" />
      <rect x="14" y="54" width="72" height="12" rx="6" fill={C.woodDark} />
      <path d="M16 68 L84 68 Q84 84 50 84 Q16 84 16 68 Z" fill={C.wood} />
      <path d="M18 66 L82 66 L74 72 L62 66 Z" fill={C.yellow} strokeWidth="2" />
    </>
  ),
  "hot-dog": (
    <>
      <path d="M12 58 Q12 44 26 44 L74 44 Q88 44 88 58 Q88 72 74 72 L26 72 Q12 72 12 58 Z" fill={C.wood} />
      <rect x="10" y="48" width="80" height="12" rx="6" fill={C.red} />
      <path d="M20 54 Q26 48 32 54 Q38 60 44 54 Q50 48 56 54 Q62 60 68 54 Q74 48 80 54" fill="none" stroke={C.yellow} strokeWidth="3" />
    </>
  ),
  sandwich: (
    <>
      <path d="M10 70 L50 30 L90 70 Z" fill={C.woodLight} />
      <path d="M14 66 L86 66" stroke={C.green} strokeWidth="5" />
      <path d="M16 72 L84 72" stroke={C.red} strokeWidth="5" />
      <path d="M10 76 L90 76 L90 84 L10 84 Z" fill={C.woodLight} />
    </>
  ),
  pizza: (
    <>
      <path d="M50 88 L14 22 Q50 6 86 22 Z" fill={C.yellow} />
      <path d="M14 22 Q50 6 86 22 L82 30 Q50 16 18 30 Z" fill={C.wood} />
      <circle cx="44" cy="38" r="6" fill={C.red} />
      <circle cx="58" cy="52" r="6" fill={C.red} />
      <circle cx="46" cy="64" r="5" fill={C.red} />
      <circle cx="62" cy="34" r="3" fill={C.green} stroke="none" />
      <circle cx="40" cy="52" r="3" fill={C.green} stroke="none" />
    </>
  ),
  waffle: (
    <>
      <rect x="16" y="20" width="68" height="68" rx="12" fill={C.wood} />
      <path d="M33 22 L33 86 M50 22 L50 86 M67 22 L67 86 M18 37 L82 37 M18 54 L82 54 M18 71 L82 71" stroke={C.woodDark} strokeWidth="2.5" />
      <path d="M34 20 Q34 32 42 28 Q46 38 54 30 Q60 36 66 20 Z" fill={C.yellow} />
    </>
  ),
  popcorn: (
    <>
      {[[34, 30], [50, 24], [66, 30], [42, 18], [58, 16], [28, 40], [72, 40]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={wavyCircle(x, y, 7, 5, 1.6)} fill={C.cream} />
      ))}
      <path d="M22 40 L78 40 L70 88 L30 88 Z" fill={C.white} />
      <path d="M36 40 L40 88 M50 40 L50 88 M64 40 L60 88" stroke={C.red} strokeWidth="6" />
      <path d="M22 40 L78 40 L70 88 L30 88 Z" fill="none" />
    </>
  ),
  // ----- treats and drinks -----
  cake: (
    <>
      <path d="M50 22 L50 34" strokeWidth="3" />
      <path d="M50 10 Q46 16 50 20 Q54 16 50 10 Z" fill={C.orange} strokeWidth="2" />
      <rect x="18" y="34" width="64" height="24" rx="6" fill={C.pink} />
      <path d="M18 44 Q26 52 34 44 Q42 52 50 44 Q58 52 66 44 Q74 52 82 44" fill="none" stroke={C.white} strokeWidth="4" />
      <rect x="12" y="58" width="76" height="28" rx="6" fill={C.wood} />
      <path d="M12 70 L88 70" stroke={C.red} strokeWidth="4" />
      <circle cx="32" cy="36" r="4" fill={C.red} />
      <circle cx="68" cy="36" r="4" fill={C.red} />
    </>
  ),
  cookie: (
    <>
      <circle cx="50" cy="54" r="32" fill={C.wood} />
      {[[38, 42], [60, 40], [66, 60], [44, 66], [52, 52], [34, 56]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={C.woodDark} stroke="none" />
      ))}
    </>
  ),
  chocolate: (
    <>
      <path d="M22 30 L70 22 L80 86 L32 92 Z" fill={C.woodDark} />
      <path d="M38 28 L48 89 M54 25 L64 87 M25 48 L74 41 M28 68 L77 61" stroke={C.wood} strokeWidth="2.5" />
      <path d="M22 30 L70 22 L80 86 L32 92 Z" fill="none" />
      <path d="M26 56 L80 46 L84 86 L32 92 Z" fill={C.red} />
      <path d="M40 74 L72 68" stroke={C.white} strokeWidth="3" opacity="0.7" />
    </>
  ),
  candy: (
    <>
      <path d="M28 50 L10 36 L12 64 Z" fill={C.purple} />
      <path d="M72 50 L90 36 L88 64 Z" fill={C.purple} />
      <ellipse cx="50" cy="50" rx="24" ry="18" fill={C.pink} />
      <path d="M38 36 Q46 50 38 64 M52 32 Q60 50 52 68" fill="none" stroke={C.white} strokeWidth="3.5" />
    </>
  ),
  lollipop: (
    <>
      <path d="M50 60 L50 92" strokeWidth="8" />
      <path d="M50 60 L50 92" stroke={C.white} strokeWidth="3" />
      <circle cx="50" cy="38" r="28" fill={C.pink} />
      <path d="M50 38 m0 0 Q58 32 60 40 Q60 52 48 52 Q34 50 36 36 Q40 20 58 22 Q74 28 74 42" fill="none" stroke={C.purple} strokeWidth="4" />
    </>
  ),
  "ice-cream": (
    <>
      <path d="M30 50 L50 92 L70 50 Z" fill={C.wood} />
      <path d="M36 54 L60 70 M44 52 L64 62 M64 54 L42 70 M56 52 L38 62" stroke={C.woodDark} strokeWidth="2" />
      <circle cx="40" cy="44" r="13" fill={C.pink} />
      <circle cx="60" cy="44" r="13" fill={C.cream} />
      <circle cx="50" cy="28" r="14" fill={C.woodDark} />
      <circle cx="50" cy="13" r="4" fill={C.red} />
    </>
  ),
  flan: (
    <>
      <path d="M30 28 L70 28 L82 78 L18 78 Z" fill={C.yellow} />
      <path d="M30 28 L70 28 L72 38 Q60 44 50 38 Q40 44 28 38 Z" fill={C.woodDark} />
      <ellipse cx="50" cy="82" rx="40" ry="7" fill={C.white} />
      <path d="M30 28 L70 28 L82 78 L18 78 Z" fill="none" />
    </>
  ),
  yogurt: (
    <>
      <path d="M24 30 L76 30 L68 88 L32 88 Z" fill={C.white} />
      <path d="M26 42 L74 42 L72 58 L28 58 Z" fill={C.pink} />
      <circle cx="50" cy="50" r="5" fill={C.red} strokeWidth="2" />
      <path d="M20 22 L80 22 L78 30 L22 30 Z" fill={C.gray} />
      <path d="M62 22 L86 8" strokeWidth="5" />
      <path d="M62 22 L86 8" stroke={C.white} strokeWidth="1.5" />
    </>
  ),
  jelly: (
    <>
      <ellipse cx="50" cy="84" rx="40" ry="6" fill={C.white} />
      <path d="M24 82 L30 34 Q32 24 42 24 L58 24 Q68 24 70 34 L76 82 Z" fill={C.green} />
      <path d="M36 30 L34 80 M50 24 L50 82 M64 30 L66 80" stroke={C.leaf} strokeWidth="3" />
      <path d="M24 82 L30 34 Q32 24 42 24 L58 24 Q68 24 70 34 L76 82 Z" fill="none" />
      <circle cx="50" cy="18" r="6" fill={C.red} />
    </>
  ),
  honey: (
    <>
      <path d="M26 30 L74 30 L78 40 Q86 62 76 82 Q50 92 24 82 Q14 62 22 40 Z" fill={C.yellow} />
      <rect x="22" y="20" width="56" height="12" rx="5" fill={C.woodDark} />
      <rect x="32" y="48" width="36" height="22" rx="5" fill={C.cream} />
      <path d="M44 54 L50 50 L56 54 L56 62 L50 66 L44 62 Z" fill={C.orange} strokeWidth="2" />
      <path d="M30 32 Q30 42 34 44 Q36 40 36 32" fill={C.orange} strokeWidth="2" />
    </>
  ),
  milk: (
    <>
      <path d="M30 32 L50 16 L70 32 L70 88 L30 88 Z" fill={C.white} />
      <path d="M30 32 L70 32" />
      <path d="M30 50 L70 50 L70 74 L30 74 Z" fill={C.blue} />
      <path d="M44 62 Q50 54 56 62 Q50 68 44 62 Z" fill={C.white} strokeWidth="2" />
      <path d="M42 22 L58 22" strokeWidth="2.5" />
    </>
  ),
  juice: (
    <>
      <path d="M60 22 L66 6 L74 8" fill="none" strokeWidth="3" />
      <rect x="28" y="22" width="44" height="66" rx="6" fill={C.orange} />
      <circle cx="50" cy="56" r="13" fill={C.yellow} />
      <path d="M50 43 L50 69 M37 56 L63 56 M41 47 L59 65 M59 47 L41 65" stroke={C.orange} strokeWidth="2" />
      <circle cx="50" cy="56" r="13" fill="none" />
    </>
  ),
  soda: (
    <>
      <path d="M56 26 L62 8 L70 10" fill="none" strokeWidth="3" />
      <path d="M24 26 L76 26 L70 88 L30 88 Z" fill={C.red} />
      <path d="M24 26 L76 26 L74 34 L26 34 Z" fill={C.white} />
      <path d="M32 56 Q50 48 68 56" fill="none" stroke={C.white} strokeWidth="4" />
    </>
  ),
};
