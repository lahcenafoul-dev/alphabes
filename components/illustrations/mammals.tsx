import { C, Eye, Face, wavyCircle, type Drawing } from "./parts";

const whiskers = (y: number) => (
  <path d={`M16 ${y} L31 ${y + 2} M16 ${y + 8} L31 ${y + 6} M84 ${y} L69 ${y + 2} M84 ${y + 8} L69 ${y + 6}`} strokeWidth="2" />
);

/** A horse's head and neck in profile, facing left: horse, zebra, unicorn. */
function horseHead(coat: string, mane: string) {
  return (
    <>
      <path d="M30 66 Q20 64 20 56 Q20 48 30 40 L46 24 Q54 20 60 26 Q74 44 78 88 L46 88 Q46 72 40 64 Z" fill={coat} />
      <path d="M58 22 Q72 30 80 50 Q86 70 82 88 L77 88 Q76 56 62 32 Z" fill={mane} />
      <path d="M50 25 L54 10 L60 25 Z" fill={coat} />
      <Eye x={42} y={38} />
      <circle cx="25" cy="55" r="1.8" fill={C.ink} stroke="none" />
      <path d="M22 61 Q27 63 31 62" fill="none" strokeWidth="2.5" />
    </>
  );
}

/** A cow-like head with horns: cow, ox. */
function cattleHead(coat: string, spot: string | null) {
  return (
    <>
      <path d="M32 32 Q20 28 21 15 Q30 24 38 27 Z" fill={C.cream} />
      <path d="M68 32 Q80 28 79 15 Q70 24 62 27 Z" fill={C.cream} />
      <ellipse cx="22" cy="42" rx="11" ry="6" fill={coat} transform="rotate(-20 22 42)" />
      <ellipse cx="78" cy="42" rx="11" ry="6" fill={coat} transform="rotate(20 78 42)" />
      <path d="M30 30 Q50 22 70 30 L68 62 Q50 70 32 62 Z" fill={coat} />
      {spot && <path d="M55 29 Q66 27 68 38 Q62 45 55 38 Z" fill={spot} stroke="none" />}
      <Face y={44} gap={20} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="66" rx="20" ry="13" fill={C.pink} />
      <ellipse cx="43" cy="65" rx="2.5" ry="3.5" fill={C.ink} stroke="none" />
      <ellipse cx="57" cy="65" rx="2.5" ry="3.5" fill={C.ink} stroke="none" />
    </>
  );
}

