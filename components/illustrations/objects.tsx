// Things at home, at school and in the toolbox.
import { C, Rays, starPath, type Drawing } from "./parts";

export const objects: Record<string, Drawing> = {
  // ----- home -----
  bathtub: (
    <>
      <path d="M20 46 L20 24 Q20 14 30 14 Q38 14 38 22" fill="none" strokeWidth="4" />
      <circle cx="56" cy="34" r="6" fill={C.white} strokeWidth="2" />
      <circle cx="68" cy="28" r="8" fill={C.white} strokeWidth="2" />
      <circle cx="44" cy="38" r="5" fill={C.white} strokeWidth="2" />
      <path d="M8 46 L92 46 L86 70 Q82 78 70 78 L30 78 Q18 78 14 70 Z" fill={C.white} />
      <path d="M8 46 L92 46" stroke={C.blue} strokeWidth="5" />
      <path d="M26 78 L22 88 M74 78 L78 88" strokeWidth="4" />
    </>
  ),
  shower: (
    <>
      <path d="M20 90 L20 22 Q20 12 32 12 L56 12 L56 24" fill="none" strokeWidth="5" />
      <path d="M40 34 Q40 22 56 22 Q72 22 72 34 Z" fill={C.gray} />
      <path d="M46 42 L42 54 M56 42 L56 56 M66 42 L70 54 M50 62 L48 72 M62 62 L64 72" stroke={C.blue} strokeWidth="3.5" />
    </>
  ),
  soap: (
    <>
      <circle cx="70" cy="24" r="8" fill={C.sky} strokeWidth="2" />
      <circle cx="82" cy="40" r="5" fill={C.sky} strokeWidth="2" />
      <circle cx="56" cy="16" r="4" fill={C.sky} strokeWidth="2" />
      <rect x="16" y="42" width="64" height="38" rx="14" fill={C.pink} />
      <path d="M30 52 Q36 48 42 52" fill="none" stroke={C.white} strokeWidth="4" />
    </>
  ),
  shampoo: (
    <>
      <path d="M44 22 L44 12 L64 12 L64 18" fill="none" strokeWidth="4" />
      <rect x="40" y="20" width="20" height="10" rx="2" fill={C.purple} />
      <path d="M30 34 Q30 28 36 28 L64 28 Q70 28 70 34 L72 82 Q72 88 66 88 L34 88 Q28 88 28 82 Z" fill={C.lilac} />
      <rect x="36" y="46" width="28" height="24" rx="4" fill={C.white} />
      <circle cx="50" cy="58" r="6" fill={C.sky} />
    </>
  ),
  toothbrush: (
    <>
      <path d="M14 84 L62 36" strokeWidth="12" />
      <path d="M14 84 L62 36" stroke={C.blue} strokeWidth="6" />
      <path d="M58 36 L76 18 L86 28 L68 46 Z" fill={C.white} />
      <path d="M64 30 L56 22 M70 24 L62 16 M76 18 L68 10" stroke={C.sky} strokeWidth="4" />
    </>
  ),
  broom: (
    <>
      <path d="M74 10 L50 52" strokeWidth="9" />
      <path d="M74 10 L50 52" stroke={C.wood} strokeWidth="4" />
      <path d="M44 48 L60 56 L50 90 L18 74 Z" fill={C.yellow} />
      <path d="M44 52 L58 60" stroke={C.red} strokeWidth="4" />
      <path d="M40 66 L28 80 M48 68 L38 86 M54 68 L46 88" strokeWidth="2" />
    </>
  ),
  bucket: (
    <>
      <path d="M22 36 Q50 4 78 36" fill="none" strokeWidth="4" />
      <path d="M18 36 L82 36 L74 88 L26 88 Z" fill={C.blue} />
      <ellipse cx="50" cy="36" rx="32" ry="6" fill={C.sky} />
      <path d="M22 52 L78 52" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  basket: (
    <>
      <path d="M24 46 Q24 12 50 12 Q76 12 76 46" fill="none" strokeWidth="6" />
      <path d="M24 46 Q24 12 50 12 Q76 12 76 46" fill="none" stroke={C.wood} strokeWidth="2" />
      <path d="M12 44 L88 44 L80 86 L20 86 Z" fill={C.wood} />
      <path d="M14 56 L86 56 M16 70 L84 70 M32 44 L36 86 M50 44 L50 86 M68 44 L64 86" stroke={C.woodDark} strokeWidth="2.5" />
      <path d="M12 44 L88 44 L80 86 L20 86 Z" fill="none" />
    </>
  ),
  bowl: (
    <>
      <path d="M10 46 L90 46 Q88 84 50 86 Q12 84 10 46 Z" fill={C.blue} />
      <ellipse cx="50" cy="46" rx="40" ry="8" fill={C.sky} />
      <path d="M24 60 Q50 68 76 60" fill="none" stroke={C.white} strokeWidth="3" opacity="0.6" />
    </>
  ),
  cup: (
    <>
      <path d="M38 28 Q34 20 40 14 M50 28 Q46 20 52 14" fill="none" stroke={C.grayDark} strokeWidth="2.5" />
      <path d="M72 46 Q90 46 88 60 Q86 72 68 70" fill="none" strokeWidth="5" />
      <path d="M20 36 L76 36 L72 76 Q70 86 58 86 L38 86 Q26 86 24 76 Z" fill={C.red} />
      <ellipse cx="48" cy="36" rx="28" ry="6" fill={C.woodDark} />
      <path d="M36 56 Q48 50 60 56" fill="none" stroke={C.white} strokeWidth="3" />
    </>
  ),
  plate: (
    <>
      <path d="M8 44 L8 84 M4 44 L4 56 Q4 62 8 62 Q12 62 12 56 L12 44" fill="none" strokeWidth="3" />
      <path d="M92 44 L92 84 M92 44 Q86 52 92 64" fill="none" strokeWidth="3" />
      <circle cx="50" cy="56" r="32" fill={C.white} />
      <circle cx="50" cy="56" r="22" fill={C.sky} opacity="0.5" />
    </>
  ),
  spoon: (
    <>
      <path d="M50 46 L50 90" strokeWidth="9" />
      <path d="M50 46 L50 90" stroke={C.gray} strokeWidth="4" />
      <ellipse cx="50" cy="30" rx="16" ry="20" fill={C.gray} />
      <path d="M42 22 Q40 30 44 36" fill="none" stroke={C.white} strokeWidth="3" />
    </>
  ),
  bottle: (
    <>
      <rect x="40" y="8" width="20" height="10" rx="2" fill={C.red} />
      <path d="M42 18 L58 18 L58 30 Q74 38 74 54 L74 82 Q74 90 66 90 L34 90 Q26 90 26 82 L26 54 Q26 38 42 30 Z" fill={C.green} />
      <rect x="32" y="54" width="36" height="20" rx="4" fill={C.cream} />
    </>
  ),
  jar: (
    <>
      <rect x="28" y="14" width="44" height="12" rx="3" fill={C.red} />
      <path d="M30 26 L70 26 Q80 34 80 50 L80 80 Q80 88 72 88 L28 88 Q20 88 20 80 L20 50 Q20 34 30 26 Z" fill={C.sky} />
      <path d="M28 46 L28 74" stroke={C.white} strokeWidth="4" />
    </>
  ),
  vase: (
    <>
      <path d="M38 14 L62 14 L58 26 Q82 40 76 66 Q70 88 50 88 Q30 88 24 66 Q18 40 42 26 Z" fill={C.blue} />
      <path d="M28 56 Q50 64 72 56" fill="none" stroke={C.yellow} strokeWidth="4" />
      <path d="M38 14 L62 14" />
    </>
  ),
  box: (
    <>
      <path d="M14 34 L50 20 L86 34 L50 48 Z" fill={C.woodLight} />
      <path d="M14 34 L50 48 L50 88 L14 74 Z" fill={C.wood} />
      <path d="M86 34 L50 48 L50 88 L86 74 Z" fill={C.woodDark} />
      <path d="M32 27 L68 41 L68 54" fill="none" stroke={C.cream} strokeWidth="4" />
    </>
  ),
  chair: (
    <>
      <rect x="26" y="12" width="48" height="40" rx="8" fill={C.wood} />
      <path d="M30 52 L26 90 M70 52 L74 90 M34 66 L32 90 M66 66 L68 90" strokeWidth="5" />
      <rect x="20" y="52" width="60" height="12" rx="4" fill={C.woodDark} />
    </>
  ),
  sofa: (
    <>
      <rect x="18" y="26" width="64" height="34" rx="10" fill={C.purple} />
      <rect x="8" y="44" width="20" height="36" rx="8" fill={C.purple} />
      <rect x="72" y="44" width="20" height="36" rx="8" fill={C.purple} />
      <rect x="24" y="56" width="52" height="24" rx="5" fill={C.lilac} />
      <path d="M50 56 L50 80" strokeWidth="2.5" />
      <path d="M16 80 L16 88 M84 80 L84 88" strokeWidth="4" />
    </>
  ),
  bed: (
    <>
      <path d="M10 30 L10 86 M90 54 L90 86" strokeWidth="6" stroke={C.woodDark} />
      <rect x="10" y="54" width="80" height="20" rx="4" fill={C.wood} />
      <rect x="16" y="42" width="22" height="14" rx="6" fill={C.white} />
      <path d="M36 54 Q36 44 46 44 L88 44 Q90 44 90 54 Z" fill={C.blue} />
      <path d="M50 44 L50 54 M66 44 L66 54" stroke={C.sky} strokeWidth="3" />
    </>
  ),
  door: (
    <>
      <rect x="24" y="10" width="52" height="80" rx="4" fill={C.wood} />
      <rect x="32" y="18" width="36" height="28" rx="3" fill={C.woodLight} />
      <rect x="32" y="52" width="36" height="30" rx="3" fill={C.woodLight} />
      <circle cx="64" cy="50" r="3.5" fill={C.yellow} />
    </>
  ),
  window: (
    <>
      <rect x="16" y="14" width="68" height="68" rx="6" fill={C.sky} />
      <path d="M50 14 L50 82 M16 48 L84 48" strokeWidth="5" />
      <path d="M24 24 L30 30 M58 24 L64 30" stroke={C.white} strokeWidth="4" />
      <rect x="10" y="80" width="80" height="8" rx="3" fill={C.white} />
    </>
  ),
  candle: (
    <>
      <path d="M50 10 Q40 22 44 30 Q50 36 56 30 Q60 22 50 10 Z" fill={C.orange} />
      <path d="M50 22 Q46 28 50 32 Q54 28 50 22 Z" fill={C.yellow} stroke="none" />
      <path d="M50 32 L50 38" strokeWidth="2.5" />
      <rect x="38" y="38" width="24" height="44" rx="4" fill={C.pink} />
      <path d="M38 46 Q44 52 48 46" fill={C.white} strokeWidth="2" />
      <ellipse cx="50" cy="84" rx="26" ry="6" fill={C.yellow} />
    </>
  ),
  "light-bulb": (
    <>
      <Rays cx={50} cy={40} from={30} to={38} count={8} />
      <path d="M38 62 Q24 52 26 36 Q30 16 50 16 Q70 16 74 36 Q76 52 62 62 Z" fill={C.yellow} />
      <path d="M44 56 L44 44 L50 50 L56 44 L56 56" fill="none" strokeWidth="2.5" stroke={C.orange} />
      <rect x="38" y="62" width="24" height="16" rx="3" fill={C.gray} />
      <path d="M38 68 L62 68 M38 73 L62 73" strokeWidth="2" />
      <path d="M44 78 L56 78 L52 86 L48 86 Z" fill={C.grayDark} />
    </>
  ),
  lamp: (
    <>
      <path d="M50 54 L50 80" strokeWidth="5" />
      <ellipse cx="50" cy="84" rx="20" ry="6" fill={C.woodDark} />
      <path d="M30 20 L70 20 L84 56 L16 56 Z" fill={C.yellow} />
      <path d="M24 40 L76 40" stroke={C.orange} strokeWidth="3" />
      <path d="M60 56 L60 70" strokeWidth="2.5" />
      <circle cx="60" cy="72" r="2.5" fill={C.ink} />
    </>
  ),
  quilt: (
    <>
      <rect x="12" y="20" width="76" height="64" rx="6" fill={C.white} />
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`${c}-${r}`} x={12 + c * 19} y={20 + r * 21.3} width="19" height="21.3" fill={[C.red, C.yellow, C.blue, C.green, C.pink, C.purple][(c + r * 2) % 6]} strokeWidth="2" strokeDasharray="3 3" />
        )),
      )}
      <rect x="12" y="20" width="76" height="64" rx="6" fill="none" />
    </>
  ),
  net: (
    <>
      <path d="M58 46 L88 88" strokeWidth="9" />
      <path d="M58 46 L88 88" stroke={C.wood} strokeWidth="4" />
      <path d="M14 34 Q24 82 46 68 Q62 58 58 44" fill={C.white} />
      <path d="M20 52 L56 52 M28 64 L50 64 M28 38 Q30 60 38 70 M44 32 Q46 56 52 62" fill="none" stroke={C.grayDark} strokeWidth="2" />
      <path d="M14 34 Q24 82 46 68 Q62 58 58 44" fill="none" strokeWidth="2.5" />
      <ellipse cx="36" cy="38" rx="23" ry="10" transform="rotate(10 36 38)" fill="none" strokeWidth="4" />
    </>
  ),
  plug: (
    <>
      <path d="M40 24 L40 10 M60 24 L60 10" strokeWidth="5" />
      <path d="M28 24 L72 24 L72 44 Q72 60 56 62 L44 62 Q28 60 28 44 Z" fill={C.white} />
      <path d="M50 62 Q50 80 30 84 Q14 86 10 80" fill="none" strokeWidth="5" />
    </>
  ),
  bell: (
    <>
      <path d="M50 12 L50 20" strokeWidth="4" />
      <path d="M50 20 Q28 20 26 46 Q26 64 14 72 L86 72 Q74 64 74 46 Q72 20 50 20 Z" fill={C.yellow} />
      <circle cx="50" cy="78" r="7" fill={C.orange} />
      <path d="M36 36 Q34 44 34 52" fill="none" stroke={C.white} strokeWidth="4" />
    </>
  ),
  "alarm-clock": (
    <>
      <path d="M14 30 Q14 14 30 14 Z M86 30 Q86 14 70 14 Z" fill={C.red} />
      <path d="M26 84 L32 76 M74 84 L68 76" strokeWidth="4" />
      <circle cx="50" cy="52" r="32" fill={C.red} />
      <circle cx="50" cy="52" r="24" fill={C.white} />
      <path d="M50 36 L50 52 L62 58" fill="none" strokeWidth="3.5" />
      <circle cx="50" cy="52" r="2.5" fill={C.ink} />
    </>
  ),
  watch: (
    <>
      <rect x="36" y="8" width="28" height="84" rx="8" fill={C.blue} />
      <circle cx="50" cy="50" r="22" fill={C.yellow} />
      <circle cx="50" cy="50" r="16" fill={C.white} />
      <path d="M50 40 L50 50 L58 54" fill="none" strokeWidth="3" />
    </>
  ),
  television: (
    <>
      <path d="M38 8 L50 20 L62 8" fill="none" strokeWidth="3" />
      <rect x="10" y="20" width="80" height="58" rx="10" fill={C.grayDark} />
      <rect x="18" y="28" width="56" height="42" rx="6" fill={C.sky} />
      <circle cx="82" cy="36" r="3" fill={C.red} />
      <circle cx="82" cy="48" r="3" fill={C.yellow} />
      <path d="M26 36 L34 44 M26 46 L30 50" stroke={C.white} strokeWidth="3" />
      <path d="M30 78 L26 88 M70 78 L74 88" strokeWidth="4" />
    </>
  ),
  antenna: (
    <>
      <path d="M50 54 L36 88 L64 88 Z" fill={C.gray} />
      <path d="M18 24 Q24 62 64 64 Q76 30 18 24 Z" fill={C.white} />
      <path d="M40 44 L64 26" strokeWidth="3" />
      <circle cx="66" cy="24" r="4" fill={C.red} />
      <path d="M74 14 Q82 20 80 30 M80 8 Q92 18 88 34" fill="none" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  keyboard: (
    <>
      <rect x="6" y="30" width="88" height="44" rx="8" fill={C.gray} />
      {[0, 1, 2].map((r) =>
        Array.from({ length: 7 }, (_, i) => (
          <rect key={`${r}-${i}`} x={13 + i * 11} y={37 + r * 10} width="8" height="7" rx="2" fill={C.white} strokeWidth="1.5" />
        )),
      )}
      <rect x="28" y="64" width="44" height="5" rx="2" fill={C.white} strokeWidth="1.5" />
    </>
  ),
  key: (
    <>
      <circle cx="30" cy="40" r="18" fill={C.yellow} />
      <circle cx="30" cy="40" r="7" fill={C.paper} />
      <path d="M44 50 L84 78 L78 86 L72 82 L76 76 L70 72 L66 78 L60 74 L64 68 L44 54 Z" fill={C.yellow} />
    </>
  ),
  ladder: (
    <>
      <path d="M30 10 L22 90 M70 10 L78 90" strokeWidth="10" />
      <path d="M30 10 L22 90 M70 10 L78 90" stroke={C.wood} strokeWidth="5" />
      <path d="M29 24 L71 24 M28 40 L72 40 M26 56 L74 56 M24 72 L76 72" strokeWidth="5" stroke={C.woodDark} />
    </>
  ),
  magnet: (
    <>
      <path d="M18 18 L18 52 Q18 84 50 84 Q82 84 82 52 L82 18 L62 18 L62 52 Q62 64 50 64 Q38 64 38 52 L38 18 Z" fill={C.red} />
      <path d="M18 18 L38 18 L38 32 L18 32 Z M62 18 L82 18 L82 32 L62 32 Z" fill={C.gray} />
      <path d="M12 10 L6 4 M88 10 L94 4" stroke={C.blue} strokeWidth="3" />
    </>
  ),
  scissors: (
    <>
      <path d="M52 52 L86 16 M48 52 L88 30" strokeWidth="6" />
      <path d="M52 52 L86 16 M48 52 L88 30" stroke={C.gray} strokeWidth="2.5" />
      <circle cx="28" cy="70" r="13" fill={C.red} />
      <circle cx="28" cy="70" r="6" fill={C.paper} />
      <circle cx="54" cy="78" r="13" fill={C.red} />
      <circle cx="54" cy="78" r="6" fill={C.paper} />
      <path d="M36 62 L50 52 L56 66" fill="none" strokeWidth="4" />
    </>
  ),
  needle: (
    <>
      <path d="M20 84 L78 18" strokeWidth="7" />
      <path d="M20 84 L78 18" stroke={C.gray} strokeWidth="3" />
      <ellipse cx="72" cy="25" rx="3" ry="1.5" transform="rotate(-48 72 25)" fill={C.paper} />
      <path d="M72 24 Q90 40 74 56 Q58 72 76 88" fill="none" stroke={C.red} strokeWidth="3" />
    </>
  ),
  thread: (
    <>
      <path d="M20 22 L80 22 L74 30 L26 30 Z" fill={C.wood} />
      <path d="M20 82 L80 82 L74 74 L26 74 Z" fill={C.wood} />
      <rect x="26" y="30" width="48" height="44" fill={C.red} />
      <path d="M26 38 L74 38 M26 46 L74 46 M26 54 L74 54 M26 62 L74 62" stroke="#E04449" strokeWidth="2.5" />
      <path d="M74 56 Q90 64 84 80 Q78 92 92 92" fill="none" stroke={C.red} strokeWidth="3" />
    </>
  ),
  yarn: (
    <>
      <circle cx="46" cy="50" r="32" fill={C.pink} />
      <path d="M20 36 Q46 46 64 22 M16 54 Q46 62 74 28 M22 70 Q50 74 78 46 M34 80 Q60 76 76 64" fill="none" stroke="#FF8FA3" strokeWidth="3" />
      <circle cx="46" cy="50" r="32" fill="none" />
      <path d="M74 64 Q86 76 78 86 Q72 92 90 92" fill="none" strokeWidth="3" />
    </>
  ),
  zipper: (
    <>
      <path d="M50 10 L50 90" strokeWidth="12" stroke={C.gray} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${i % 2 ? 50 : 44} ${16 + i * 9} L${i % 2 ? 56 : 50} ${16 + i * 9}`} strokeWidth="4" />
      ))}
      <rect x="40" y="46" width="20" height="16" rx="4" fill={C.yellow} />
      <rect x="44" y="60" width="12" height="22" rx="6" fill={C.yellow} />
      <circle cx="50" cy="74" r="2.5" fill={C.paper} />
    </>
  ),
  fan: (
    <>
      <path d="M50 84 L10 40 Q30 16 50 14 Q70 16 90 40 Z" fill={C.red} />
      <path d="M50 84 L22 28 M50 84 L36 18 M50 84 L50 14 M50 84 L64 18 M50 84 L78 28" stroke={C.woodDark} strokeWidth="2.5" />
      <path d="M10 40 Q30 16 50 14 Q70 16 90 40 Q70 30 50 30 Q30 30 10 40 Z" fill={C.yellow} />
      <circle cx="50" cy="84" r="5" fill={C.woodDark} />
    </>
  ),
  envelope: (
    <>
      <rect x="10" y="24" width="80" height="54" rx="6" fill={C.white} />
      <path d="M10 30 L50 58 L90 30" fill="none" />
      <path d={starPath(74, 40, 6)} fill={C.red} strokeWidth="2" />
    </>
  ),
  paper: (
    <>
      <path d="M22 10 L64 10 L80 26 L80 90 L22 90 Z" fill={C.white} />
      <path d="M64 10 L64 26 L80 26" fill={C.gray} />
      <path d="M32 40 L70 40 M32 52 L70 52 M32 64 L70 64 M32 76 L56 76" stroke={C.gray} strokeWidth="3" />
    </>
  ),
  menu: (
    <>
      <rect x="20" y="14" width="60" height="76" rx="6" fill={C.red} />
      <rect x="26" y="20" width="48" height="64" rx="3" fill={C.white} />
      <path d="M36 12 L64 12 L64 22 L36 22 Z" fill={C.gray} />
      <path d="M34 36 L54 36 M34 48 L58 48 M34 60 L52 60 M34 72 L56 72" stroke={C.gray} strokeWidth="3" />
      <path d="M64 36 L66 36 M64 48 L66 48 M64 60 L66 60 M64 72 L66 72" strokeWidth="3" />
    </>
  ),
  "test-paper": (
    <>
      <path d="M18 10 L60 10 L76 26 L76 90 L18 90 Z" fill={C.white} />
      <path d="M28 34 L34 40 L44 28 M28 56 L34 62 L44 50" fill="none" stroke={C.green} strokeWidth="3.5" />
      <path d="M50 36 L66 36 M50 58 L66 58 M28 76 L66 76" stroke={C.gray} strokeWidth="3" />
      <path d="M64 70 L88 46 L94 52 L70 76 L62 78 Z" fill={C.yellow} />
    </>
  ),
  pencil: (
    <>
      <path d="M24 64 L68 20 L80 32 L36 76 Z" fill={C.yellow} />
      <path d="M68 20 L74 14 Q78 10 82 14 L86 18 Q90 22 86 26 L80 32 Z" fill={C.pink} />
      <path d="M66 22 L78 34" strokeWidth="5" stroke={C.gray} />
      <path d="M24 64 L36 76 L16 84 Z" fill={C.woodLight} />
      <path d="M20 74 L26 80 L16 84 Z" fill={C.ink} />
      <path d="M30 70 L74 26" stroke={C.orange} strokeWidth="2.5" />
    </>
  ),
  pen: (
    <>
      <path d="M26 66 L70 22 Q76 16 82 22 Q88 28 82 34 L38 78 Z" fill={C.blue} />
      <path d="M26 66 L38 78 L20 86 L18 82 Z" fill={C.gray} />
      <path d="M60 24 L72 12" strokeWidth="4" />
      <path d="M44 56 L60 40" stroke={C.white} strokeWidth="3" />
    </>
  ),
  ruler: (
    <>
      <rect x="6" y="36" width="88" height="28" rx="4" fill={C.yellow} />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${14 + i * 9} 36 L${14 + i * 9} ${i % 2 ? 44 : 50}`} strokeWidth="2.5" />
      ))}
    </>
  ),
  "paper-clip": (
    <>
      <path d="M38 76 L38 30 Q38 16 52 16 Q66 16 66 30 L66 72 Q66 88 50 88 Q32 88 32 72 L32 40" fill="none" strokeWidth="9" />
      <path d="M38 76 L38 30 Q38 16 52 16 Q66 16 66 30 L66 72 Q66 88 50 88 Q32 88 32 72 L32 40" fill="none" stroke={C.blue} strokeWidth="4" />
      <path d="M50 30 L50 70" fill="none" strokeWidth="9" />
      <path d="M50 30 L50 70" fill="none" stroke={C.blue} strokeWidth="4" />
    </>
  ),
  book: (
    <>
      <path d="M50 28 Q32 18 10 22 L10 80 Q32 76 50 86 Z" fill={C.white} />
      <path d="M50 28 Q68 18 90 22 L90 80 Q68 76 50 86 Z" fill={C.white} />
      <path d="M50 28 L50 86" />
      <path d="M18 36 Q30 34 42 38 M18 48 Q30 46 42 50 M18 60 Q30 58 42 62 M58 38 Q70 34 82 36 M58 50 Q70 46 82 48 M58 62 Q70 58 82 60" fill="none" stroke={C.gray} strokeWidth="2.5" />
      <path d="M6 26 L6 84 Q30 78 50 90 Q70 78 94 84 L94 26" fill="none" stroke={C.red} strokeWidth="4" />
    </>
  ),
  books: (
    <>
      <rect x="12" y="20" width="16" height="68" rx="3" fill={C.red} />
      <rect x="30" y="30" width="16" height="58" rx="3" fill={C.blue} />
      <rect x="48" y="14" width="14" height="74" rx="3" fill={C.green} />
      <path d="M64 28 L78 24 L92 84 L78 88 Z" fill={C.yellow} />
      <path d="M12 32 L28 32 M30 42 L46 42 M48 28 L62 28 M12 76 L28 76 M30 78 L46 78 M48 76 L62 76" stroke={C.white} strokeWidth="3" />
    </>
  ),
  backpack: (
    <>
      <path d="M34 22 Q34 10 50 10 Q66 10 66 22" fill="none" strokeWidth="5" />
      <rect x="20" y="20" width="60" height="68" rx="16" fill={C.red} />
      <rect x="30" y="54" width="40" height="26" rx="6" fill={C.orange} />
      <path d="M30 62 L70 62" />
      <path d="M20 40 Q50 48 80 40" fill="none" strokeWidth="2.5" />
    </>
  ),
  suitcase: (
    <>
      <path d="M38 26 L38 16 Q38 12 42 12 L58 12 Q62 12 62 16 L62 26" fill="none" strokeWidth="5" />
      <rect x="12" y="26" width="76" height="56" rx="8" fill={C.blue} />
      <path d="M30 26 L30 82 M70 26 L70 82" stroke={C.navy} strokeWidth="5" />
      <circle cx="24" cy="88" r="4" fill={C.ink} />
      <circle cx="76" cy="88" r="4" fill={C.ink} />
    </>
  ),
  money: (
    <>
      <rect x="10" y="30" width="72" height="44" rx="5" fill={C.leaf} transform="rotate(-8 46 52)" />
      <rect x="18" y="26" width="72" height="44" rx="5" fill={C.green} />
      <circle cx="54" cy="48" r="12" fill={C.leaf} />
      <path d="M58 42 Q50 38 48 44 Q48 48 54 48 Q60 48 60 52 Q58 58 50 54 M54 36 L54 60" fill="none" strokeWidth="2.5" />
      <circle cx="28" cy="36" r="3" fill={C.leaf} stroke="none" />
      <circle cx="80" cy="60" r="3" fill={C.leaf} stroke="none" />
    </>
  ),
  // ----- treasure -----
  ring: (
    <>
      <circle cx="50" cy="62" r="24" fill="none" strokeWidth="12" />
      <circle cx="50" cy="62" r="24" fill="none" stroke={C.yellow} strokeWidth="7" />
      <path d="M38 30 L44 22 L56 22 L62 30 L50 44 Z" fill={C.sky} />
      <path d="M38 30 L62 30 M44 22 L50 30 L56 22" fill="none" strokeWidth="2" />
    </>
  ),
  diamond: (
    <>
      <path d="M12 38 L28 16 L72 16 L88 38 L50 86 Z" fill={C.sky} />
      <path d="M12 38 L88 38 M28 16 L38 38 L50 16 L62 38 L72 16 M38 38 L50 86 L62 38" fill="none" strokeWidth="2.5" />
      <path d="M30 26 L34 30" stroke={C.white} strokeWidth="3" />
    </>
  ),
  crown: (
    <>
      <path d="M14 76 L10 30 L32 50 L50 20 L68 50 L90 30 L86 76 Z" fill={C.yellow} />
      <rect x="14" y="70" width="72" height="14" rx="3" fill={C.orange} />
      <circle cx="50" cy="56" r="6" fill={C.red} />
      <circle cx="30" cy="62" r="4" fill={C.blue} />
      <circle cx="70" cy="62" r="4" fill={C.blue} />
      <circle cx="10" cy="28" r="4" fill={C.yellow} />
      <circle cx="50" cy="17" r="4" fill={C.yellow} />
      <circle cx="90" cy="28" r="4" fill={C.yellow} />
    </>
  ),
  trophy: (
    <>
      <path d="M28 26 Q8 26 12 42 Q16 54 34 54 M72 26 Q92 26 88 42 Q84 54 66 54" fill="none" strokeWidth="5" />
      <path d="M26 16 L74 16 L72 42 Q68 62 50 62 Q32 62 28 42 Z" fill={C.yellow} />
      <path d="M44 62 L56 62 L58 74 L42 74 Z" fill={C.yellow} />
      <rect x="30" y="74" width="40" height="14" rx="3" fill={C.woodDark} />
      <path d={starPath(50, 36, 9)} fill={C.white} strokeWidth="2" />
    </>
  ),
  "gold-medal": (
    <>
      <path d="M30 10 L44 48 L56 48 L42 10 Z" fill={C.blue} />
      <path d="M70 10 L56 48 L44 48 L58 10 Z" fill={C.red} />
      <circle cx="50" cy="64" r="24" fill={C.yellow} />
      <circle cx="50" cy="64" r="16" fill={C.orange} />
      <path d="M46 56 L52 52 L52 74 M46 74 L58 74" fill="none" stroke={C.white} strokeWidth="3.5" />
    </>
  ),
  // ----- tools and odd things -----
  axe: (
    <>
      <path d="M30 88 L62 22" strokeWidth="10" />
      <path d="M30 88 L62 22" stroke={C.wood} strokeWidth="5" />
      <path d="M52 22 Q60 6 82 14 Q94 32 80 46 Q66 38 58 36 Z" fill={C.gray} />
      <path d="M80 18 Q88 30 80 42" fill="none" stroke={C.white} strokeWidth="3" />
    </>
  ),
  "x-ray": (
    <>
      <rect x="12" y="10" width="76" height="80" rx="8" fill={C.navy} />
      <path d="M50 20 L50 80" stroke={C.white} strokeWidth="5" />
      {[30, 40, 50, 60].map((y) => (
        <path key={y} d={`M50 ${y} Q36 ${y - 4} 28 ${y + 4} M50 ${y} Q64 ${y - 4} 72 ${y + 4}`} fill="none" stroke={C.white} strokeWidth="3.5" />
      ))}
      <path d="M36 76 Q50 70 64 76" fill="none" stroke={C.white} strokeWidth="4" />
    </>
  ),
  potion: (
    <>
      <rect x="40" y="10" width="20" height="10" rx="2" fill={C.wood} />
      <path d="M42 20 L58 20 L58 36 Q80 46 78 66 Q76 88 50 88 Q24 88 22 66 Q20 46 42 36 Z" fill={C.white} />
      <path d="M24 62 Q50 54 76 62 Q76 86 50 86 Q24 86 24 62 Z" fill={C.green} stroke="none" />
      <circle cx="40" cy="72" r="3" fill={C.leaf} stroke="none" />
      <circle cx="56" cy="66" r="2" fill={C.leaf} stroke="none" />
      <path d="M42 20 L58 20 L58 36 Q80 46 78 66 Q76 88 50 88 Q24 88 22 66 Q20 46 42 36 Z" fill="none" />
    </>
  ),
  "magic-wand": (
    <>
      <path d="M18 86 L60 44" strokeWidth="10" />
      <path d="M18 86 L60 44" stroke={C.purple} strokeWidth="5" />
      <path d={starPath(66, 36, 18)} fill={C.yellow} />
      <path d="M86 12 L86 22 M81 17 L91 17 M30 22 L30 30 M26 26 L34 26" stroke={C.yellow} strokeWidth="3" />
    </>
  ),
  swords: (
    <>
      <path d="M22 22 L70 70 M78 22 L30 70" strokeWidth="10" />
      <path d="M22 22 L70 70 M78 22 L30 70" stroke={C.gray} strokeWidth="5" />
      <path d="M62 74 L74 62 M38 74 L26 62" strokeWidth="6" stroke={C.yellow} />
      <path d="M70 72 L84 86 M30 72 L16 86" strokeWidth="7" stroke={C.woodDark} />
    </>
  ),
  "bow-and-arrow": (
    <>
      <path d="M26 12 Q72 20 76 66 Q70 76 66 74 Q62 32 22 20 Z" fill={C.wood} />
      <path d="M24 16 L72 72" strokeWidth="2" />
      <path d="M16 84 L76 24" strokeWidth="3.5" />
      <path d="M76 24 L72 36 L64 28 Z" fill={C.gray} />
      <path d="M16 84 L14 74 L22 78 Z M16 84 L26 86 L22 78 Z" fill={C.red} />
    </>
  ),
  clapperboard: (
    <>
      <rect x="14" y="40" width="72" height="46" rx="5" fill={C.ink} />
      <path d="M14 40 L86 40 L86 30 L14 30 Z" fill={C.white} />
      <path d="M24 30 L32 40 M42 30 L50 40 M60 30 L68 40 M78 30 L86 38" strokeWidth="5" />
      <path d="M14 28 L82 14 L84 24 L16 38 Z" fill={C.white} />
      <path d="M22 26 L32 34 M40 22 L50 30 M58 18 L68 26" strokeWidth="4" />
      <path d="M24 56 L60 56 M24 68 L48 68" stroke={C.white} strokeWidth="3" />
    </>
  ),
  "paint-palette": (
    <>
      <path d="M50 14 Q86 14 88 46 Q90 70 70 70 Q60 70 62 80 Q62 90 48 88 Q12 84 12 50 Q14 14 50 14 Z" fill={C.woodLight} />
      <circle cx="32" cy="38" r="7" fill={C.red} />
      <circle cx="50" cy="28" r="7" fill={C.yellow} />
      <circle cx="68" cy="36" r="7" fill={C.blue} />
      <circle cx="28" cy="58" r="7" fill={C.green} />
      <circle cx="48" cy="72" r="5" fill={C.paper} />
    </>
  ),
  "nail-polish": (
    <>
      <rect x="40" y="10" width="20" height="30" rx="4" fill={C.ink} />
      <path d="M30 40 L70 40 Q78 40 78 50 L78 80 Q78 88 70 88 L30 88 Q22 88 22 80 L22 50 Q22 40 30 40 Z" fill={C.red} />
      <path d="M30 50 L30 74" stroke={C.white} strokeWidth="4" opacity="0.7" />
    </>
  ),
};
