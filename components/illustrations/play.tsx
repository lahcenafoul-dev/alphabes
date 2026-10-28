// Toys, games, sport, music, parties and clothes.
import { C, Face, starPath, Tube, type Drawing } from "./parts";

const pip = (x: number, y: number) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill={C.ink} stroke="none" />;

export const play: Record<string, Drawing> = {
  // ----- toys and games -----
  ball: (
    <>
      <circle cx="50" cy="52" r="34" fill={C.white} />
      <path d="M41.2 19.2 L50.0 27.0 L58.8 19.2 Z M78.5 33.5 L73.8 44.3 L84.0 50.2 Z M76.4 73.4 L64.7 72.2 L62.2 83.7 Z M37.8 83.7 L35.3 72.2 L23.6 73.4 Z M16.0 50.2 L26.2 44.3 L21.5 33.5 Z" fill={C.ink} strokeWidth="2" />
      <path d="M50.0 40.0 L50.0 27.0 M61.4 48.3 L73.8 44.3 M57.1 61.7 L64.7 72.2 M42.9 61.7 L35.3 72.2 M38.6 48.3 L26.2 44.3" strokeWidth="2.5" />
      <path d="M50.0 40.0 L61.4 48.3 L57.1 61.7 L42.9 61.7 L38.6 48.3 Z" fill={C.ink} />
      <circle cx="50" cy="52" r="34" fill="none" />
    </>
  ),
  balloon: (
    <>
      <path d="M50 70 Q44 80 52 86 Q58 92 50 96" fill="none" strokeWidth="2" />
      <path d="M50 8 Q20 8 20 38 Q20 62 50 70 Q80 62 80 38 Q80 8 50 8 Z" fill={C.red} />
      <path d="M46 70 L54 70 L50 76 Z" fill={C.red} strokeWidth="2" />
      <path d="M34 24 Q30 32 32 40" fill="none" stroke={C.white} strokeWidth="4" opacity="0.8" />
    </>
  ),
  kite: (
    <>
      <path d="M50 76 Q40 84 50 88 Q60 92 52 96" fill="none" strokeWidth="2" />
      <path d="M48 84 L44 80 L44 88 Z M54 90 L58 86 L58 94 Z" fill={C.yellow} strokeWidth="1.5" />
      <path d="M50 8 L80 38 L50 76 L20 38 Z" fill={C.red} />
      <path d="M50 8 L50 76 M20 38 L80 38" strokeWidth="2.5" />
      <path d="M50 8 L80 38 L50 38 Z M20 38 L50 38 L50 76 Z" fill={C.blue} />
    </>
  ),
  "yo-yo": (
    <>
      <path d="M50 8 L50 36" strokeWidth="2.5" />
      <circle cx="50" cy="60" r="28" fill={C.red} />
      <circle cx="50" cy="60" r="18" fill={C.white} opacity="0.5" />
      <circle cx="50" cy="60" r="6" fill={C.yellow} />
      <path d={starPath(50, 60, 4)} fill={C.yellow} stroke="none" />
    </>
  ),
  dice: (
    <>
      <rect x="18" y="18" width="64" height="64" rx="14" fill={C.white} />
      {[pip(34, 34), pip(66, 34), pip(50, 50), pip(34, 66), pip(66, 66)]}
    </>
  ),
  doll: (
    <>
      <path d="M50 54 Q34 54 30 70 Q28 88 50 88 Q72 88 70 70 Q66 54 50 54 Z" fill={C.red} />
      <path d="M38 72 Q50 66 62 72" fill="none" stroke={C.yellow} strokeWidth="3" />
      <circle cx="50" cy="40" r="22" fill={C.red} />
      <circle cx="50" cy="42" r="15" fill={C.skin} />
      <Face y={41} gap={10} r={2.2} />
      <path d="M36 32 Q50 24 64 32" fill="none" stroke={C.woodDark} strokeWidth="4" />
    </>
  ),
  robot: (
    <>
      <path d="M50 18 L50 8" strokeWidth="3" />
      <circle cx="50" cy="8" r="4" fill={C.red} />
      <rect x="26" y="18" width="48" height="36" rx="8" fill={C.gray} />
      <rect x="20" y="30" width="6" height="12" rx="2" fill={C.grayDark} />
      <rect x="74" y="30" width="6" height="12" rx="2" fill={C.grayDark} />
      <circle cx="40" cy="34" r="6" fill={C.sky} />
      <circle cx="60" cy="34" r="6" fill={C.sky} />
      <circle cx="40" cy="34" r="2.5" fill={C.ink} stroke="none" />
      <circle cx="60" cy="34" r="2.5" fill={C.ink} stroke="none" />
      <rect x="40" y="44" width="20" height="5" rx="2" fill={C.white} strokeWidth="2" />
      <rect x="30" y="58" width="40" height="28" rx="6" fill={C.blue} />
      <circle cx="44" cy="70" r="3" fill={C.yellow} />
      <circle cx="56" cy="70" r="3" fill={C.red} />
      <path d="M30 64 L16 74 M70 64 L84 74" strokeWidth="5" />
    </>
  ),
  "chess-pawn": (
    <>
      <circle cx="50" cy="24" r="12" fill={C.ink} />
      <path d="M40 38 L60 38 L56 46 Q66 60 68 74 L32 74 Q34 60 44 46 Z" fill={C.ink} />
      <rect x="22" y="74" width="56" height="12" rx="4" fill={C.ink} />
      <path d="M44 18 Q46 14 50 14" fill="none" stroke={C.white} strokeWidth="2.5" />
    </>
  ),
  bowling: (
    <>
      <path d="M40 10 Q30 10 32 26 Q34 36 30 50 Q22 72 32 88 L48 88 Q58 72 50 50 Q46 36 48 26 Q50 10 40 10 Z" fill={C.white} />
      <path d="M33 30 L47 30 M32 36 L48 36" stroke={C.red} strokeWidth="3.5" />
      <circle cx="70" cy="70" r="18" fill={C.blue} />
      <circle cx="66" cy="62" r="2.6" fill={C.ink} stroke="none" />
      <circle cx="74" cy="62" r="2.6" fill={C.ink} stroke="none" />
      <circle cx="70" cy="70" r="2.6" fill={C.ink} stroke="none" />
    </>
  ),
  "tennis-racket": (
    <>
      <path d="M40 58 L18 86" strokeWidth="11" />
      <path d="M40 58 L18 86" stroke={C.red} strokeWidth="6" />
      <ellipse cx="56" cy="36" rx="22" ry="26" transform="rotate(38 56 36)" fill={C.white} strokeWidth="6" />
      <path d="M42 30 L64 52 M48 22 L72 44 M38 42 L56 58 M58 16 L76 34 M46 52 L70 22 M38 42 L62 14 M58 58 L78 34" stroke={C.gray} strokeWidth="2" />
      <ellipse cx="56" cy="36" rx="22" ry="26" transform="rotate(38 56 36)" fill="none" strokeWidth="5" />
      <circle cx="82" cy="78" r="9" fill={C.yellow} />
      <path d="M74 74 Q82 80 90 74" fill="none" stroke={C.white} strokeWidth="2.5" />
    </>
  ),
  "boxing-glove": (
    <>
      <path d="M30 70 L30 40 Q30 14 56 14 Q82 14 82 42 Q82 70 62 70 Z" fill={C.red} />
      <path d="M30 52 Q18 50 18 40 Q20 30 32 32" fill={C.red} />
      <rect x="28" y="68" width="40" height="20" rx="4" fill={C.white} />
      <path d="M40 26 Q46 22 52 24" fill="none" stroke={C.white} strokeWidth="4" opacity="0.8" />
    </>
  ),
  "goal-net": (
    <>
      <path d="M12 84 L12 22 L88 22 L88 84" fill="none" strokeWidth="6" />
      <path d="M12 22 L88 22 L88 84 L12 84 Z" fill={C.white} opacity="0.5" stroke="none" />
      {[24, 36, 48, 60, 72].map((x) => (
        <path key={x} d={`M${x + 4} 22 L${x + 4} 84`} stroke={C.gray} strokeWidth="2" />
      ))}
      {[34, 46, 58, 70].map((y) => (
        <path key={y} d={`M12 ${y} L88 ${y}`} stroke={C.gray} strokeWidth="2" />
      ))}
      <path d="M12 84 L12 22 L88 22 L88 84" fill="none" strokeWidth="5" />
      <circle cx="56" cy="70" r="12" fill={C.white} />
      <path d="M52 64 L60 64 L62 72 L56 76 L50 72 Z" fill={C.ink} strokeWidth="1.5" />
    </>
  ),
  judo: (
    <>
      <path d="M30 26 L44 20 L50 32 L56 20 L70 26 L82 50 L70 56 L68 46 L68 88 L32 88 L32 46 L30 56 L18 50 Z" fill={C.white} />
      <path d="M44 20 L50 46 L56 20" fill="none" strokeWidth="2.5" />
      <rect x="31" y="54" width="38" height="8" fill={C.ink} />
      <path d="M44 62 L40 78 M56 62 L60 78" strokeWidth="5" />
    </>
  ),
  yoga: (
    <>
      <path d="M10 86 L90 86" stroke={C.purple} strokeWidth="6" />
      <path d="M50 46 Q30 52 24 76 L76 76 Q70 52 50 46 Z" fill={C.green} />
      <path d="M20 80 Q50 66 80 80 Q76 86 50 86 Q24 86 20 80 Z" fill={C.blue} />
      <Tube d="M40 54 Q26 58 24 68 M60 54 Q74 58 76 68" fill={C.skin} width={4} />
      <circle cx="50" cy="32" r="13" fill={C.skin} />
      <path d="M37 30 Q38 16 50 16 Q62 16 63 30 Q56 24 50 24 Q44 24 37 30 Z" fill={C.woodDark} />
      <path d="M44 34 Q46 36 48 34 M52 34 Q54 36 56 34" fill="none" strokeWidth="2" />
    </>
  ),
  // ----- music -----
  guitar: (
    <>
      <path d="M58 40 L80 10 L88 16 L66 46 Z" fill={C.woodDark} />
      <path d="M78 6 L92 16" strokeWidth="6" />
      <path d="M36 32 Q22 26 16 40 Q12 50 20 56 Q10 66 18 80 Q30 94 46 84 Q56 78 56 66 Q68 60 62 46 Q58 36 46 40 Q42 34 36 32 Z" fill={C.orange} />
      <circle cx="40" cy="58" r="8" fill={C.ink} />
      <path d="M30 70 L40 76" strokeWidth="4" />
      <path d="M40 58 L84 12" strokeWidth="1.5" />
    </>
  ),
  violin: (
    <>
      <path d="M58 34 L80 10" strokeWidth="7" />
      <path d="M78 6 Q90 6 86 18" fill={C.woodDark} strokeWidth="3" />
      <path d="M44 28 Q30 18 24 32 Q20 42 28 48 Q18 58 26 72 Q36 86 50 78 Q60 72 58 62 Q70 58 66 46 Q62 34 52 38 Q50 30 44 28 Z" fill={C.woodDark} />
      <path d="M36 50 Q38 56 34 60 M48 46 Q46 52 50 56" fill="none" strokeWidth="2.5" />
      <path d="M30 72 L44 58 L80 12" strokeWidth="1.5" />
      <path d="M10 88 L90 24" strokeWidth="3" stroke={C.wood} />
    </>
  ),
  piano: (
    <>
      <rect x="8" y="26" width="84" height="56" rx="6" fill={C.white} />
      {[20, 32, 44, 56, 68, 80].map((x) => (
        <path key={x} d={`M${x} 26 L${x} 82`} strokeWidth="2" />
      ))}
      {[16, 28, 52, 64, 76].map((x) => (
        <rect key={x} x={x} y="26" width="8" height="32" rx="1.5" fill={C.ink} />
      ))}
      <rect x="8" y="18" width="84" height="10" rx="4" fill={C.red} />
    </>
  ),
  drum: (
    <>
      <path d="M24 10 L44 34 M76 10 L56 34" strokeWidth="5" stroke={C.woodDark} />
      <circle cx="24" cy="10" r="4" fill={C.wood} />
      <circle cx="76" cy="10" r="4" fill={C.wood} />
      <path d="M14 44 L14 76 Q14 88 50 88 Q86 88 86 76 L86 44 Z" fill={C.red} />
      <path d="M14 48 L32 84 L50 48 L68 84 L86 48" fill="none" stroke={C.yellow} strokeWidth="3" />
      <ellipse cx="50" cy="44" rx="36" ry="10" fill={C.white} />
    </>
  ),
  trumpet: (
    <>
      <path d="M8 46 L20 46 L20 56 L8 56 Z" fill={C.yellow} />
      <path d="M20 48 L60 48 L84 28 L84 76 L60 54 L20 54 Z" fill={C.yellow} />
      <path d="M32 54 Q32 70 46 70 Q56 70 56 54" fill="none" strokeWidth="4" />
      <path d="M36 40 L36 48 M44 40 L44 48 M52 40 L52 48" strokeWidth="4" />
      <ellipse cx="84" cy="52" rx="6" ry="24" fill={C.orange} />
    </>
  ),
  flute: (
    <>
      <path d="M10 76 L86 22" strokeWidth="13" />
      <path d="M10 76 L86 22" stroke={C.gray} strokeWidth="8" />
      {[[30, 62], [42, 53.5], [54, 45], [66, 36.5]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.5" fill={C.ink} stroke="none" />
      ))}
      <path d="M72 40 Q80 50 74 60 M80 46 Q90 56 82 68" fill="none" stroke={C.blue} strokeWidth="2.5" />
    </>
  ),
  saxophone: (
    <>
      <path d="M40 10 L56 16" strokeWidth="5" />
      <path d="M54 14 Q66 20 62 40 L58 70 Q56 86 40 86 Q24 86 24 74 Q24 66 32 64 L26 56 Q36 54 40 64 Q46 70 48 58 L52 24 Z" fill={C.yellow} />
      <path d="M58 32 L64 32 M57 42 L63 42 M56 52 L62 52" strokeWidth="3" />
      <ellipse cx="30" cy="60" rx="8" ry="4" transform="rotate(-30 30 60)" fill={C.orange} />
    </>
  ),
  banjo: (
    <>
      <path d="M50 54 L82 12" strokeWidth="9" />
      <path d="M50 54 L82 12" stroke={C.woodDark} strokeWidth="5" />
      <rect x="76" y="4" width="14" height="10" rx="3" fill={C.woodDark} transform="rotate(36 83 9)" />
      <circle cx="38" cy="66" r="26" fill={C.wood} />
      <circle cx="38" cy="66" r="20" fill={C.cream} />
      <path d="M30 76 L82 12" strokeWidth="1.5" />
      <rect x="26" y="74" width="12" height="4" rx="1" fill={C.woodDark} transform="rotate(-50 32 76)" />
    </>
  ),
  "music-note": (
    <>
      <path d="M38 72 L38 22 L80 12 L80 62" fill="none" strokeWidth="6" />
      <path d="M38 22 L80 12 L80 24 L38 34 Z" fill={C.ink} />
      <ellipse cx="28" cy="74" rx="12" ry="9" fill={C.purple} />
      <ellipse cx="70" cy="64" rx="12" ry="9" fill={C.purple} />
    </>
  ),
  "music-score": (
    <>
      <rect x="10" y="16" width="80" height="70" rx="6" fill={C.white} />
      {[32, 40, 48, 56, 64].map((y) => (
        <path key={y} d={`M18 ${y} L82 ${y}`} stroke={C.gray} strokeWidth="2" />
      ))}
      <path d="M40 60 L40 28 M64 52 L64 24" strokeWidth="3" />
      <ellipse cx="35" cy="60" rx="6" ry="4.5" fill={C.ink} stroke="none" />
      <ellipse cx="59" cy="52" rx="6" ry="4.5" fill={C.ink} stroke="none" />
      <path d="M40 28 L64 24" strokeWidth="5" />
    </>
  ),
  xylophone: (
    <>
      <path d="M14 34 L86 46 M14 74 L86 62" strokeWidth="4" stroke={C.woodDark} />
      {[C.red, C.orange, C.yellow, C.green, C.blue, C.purple].map((fill, i) => (
        <rect key={fill} x={18 + i * 11} y={26 + i * 2} width="9" height={52 - i * 4} rx="3" fill={fill} />
      ))}
      <path d="M70 18 L88 6 M80 22 L94 14" strokeWidth="3" />
      <circle cx="88" cy="6" r="4" fill={C.red} />
      <circle cx="94" cy="14" r="4" fill={C.red} />
    </>
  ),
  ukulele: (
    <>
      <path d="M58 40 L80 14 L86 20 L64 46 Z" fill={C.woodDark} />
      <rect x="78" y="4" width="14" height="14" rx="3" fill={C.woodDark} transform="rotate(40 85 11)" />
      <path d="M38 34 Q26 28 20 40 Q16 48 22 54 Q14 62 20 74 Q30 88 44 80 Q54 74 52 64 Q64 58 58 46 Q54 36 44 40 Q42 36 38 34 Z" fill={C.yellow} />
      <circle cx="40" cy="58" r="6" fill={C.ink} />
      <path d="M30 70 L40 76" strokeWidth="4" />
      <path d="M40 58 L84 12" strokeWidth="1.5" />
    </>
  ),
  microphone: (
    <>
      <path d="M50 64 L50 82 M36 86 L64 86" strokeWidth="5" />
      <path d="M28 44 Q28 66 50 66 Q72 66 72 44" fill="none" strokeWidth="4" />
      <rect x="36" y="12" width="28" height="44" rx="14" fill={C.grayDark} />
      <path d="M36 28 L64 28 M36 36 L64 36" stroke={C.gray} strokeWidth="2.5" />
    </>
  ),
  // ----- parties -----
  gift: (
    <>
      <path d="M50 30 Q36 10 28 18 Q22 26 50 30 Q64 10 72 18 Q78 26 50 30 Z" fill={C.yellow} />
      <rect x="16" y="30" width="68" height="16" rx="3" fill={C.red} />
      <rect x="22" y="46" width="56" height="40" rx="3" fill={C.red} />
      <path d="M50 30 L50 86" stroke={C.yellow} strokeWidth="9" />
      <path d="M45.5 30 L45.5 86 M54.5 30 L54.5 86" strokeWidth="2" />
    </>
  ),
  "party-popper": (
    <>
      <path d="M14 88 L32 36 L66 70 Z" fill={C.purple} />
      <path d="M22 66 L40 78 M28 50 L52 70" stroke={C.yellow} strokeWidth="4" />
      <path d="M44 30 Q48 14 60 12 M58 40 Q72 30 88 34 M66 56 Q78 52 86 58" fill="none" stroke={C.red} strokeWidth="3" />
      <circle cx="70" cy="18" r="4" fill={C.blue} />
      <circle cx="84" cy="46" r="4" fill={C.yellow} />
      <path d="M40 18 L46 22 L44 12 Z" fill={C.green} strokeWidth="2" />
      <path d={starPath(78, 76, 6)} fill={C.yellow} strokeWidth="2" />
    </>
  ),
  bow: (
    <>
      <path d="M50 46 Q26 18 12 30 Q4 46 20 58 Q34 64 50 50 Z" fill={C.pink} />
      <path d="M50 46 Q74 18 88 30 Q96 46 80 58 Q66 64 50 50 Z" fill={C.pink} />
      <path d="M44 54 L30 86 L40 82 L46 90 L50 56 Z M56 54 L70 86 L60 82 L54 90 L50 56 Z" fill={C.pink} />
      <rect x="42" y="38" width="16" height="18" rx="6" fill={C.red} />
    </>
  ),
  // ----- clothes -----
  hat: (
    <>
      <rect x="28" y="16" width="44" height="50" rx="6" fill={C.ink} />
      <rect x="28" y="52" width="44" height="10" fill={C.red} />
      <ellipse cx="50" cy="70" rx="40" ry="10" fill={C.ink} />
    </>
  ),
  cap: (
    <>
      <path d="M18 64 Q18 22 54 22 Q86 22 86 58 Z" fill={C.blue} />
      <path d="M18 64 L86 58 Q90 68 70 70 L6 72 Q4 66 18 64 Z" fill={C.navy} />
      <path d="M54 22 L50 62" strokeWidth="2.5" />
      <circle cx="54" cy="22" r="4" fill={C.navy} />
    </>
  ),
  shirt: (
    <>
      <path d="M36 14 L50 22 L64 14 L88 28 L80 46 L70 42 L70 88 L30 88 L30 42 L20 46 L12 28 Z" fill={C.blue} />
      <path d="M36 14 L50 30 L64 14" fill={C.white} />
      <path d="M50 30 L50 88" strokeWidth="2.5" />
      <circle cx="50" cy="46" r="2" fill={C.ink} stroke="none" />
      <circle cx="50" cy="60" r="2" fill={C.ink} stroke="none" />
      <circle cx="50" cy="74" r="2" fill={C.ink} stroke="none" />
    </>
  ),
  blouse: (
    <>
      <path d="M36 14 Q50 26 64 14 L88 30 L80 48 L70 42 L72 88 L28 88 L30 42 L20 48 L12 30 Z" fill={C.pink} />
      <path d="M36 14 Q50 26 64 14" fill="none" />
      {[[40, 50], [60, 50], [50, 66], [38, 78], [62, 78]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill={C.white} stroke="none" />
      ))}
    </>
  ),
  dress: (
    <>
      <path d="M38 12 L44 12 L46 22 L54 22 L56 12 L62 12 L64 38 L84 86 L16 86 L36 38 Z" fill={C.red} />
      <path d="M36 38 L64 38" strokeWidth="5" stroke={C.yellow} />
      <path d="M24 76 L76 76" stroke={C.white} strokeWidth="3" />
    </>
  ),
  trousers: (
    <>
      <path d="M26 12 L74 12 L80 88 L58 88 L50 38 L42 88 L20 88 Z" fill={C.navy} />
      <path d="M26 12 L74 12 L74 20 L26 20 Z" fill={C.blue} />
      <path d="M50 20 L50 38" strokeWidth="2.5" />
    </>
  ),
  jacket: (
    <>
      <path d="M34 12 L50 20 L66 12 L88 26 L84 80 L72 80 L70 88 L30 88 L28 80 L16 80 L12 26 Z" fill={C.green} />
      <path d="M34 12 L50 46 L66 12" fill={C.leaf} />
      <path d="M50 46 L50 88" strokeWidth="3" />
      <rect x="32" y="60" width="12" height="8" rx="2" fill={C.leaf} />
      <rect x="56" y="60" width="12" height="8" rx="2" fill={C.leaf} />
    </>
  ),
  sock: (
    <>
      <path d="M36 10 L66 10 L66 54 Q66 60 72 64 L84 72 Q92 82 82 88 Q76 92 66 86 L42 70 Q34 64 36 54 Z" fill={C.red} />
      <rect x="34" y="10" width="34" height="14" rx="3" fill={C.white} />
      <path d="M36 36 L66 36 M36 46 L66 46" stroke={C.white} strokeWidth="4" />
    </>
  ),
  shoe: (
    <>
      <path d="M12 72 L14 50 Q30 50 44 40 L58 40 Q62 56 78 60 Q90 62 90 74 L90 80 L12 80 Z" fill={C.woodDark} />
      <path d="M12 74 L90 74" strokeWidth="2.5" />
      <path d="M40 46 L50 52 M46 42 L56 48" stroke={C.woodLight} strokeWidth="2.5" />
    </>
  ),
  sneaker: (
    <>
      <path d="M10 70 L14 42 Q28 44 40 34 L56 34 Q60 52 78 56 Q92 60 92 72 L92 76 L10 76 Z" fill={C.blue} />
      <path d="M10 70 L92 70 L92 80 Q92 84 88 84 L14 84 Q10 84 10 80 Z" fill={C.white} />
      <path d="M38 42 L48 48 M44 38 L54 44" stroke={C.white} strokeWidth="3" />
      <path d="M62 56 L80 62" stroke={C.yellow} strokeWidth="4" />
    </>
  ),
  "flip-flop": (
    <>
      <path d="M50 10 Q30 10 28 40 Q26 70 34 84 Q42 92 54 90 Q68 86 70 62 Q72 30 62 14 Q58 10 50 10 Z" fill={C.blue} />
      <path d="M50 18 Q40 20 36 42 Q34 66 40 80 Q46 86 54 84 Q64 80 64 60 Q66 34 58 22 Z" fill={C.sky} stroke="none" />
      <path d="M34 50 Q42 30 50 24 Q58 30 66 50" fill="none" stroke={C.yellow} strokeWidth="5" />
      <path d="M34 50 Q42 30 50 24 Q58 30 66 50" fill="none" strokeWidth="1.5" />
      <circle cx="50" cy="24" r="3.5" fill={C.yellow} />
    </>
  ),
  boot: (
    <>
      <path d="M26 10 L58 10 L58 54 Q74 56 84 66 Q90 74 88 84 L26 84 Z" fill={C.wood} />
      <rect x="22" y="80" width="68" height="8" rx="3" fill={C.woodDark} />
      <path d="M26 22 L58 22" strokeWidth="2.5" />
      <path d="M38 34 L46 34 M38 44 L46 44" strokeWidth="3" stroke={C.woodDark} />
    </>
  ),
};