export const mammals: Record<string, Drawing> = {
  cat: (
    <>
      <path d="M27 44 L29 14 L47 30 Z" fill={C.orange} />
      <path d="M73 44 L71 14 L53 30 Z" fill={C.orange} />
      <path d="M32 33 L32 23 L40 29 Z" fill={C.pink} stroke="none" />
      <path d="M68 33 L68 23 L60 29 Z" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="54" rx="30" ry="27" fill={C.orange} />
      <path d="M44 29 L46 37 M50 28 L50 37 M56 29 L54 37" strokeWidth="2.5" />
      <Face y={51} gap={20} mouth="none" />
      <path d="M47 59 L53 59 L50 62 Z" fill={C.pink} strokeWidth="2" />
      <path d="M50 62 Q46 67 42 64 M50 62 Q54 67 58 64" fill="none" strokeWidth="2.5" />
      {whiskers(58)}
    </>
  ),
  dog: (
    <>
      <ellipse cx="50" cy="52" rx="26" ry="28" fill={C.white} />
      <ellipse cx="60" cy="46" rx="9" ry="8" fill={C.wood} stroke="none" />
      <path d="M30 30 Q12 32 15 58 Q22 67 32 52 Z" fill={C.woodDark} />
      <path d="M70 30 Q88 32 85 58 Q78 67 68 52 Z" fill={C.woodDark} />
      <ellipse cx="50" cy="65" rx="13" ry="10" fill={C.cream} />
      <Face y={46} gap={18} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="60" rx="5.5" ry="4" fill={C.ink} />
      <path d="M50 63 L50 67 M43 68 Q50 73 57 68" fill="none" strokeWidth="2.5" />
      <path d="M47 70 Q47 78 51 78 Q55 78 54 70" fill={C.red} strokeWidth="2" />
    </>
  ),
  bear: (
    <>
      <circle cx="27" cy="30" r="11" fill={C.wood} />
      <circle cx="73" cy="30" r="11" fill={C.wood} />
      <circle cx="27" cy="30" r="5" fill={C.woodDark} stroke="none" />
      <circle cx="73" cy="30" r="5" fill={C.woodDark} stroke="none" />
      <circle cx="50" cy="54" r="30" fill={C.wood} />
      <ellipse cx="50" cy="65" rx="13" ry="10" fill={C.woodLight} />
      <Face y={48} gap={22} mouth="none" />
      <ellipse cx="50" cy="61" rx="5" ry="3.5" fill={C.ink} />
      <path d="M50 64 L50 67 M45 69 Q50 72 55 69" fill="none" strokeWidth="2.5" />
    </>
  ),
  "teddy-bear": (
    <>
      <circle cx="30" cy="22" r="8" fill={C.wood} />
      <circle cx="70" cy="22" r="8" fill={C.wood} />
      <ellipse cx="50" cy="70" rx="22" ry="18" fill={C.wood} />
      <ellipse cx="50" cy="72" rx="11" ry="10" fill={C.woodLight} />
      <ellipse cx="26" cy="64" rx="7" ry="10" fill={C.wood} transform="rotate(30 26 64)" />
      <ellipse cx="74" cy="64" rx="7" ry="10" fill={C.wood} transform="rotate(-30 74 64)" />
      <ellipse cx="36" cy="86" rx="9" ry="6" fill={C.wood} />
      <ellipse cx="64" cy="86" rx="9" ry="6" fill={C.wood} />
      <circle cx="50" cy="34" r="20" fill={C.wood} />
      <ellipse cx="50" cy="41" rx="8" ry="6" fill={C.woodLight} />
      <Face y={31} gap={14} r={2.6} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="39" rx="3" ry="2" fill={C.ink} />
      <path d="M44 52 L50 56 L56 52 L56 60 L50 56 L44 60 Z" fill={C.red} strokeWidth="2" />
    </>
  ),
  mouse: (
    <>
      <circle cx="26" cy="32" r="15" fill={C.gray} />
      <circle cx="74" cy="32" r="15" fill={C.gray} />
      <circle cx="26" cy="32" r="8.5" fill={C.pink} stroke="none" />
      <circle cx="74" cy="32" r="8.5" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="58" rx="25" ry="23" fill={C.gray} />
      <Face y={54} gap={16} mouth="none" />
      <circle cx="50" cy="64" r="3.5" fill={C.pink} strokeWidth="2" />
      {whiskers(62)}
    </>
  ),
  rabbit: (
    <>
      <ellipse cx="38" cy="26" rx="8" ry="20" fill={C.white} />
      <ellipse cx="62" cy="26" rx="8" ry="20" fill={C.white} />
      <ellipse cx="38" cy="27" rx="3.5" ry="13" fill={C.pink} stroke="none" />
      <ellipse cx="62" cy="27" rx="3.5" ry="13" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="62" rx="26" ry="23" fill={C.white} />
      <Face y={58} gap={18} mouth="none" />
      <path d="M47 64 L53 64 L50 67 Z" fill={C.pink} strokeWidth="2" />
      <path d="M50 67 L50 70 M45 71 Q50 74 55 71" fill="none" strokeWidth="2.5" />
      <rect x="47" y="72" width="6" height="5" rx="1" fill={C.white} strokeWidth="2" />
    </>
  ),
  pig: (
    <>
      <path d="M29 36 L25 17 L43 28 Z" fill={C.pink} />
      <path d="M71 36 L75 17 L57 28 Z" fill={C.pink} />
      <ellipse cx="50" cy="54" rx="31" ry="27" fill={C.pink} />
      <Face y={45} gap={24} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="61" rx="13" ry="9" fill="#FF8FA3" />
      <ellipse cx="45.5" cy="61" rx="2.2" ry="3.4" fill={C.ink} stroke="none" />
      <ellipse cx="54.5" cy="61" rx="2.2" ry="3.4" fill={C.ink} stroke="none" />
      <path d="M43 74 Q50 78 57 74" fill="none" strokeWidth="2.5" />
    </>
  ),
  cow: cattleHead(C.white, C.ink),
  ox: cattleHead(C.wood, C.woodDark),
  lion: (
    <>
      <path d={wavyCircle(50, 52, 31, 14, 3.5)} fill={C.orange} />
      <circle cx="31" cy="34" r="7" fill={C.yellow} />
      <circle cx="69" cy="34" r="7" fill={C.yellow} />
      <circle cx="50" cy="54" r="24" fill={C.yellow} />
      <Face y={50} gap={16} mouth="none" />
      <path d="M45 57 L55 57 L50 62 Z" fill={C.woodDark} strokeWidth="2" />
      <path d="M50 62 Q46 67 42 64 M50 62 Q54 67 58 64" fill="none" strokeWidth="2.5" />
    </>
  ),
  tiger: (
    <>
      <circle cx="28" cy="30" r="9" fill={C.orange} />
      <circle cx="72" cy="30" r="9" fill={C.orange} />
      <circle cx="28" cy="30" r="4" fill={C.white} stroke="none" />
      <circle cx="72" cy="30" r="4" fill={C.white} stroke="none" />
      <ellipse cx="50" cy="54" rx="30" ry="27" fill={C.orange} />
      <path d="M34 62 Q50 52 66 62 Q62 78 50 78 Q38 78 34 62 Z" fill={C.white} />
      <path d="M50 28 L50 37 M42 29 L44 37 M58 29 L56 37 M21 50 L30 52 M21 60 L29 59 M79 50 L70 52 M79 60 L71 59" strokeWidth="3" />
      <Face y={49} gap={20} mouth="none" cheeks={false} />
      <path d="M46 61 L54 61 L50 65 Z" fill={C.pink} strokeWidth="2" />
      <path d="M50 65 Q46 70 42 67 M50 65 Q54 70 58 67" fill="none" strokeWidth="2.5" />
    </>
  ),
  jaguar: (
    <>
      <circle cx="28" cy="30" r="9" fill={C.yellow} />
      <circle cx="72" cy="30" r="9" fill={C.yellow} />
      <ellipse cx="50" cy="54" rx="30" ry="27" fill={C.yellow} />
      <path d="M34 62 Q50 52 66 62 Q62 78 50 78 Q38 78 34 62 Z" fill={C.cream} />
      {[[38, 34], [50, 31], [62, 34], [27, 50], [73, 50], [30, 63], [70, 63]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" fill="none" stroke={C.woodDark} strokeWidth="2.5" />
      ))}
      <Face y={49} gap={20} mouth="none" cheeks={false} />
      <path d="M46 61 L54 61 L50 65 Z" fill={C.woodDark} strokeWidth="2" />
      <path d="M50 65 Q46 70 42 67 M50 65 Q54 70 58 67" fill="none" strokeWidth="2.5" />
    </>
  ),
  fox: (
    <>
      <path d="M24 46 L26 12 L46 32 Z" fill={C.orange} />
      <path d="M76 46 L74 12 L54 32 Z" fill={C.orange} />
      <path d="M30 34 L30 22 L39 31 Z" fill={C.ink} stroke="none" />
      <path d="M70 34 L70 22 L61 31 Z" fill={C.ink} stroke="none" />
      <path d="M20 42 Q50 20 80 42 Q74 66 50 82 Q26 66 20 42 Z" fill={C.orange} />
      <path d="M22 46 Q36 52 44 64 Q50 72 50 81 Q27 66 22 46 Z" fill={C.white} stroke="none" />
      <path d="M78 46 Q64 52 56 64 Q50 72 50 81 Q73 66 78 46 Z" fill={C.white} stroke="none" />
      <path d="M20 42 Q50 20 80 42 Q74 66 50 82 Q26 66 20 42 Z" fill="none" />
      <Face y={48} gap={22} mouth="none" cheeks={false} />
      <circle cx="50" cy="76" r="3.5" fill={C.ink} />
    </>
  ),
  wolf: (
    <>
      <path d="M26 42 L26 12 L44 30 Z" fill={C.grayDark} />
      <path d="M74 42 L74 12 L56 30 Z" fill={C.grayDark} />
      <path d="M22 40 Q50 22 78 40 Q76 62 50 82 Q24 62 22 40 Z" fill={C.stone} />
      <path d="M38 58 Q50 50 62 58 Q58 77 50 82 Q42 77 38 58 Z" fill={C.white} />
      <Face y={46} gap={20} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="66" rx="5" ry="3.5" fill={C.ink} />
    </>
  ),
  panda: (
    <>
      <circle cx="28" cy="30" r="10" fill={C.ink} />
      <circle cx="72" cy="30" r="10" fill={C.ink} />
      <ellipse cx="50" cy="54" rx="30" ry="27" fill={C.white} />
      <ellipse cx="39" cy="50" rx="7" ry="9.5" transform="rotate(30 39 50)" fill={C.ink} />
      <ellipse cx="61" cy="50" rx="7" ry="9.5" transform="rotate(-30 61 50)" fill={C.ink} />
      <circle cx="40" cy="49" r="2.6" fill={C.white} stroke="none" />
      <circle cx="60" cy="49" r="2.6" fill={C.white} stroke="none" />
      <ellipse cx="32" cy="62" rx="4" ry="2.6" fill={C.pink} stroke="none" />
      <ellipse cx="68" cy="62" rx="4" ry="2.6" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="60" rx="4.5" ry="3" fill={C.ink} />
      <path d="M50 63 Q46 68 43 65 M50 63 Q54 68 57 65" fill="none" strokeWidth="2.5" />
    </>
  ),
  koala: (
    <>
      <circle cx="24" cy="38" r="15" fill={C.stone} />
      <circle cx="76" cy="38" r="15" fill={C.stone} />
      <circle cx="24" cy="38" r="8" fill={C.pink} stroke="none" />
      <circle cx="76" cy="38" r="8" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="57" rx="27" ry="25" fill={C.stone} />
      <Face y={50} gap={24} mouth="none" />
      <ellipse cx="50" cy="61" rx="6.5" ry="9" fill={C.grayDark} />
      <path d="M45 74 Q50 77 55 74" fill="none" strokeWidth="2.5" />
    </>
  ),
  monkey: (
    <>
      <circle cx="22" cy="52" r="10" fill={C.woodDark} />
      <circle cx="78" cy="52" r="10" fill={C.woodDark} />
      <circle cx="22" cy="52" r="5" fill={C.skin} stroke="none" />
      <circle cx="78" cy="52" r="5" fill={C.skin} stroke="none" />
      <circle cx="50" cy="50" r="29" fill={C.woodDark} />
      <path d="M50 40 Q38 30 32 42 Q28 56 36 66 Q50 80 64 66 Q72 56 68 42 Q62 30 50 40 Z" fill={C.skin} />
      <Face y={47} gap={14} mouth="none" cheeks={false} />
      <circle cx="47" cy="57" r="1.4" fill={C.ink} stroke="none" />
      <circle cx="53" cy="57" r="1.4" fill={C.ink} stroke="none" />
      <path d="M41 63 Q50 71 59 63" fill="none" strokeWidth="2.5" />
    </>
  ),
  gorilla: (
    <>
      <circle cx="24" cy="50" r="7" fill={C.grayDark} />
      <circle cx="76" cy="50" r="7" fill={C.grayDark} />
      <path d="M50 16 Q78 18 76 52 Q76 84 50 84 Q24 84 24 52 Q22 18 50 16 Z" fill={C.grayDark} />
      <path d="M50 38 Q62 32 66 44 Q70 58 64 70 Q50 80 36 70 Q30 58 34 44 Q38 32 50 38 Z" fill={C.gray} />
      <path d="M35 45 Q50 37 65 45" fill="none" strokeWidth="3" />
      <Eye x={43} y={51} />
      <Eye x={57} y={51} />
      <ellipse cx="46" cy="61" rx="2" ry="2.6" fill={C.ink} stroke="none" />
      <ellipse cx="54" cy="61" rx="2" ry="2.6" fill={C.ink} stroke="none" />
      <path d="M42 70 Q50 74 58 70" fill="none" strokeWidth="2.5" />
    </>
  ),
  sheep: (
    <>
      <path d={wavyCircle(50, 48, 28, 12, 3.5)} fill={C.white} />
      <ellipse cx="24" cy="54" rx="9" ry="5" fill={C.grayDark} transform="rotate(20 24 54)" />
      <ellipse cx="76" cy="54" rx="9" ry="5" fill={C.grayDark} transform="rotate(-20 76 54)" />
      <ellipse cx="50" cy="58" rx="15" ry="19" fill={C.grayDark} />
      <path d={wavyCircle(50, 38, 9, 6, 2.5)} fill={C.white} />
      <circle cx="44" cy="55" r="3.5" fill={C.white} stroke="none" />
      <circle cx="56" cy="55" r="3.5" fill={C.white} stroke="none" />
      <circle cx="44" cy="55.5" r="2" fill={C.ink} stroke="none" />
      <circle cx="56" cy="55.5" r="2" fill={C.ink} stroke="none" />
      <path d="M45 68 Q50 71 55 68" fill="none" stroke={C.white} strokeWidth="2" />
    </>
  ),
  goat: (
    <>
      <path d="M40 29 Q30 12 45 13 Q40 20 45 27 Z" fill={C.woodDark} />
      <path d="M60 29 Q70 12 55 13 Q60 20 55 27 Z" fill={C.woodDark} />
      <ellipse cx="22" cy="42" rx="12" ry="5" fill={C.white} transform="rotate(15 22 42)" />
      <ellipse cx="78" cy="42" rx="12" ry="5" fill={C.white} transform="rotate(-15 78 42)" />
      <path d="M44 72 Q50 92 56 72 Z" fill={C.white} />
      <path d="M34 28 Q50 22 66 28 Q70 50 60 70 Q50 78 40 70 Q30 50 34 28 Z" fill={C.white} />
      <Face y={44} gap={16} mouth="none" cheeks={false} />
      <circle cx="46" cy="64" r="1.6" fill={C.ink} stroke="none" />
      <circle cx="54" cy="64" r="1.6" fill={C.ink} stroke="none" />
    </>
  ),
  yak: (
    <>
      <path d="M30 34 Q14 30 14 14 Q22 26 34 26 Z" fill={C.cream} />
      <path d="M70 34 Q86 30 86 14 Q78 26 66 26 Z" fill={C.cream} />
      <path d="M28 28 Q50 16 72 28 L78 72 Q66 64 63 78 Q57 68 50 82 Q43 68 37 78 Q34 64 22 72 Z" fill={C.woodDark} />
      <ellipse cx="50" cy="56" rx="14" ry="17" fill={C.wood} />
      <Face y={50} gap={14} mouth="none" cheeks={false} />
      <ellipse cx="50" cy="66" rx="9" ry="5.5" fill={C.woodLight} />
      <circle cx="46.5" cy="66" r="1.5" fill={C.ink} stroke="none" />
      <circle cx="53.5" cy="66" r="1.5" fill={C.ink} stroke="none" />
    </>
  ),
  donkey: (
    <>
      <ellipse cx="34" cy="20" rx="7" ry="17" fill={C.stone} transform="rotate(-20 34 20)" />
      <ellipse cx="66" cy="20" rx="7" ry="17" fill={C.stone} transform="rotate(20 66 20)" />
      <ellipse cx="34" cy="21" rx="3" ry="11" fill={C.grayDark} stroke="none" transform="rotate(-20 34 21)" />
      <ellipse cx="66" cy="21" rx="3" ry="11" fill={C.grayDark} stroke="none" transform="rotate(20 66 21)" />
      <path d="M32 32 Q50 24 68 32 Q72 52 64 66 L36 66 Q28 52 32 32 Z" fill={C.stone} />
      <ellipse cx="50" cy="71" rx="17" ry="13" fill={C.white} />
      <path d="M44 30 Q50 20 56 30" fill={C.grayDark} />
      <Face y={45} gap={20} mouth="none" cheeks={false} />
      <ellipse cx="44" cy="70" rx="2" ry="3" fill={C.ink} stroke="none" />
      <ellipse cx="56" cy="70" rx="2" ry="3" fill={C.ink} stroke="none" />
    </>
  ),
  horse: horseHead(C.wood, C.woodDark),
  zebra: (
    <>
      {horseHead(C.white, C.ink)}
      <path d="M47 76 Q60 70 76 74 M47 84 Q60 80 78 84 M44 64 Q56 56 72 58 M40 52 Q50 46 62 46 M38 42 Q44 38 52 34" fill="none" strokeWidth="4" />
    </>
  ),
  unicorn: (
    <>
      {horseHead(C.white, C.purple)}
      <path d="M58 22 Q66 26 70 34 L62 36 Q60 30 56 28 Z" fill={C.pink} stroke="none" />
      <path d="M40 30 L33 6 L47 26 Z" fill={C.yellow} />
      <path d="M37 17 L42 15 M39 23 L44 21" strokeWidth="2" />
    </>
  ),
  elephant: (
    <>
      <path d="M34 34 Q8 22 10 50 Q12 74 34 64 Z" fill={C.stone} />
      <path d="M66 34 Q92 22 90 50 Q88 74 66 64 Z" fill={C.stone} />
      <path d="M30 40 Q16 36 18 50 Q20 62 30 58 Z" fill={C.pink} stroke="none" />
      <path d="M70 40 Q84 36 82 50 Q80 62 70 58 Z" fill={C.pink} stroke="none" />
      <ellipse cx="50" cy="46" rx="21" ry="23" fill={C.stone} />
      <path d="M43 60 Q41 78 50 87 Q60 90 62 82 Q55 80 55 72 L57 60 Z" fill={C.stone} />
      <Face y={42} gap={16} mouth="none" />
    </>
  ),
  giraffe: (
    <>
      <rect x="47" y="72" width="6" height="18" rx="2" fill={C.yellow} />
      <rect x="57" y="74" width="6" height="16" rx="2" fill={C.yellow} />
      <rect x="69" y="74" width="6" height="16" rx="2" fill={C.yellow} />
      <rect x="77" y="72" width="6" height="18" rx="2" fill={C.yellow} />
      <path d="M40 66 L32 26 L44 23 L54 62 Z" fill={C.yellow} />
      <ellipse cx="64" cy="68" rx="22" ry="11" fill={C.yellow} />
      <path d="M37 13 L36 5 M44 13 L45 6" strokeWidth="3" />
      <circle cx="36" cy="5" r="2.6" fill={C.woodDark} />
      <circle cx="45" cy="5.5" r="2.6" fill={C.woodDark} />
      <ellipse cx="34" cy="20" rx="13" ry="8.5" fill={C.yellow} transform="rotate(-12 34 20)" />
      <path d="M48 16 L56 13 L52 21 Z" fill={C.yellow} />
      {[[38, 36], [44, 48], [40, 56], [56, 64], [68, 63], [76, 70], [62, 72]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" fill={C.woodDark} stroke="none" />
      ))}
      <Eye x={33} y={18} r={2.6} />
      <circle cx="23" cy="22" r="1.3" fill={C.ink} stroke="none" />
    </>
  ),
  hippo: (
    <>
      <circle cx="32" cy="24" r="6" fill={C.lilac} />
      <circle cx="68" cy="24" r="6" fill={C.lilac} />
      <ellipse cx="50" cy="38" rx="21" ry="17" fill={C.lilac} />
      <ellipse cx="50" cy="63" rx="31" ry="21" fill={C.lilac} />
      <Face y={35} gap={18} mouth="none" cheeks={false} />
      <ellipse cx="40" cy="56" rx="3" ry="2.2" fill={C.ink} stroke="none" />
      <ellipse cx="60" cy="56" rx="3" ry="2.2" fill={C.ink} stroke="none" />
      <path d="M33 70 Q50 79 67 70" fill="none" strokeWidth="2.5" />
      <ellipse cx="28" cy="66" rx="4" ry="2.6" fill={C.pink} stroke="none" />
      <ellipse cx="72" cy="66" rx="4" ry="2.6" fill={C.pink} stroke="none" />
    </>
  ),
  squirrel: (
    <>
      <path d="M58 84 Q90 80 86 50 Q84 24 66 21 Q55 22 60 32 Q74 34 72 52 Q70 70 54 76 Z" fill={C.orange} />
      <ellipse cx="47" cy="68" rx="16" ry="18" fill={C.wood} />
      <ellipse cx="42" cy="71" rx="8" ry="12" fill={C.cream} />
      <path d="M42 31 L46 19 L51 33 Z" fill={C.wood} />
      <circle cx="40" cy="43" r="14" fill={C.wood} />
      <Eye x={36} y={40} />
      <circle cx="27" cy="46" r="2.2" fill={C.ink} stroke="none" />
      <ellipse cx="34" cy="62" rx="5" ry="6" fill={C.woodDark} />
      <path d="M30 57 Q34 54 38 57" fill="none" strokeWidth="2" />
    </>
  ),
  kangaroo: (
    <>
      <path d="M64 78 Q84 86 94 76 Q82 76 70 68 Z" fill={C.wood} />
      <path d="M52 84 L76 85 Q79 90 70 90 L50 90 Z" fill={C.wood} />
      <path d="M44 40 Q66 40 70 64 Q72 84 56 86 Q40 86 40 70 Q38 56 44 40 Z" fill={C.wood} />
      <circle cx="52" cy="64" r="5.5" fill={C.wood} />
      <circle cx="51" cy="63" r="1.4" fill={C.ink} stroke="none" />
      <path d="M43 66 Q54 64 63 68 Q61 81 51 81 Q44 79 43 66 Z" fill={C.woodLight} />
      <ellipse cx="44" cy="15" rx="4" ry="10" fill={C.wood} transform="rotate(15 44 15)" />
      <ellipse cx="38" cy="30" rx="13" ry="10" fill={C.wood} />
      <ellipse cx="27" cy="34" rx="8" ry="6" fill={C.wood} />
      <path d="M41 50 Q34 56 31 61" fill="none" strokeWidth="4" />
      <Eye x={38} y={28} />
      <circle cx="21" cy="33" r="2" fill={C.ink} stroke="none" />
    </>
  ),
  llama: (
    <>
      <rect x="42" y="68" width="6" height="22" rx="2" fill={C.cream} />
      <rect x="52" y="70" width="6" height="20" rx="2" fill={C.cream} />
      <rect x="66" y="70" width="6" height="20" rx="2" fill={C.cream} />
      <rect x="74" y="68" width="6" height="22" rx="2" fill={C.cream} />
      <path d="M30 62 L30 28 L44 28 L46 60 Z" fill={C.cream} />
      <ellipse cx="60" cy="63" rx="23" ry="13" fill={C.cream} />
      <path d="M48 52 L70 51 L71 66 L49 67 Z" fill={C.red} />
      <path d="M50 57 L70 56 M50 62 L70 61" stroke={C.yellow} strokeWidth="2.5" />
      <ellipse cx="35" cy="12" rx="3.5" ry="8" fill={C.cream} transform="rotate(-10 35 12)" />
      <ellipse cx="43" cy="13" rx="3.5" ry="8" fill={C.cream} transform="rotate(12 43 13)" />
      <ellipse cx="34" cy="26" rx="13" ry="9" fill={C.cream} />
      <Eye x={36} y={24} r={2.6} />
      <path d="M22 30 Q25 32 28 30" fill="none" strokeWidth="2" />
    </>
  ),
  sloth: (
    <>
      <rect x="6" y="14" width="88" height="9" rx="4.5" fill={C.woodDark} />
      <rect x="29" y="18" width="10" height="32" rx="5" fill={C.wood} />
      <rect x="61" y="18" width="10" height="32" rx="5" fill={C.wood} />
      <ellipse cx="50" cy="62" rx="24" ry="24" fill={C.wood} />
      <ellipse cx="50" cy="57" rx="16" ry="13" fill={C.cream} />
      <ellipse cx="43" cy="55" rx="5.5" ry="3.2" fill={C.woodDark} transform="rotate(-20 43 55)" stroke="none" />
      <ellipse cx="57" cy="55" rx="5.5" ry="3.2" fill={C.woodDark} transform="rotate(20 57 55)" stroke="none" />
      <circle cx="43" cy="55" r="1.6" fill={C.ink} stroke="none" />
      <circle cx="57" cy="55" r="1.6" fill={C.ink} stroke="none" />
      <ellipse cx="50" cy="60" rx="3" ry="2" fill={C.ink} />
      <path d="M46 64 Q50 67 54 64" fill="none" strokeWidth="2.5" />
    </>
  ),
  hedgehog: (
    <>
      <path d="M30 72 L24 54 L36 58 L34 40 L46 50 L50 32 L57 48 L66 34 L67 51 L78 44 L76 58 L88 58 L82 70 Z" fill={C.woodDark} />
      <path d="M20 76 Q22 64 38 62 Q70 62 84 76 Q82 84 52 84 Q24 84 20 76 Z" fill={C.woodLight} />
      <path d="M36 62 Q20 64 12 76 Q22 84 38 80 Z" fill={C.woodLight} />
      <circle cx="12" cy="76" r="3" fill={C.ink} />
      <Eye x={27} y={70} r={2.6} />
    </>
  ),
  seal: (
    <>
      <path d="M30 86 Q20 60 34 38 Q44 22 56 30 Q62 36 60 50 Q66 70 84 80 Q86 88 70 88 Z" fill={C.stone} />
      <path d="M44 68 Q36 80 30 84 L42 86 Q48 80 50 72 Z" fill={C.grayDark} />
      <path d="M80 80 L92 72 L90 86 Z" fill={C.grayDark} />
      <Eye x={47} y={34} />
      <circle cx="58" cy="40" r="2.6" fill={C.ink} stroke="none" />
      <path d="M58 44 L68 42 M58 46 L68 48" strokeWidth="2" />
    </>
  ),
};
