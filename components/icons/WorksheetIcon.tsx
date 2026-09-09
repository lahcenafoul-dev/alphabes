// On-screen twin of lib/pdf/icons.ts -- same simple, original line-art
// shapes, drawn as inline SVG so worksheet previews look like their printed
// PDF counterpart. Follows the same inline-SVG-composition style already
// used by components/StoryIllustration.tsx.

import type { ReactNode } from "react";

type Props = {
  word: string;
  className?: string;
};

const STROKE = "currentColor";

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={STROKE}
      strokeWidth={3}
      role="img"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function RoundFruit({ leaf = true }: { leaf?: boolean }) {
  return (
    <Svg>
      <circle cx="50" cy="58" r="28" />
      <line x1="50" y1="30" x2="54" y2="18" />
      {leaf && <path d="M54 18 L70 12 L58 28 Z" />}
    </Svg>
  );
}

function AnimalHead({
  ears,
  snout,
  mane,
  stripes,
  horns,
  longEars,
  trunk,
}: {
  ears: "triangle" | "round" | "floppy" | "none";
  snout?: boolean;
  mane?: boolean;
  stripes?: boolean;
  horns?: boolean;
  longEars?: boolean;
  trunk?: boolean;
}) {
  const r = 28;
  const cx = 50;
  const cy = 55;
  const maneLines = mane
    ? Array.from({ length: 10 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 10;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r * 1.05}
            y1={cy + Math.sin(a) * r * 1.05}
            x2={cx + Math.cos(a) * r * 1.45}
            y2={cy + Math.sin(a) * r * 1.45}
          />
        );
      })
    : null;

  return (
    <Svg>
      {maneLines}
      {ears === "triangle" && (
        <>
          <path d={`M${cx - r * 0.8} ${cy - r * 0.5} L${cx - r * 0.35} ${cy - r * 1.35} L${cx - r * 0.05} ${cy - r * 0.55} Z`} />
          <path d={`M${cx + r * 0.8} ${cy - r * 0.5} L${cx + r * 0.35} ${cy - r * 1.35} L${cx + r * 0.05} ${cy - r * 0.55} Z`} />
        </>
      )}
      {ears === "round" && (
        <>
          <circle cx={cx - r * 0.75} cy={cy - r * 0.85} r={r * 0.3} />
          <circle cx={cx + r * 0.75} cy={cy - r * 0.85} r={r * 0.3} />
        </>
      )}
      {ears === "floppy" && (
        <>
          <ellipse cx={cx - r * 0.95} cy={cy - r * 0.1} rx={r * 0.28} ry={r * (longEars ? 0.9 : 0.55)} />
          <ellipse cx={cx + r * 0.95} cy={cy - r * 0.1} rx={r * 0.28} ry={r * (longEars ? 0.9 : 0.55)} />
        </>
      )}
      {horns && (
        <>
          <line x1={cx - r * 0.3} y1={cy - r * 0.9} x2={cx - r * 0.5} y2={cy - r * 1.4} />
          <line x1={cx + r * 0.3} y1={cy - r * 0.9} x2={cx + r * 0.5} y2={cy - r * 1.4} />
        </>
      )}
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.1} r={r * 0.08} />
      <circle cx={cx + r * 0.35} cy={cy - r * 0.1} r={r * 0.08} />
      {trunk ? (
        <path d={`M${cx} ${cy + r * 0.3} L${cx} ${cy + r * 1.1} L${cx + r * 0.25} ${cy + r * 1.15}`} />
      ) : snout ? (
        <ellipse cx={cx} cy={cy + r * 0.4} rx={r * 0.35} ry={r * 0.2} />
      ) : (
        <circle cx={cx} cy={cy + r * 0.35} r={r * 0.06} />
      )}
      {stripes &&
        [-1, 0, 1].map((i) => (
          <line key={i} x1={cx + i * r * 0.35} y1={cy - r * 0.75} x2={cx + i * r * 0.35 - r * 0.15} y2={cy + r * 0.9} />
        ))}
    </Svg>
  );
}

const SIMPLE: Record<string, React.ReactNode> = {
  fish: (
    <Svg>
      <ellipse cx="52" cy="55" rx="28" ry="17" />
      <path d="M24 55 L10 45 L10 65 Z" />
      <circle cx="66" cy="50" r="2.2" />
    </Svg>
  ),
  igloo: (
    <Svg>
      <ellipse cx="50" cy="60" rx="28" ry="18" />
      <line x1="22" y1="60" x2="78" y2="60" />
      <line x1="30" y1="60" x2="30" y2="50" />
      <line x1="44" y1="60" x2="44" y2="45" />
      <line x1="58" y1="60" x2="58" y2="47" />
      <ellipse cx="54" cy="63" rx="6" ry="9" />
    </Svg>
  ),
  jelly: (
    <Svg>
      <ellipse cx="50" cy="52" rx="28" ry="21" />
      <path d="M35 70 L32 82" />
      <path d="M50 73 L48 85" />
      <path d="M65 70 L62 82" />
    </Svg>
  ),
  kite: (
    <Svg>
      <path d="M50 20 L22 55 L50 61 Z" />
      <path d="M50 20 L78 55 L50 61 Z" />
      <line x1="50" y1="61" x2="50" y2="90" />
    </Svg>
  ),
  nest: (
    <Svg>
      <ellipse cx="50" cy="65" rx="28" ry="14" />
      <ellipse cx="38" cy="55" rx="6" ry="4.5" />
      <ellipse cx="52" cy="50" rx="6" ry="4.5" />
      <ellipse cx="64" cy="55" rx="6" ry="4.5" />
    </Svg>
  ),
  queen: (
    <Svg>
      <circle cx="50" cy="68" r="16" />
      <path d="M32 46 L38 26 L44 40 L50 22 L56 40 L62 26 L68 46 Z" />
      <line x1="32" y1="46" x2="68" y2="46" />
    </Svg>
  ),
  sun: (
    <Svg>
      <circle cx="50" cy="50" r="16" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 8;
        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 20}
            y1={50 + Math.sin(a) * 20}
            x2={50 + Math.cos(a) * 30}
            y2={50 + Math.sin(a) * 30}
          />
        );
      })}
    </Svg>
  ),
  umbrella: (
    <Svg>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={22 + i * 14} y1="50" x2="50" y2="22" />
      ))}
      <line x1="22" y1="50" x2="78" y2="50" />
      <path d="M50 50 L50 78 L58 74" />
    </Svg>
  ),
  van: (
    <Svg>
      <rect x="18" y="42" width="64" height="28" rx="4" />
      <line x1="36" y1="42" x2="36" y2="70" />
      <rect x="42" y="48" width="18" height="10" />
      <circle cx="34" cy="70" r="8" />
      <circle cx="66" cy="70" r="8" />
    </Svg>
  ),
  whale: (
    <Svg>
      <ellipse cx="46" cy="55" rx="28" ry="15" />
      <path d="M74 55 L88 46 L88 64 Z" />
      <path d="M32 40 L32 28" />
      <path d="M40 40 L40 24" />
    </Svg>
  ),
  xylophone: (
    <Svg>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={50 - (28 - i * 3.5)} y={22 + i * 12} width={(28 - i * 3.5) * 2} height={9} />
      ))}
    </Svg>
  ),
};

export default function WorksheetIcon({ word, className = "h-16 w-16" }: Props) {
  const key = word.toLowerCase();

  switch (key) {
    case "apple":
      return <span className={className}><RoundFruit /></span>;
    case "ball":
      return <span className={className}><RoundFruit leaf={false} /></span>;
    case "orange":
      return <span className={className}><RoundFruit /></span>;
    case "cat":
      return <span className={className}><AnimalHead ears="triangle" /></span>;
    case "dog":
      return <span className={className}><AnimalHead ears="floppy" snout /></span>;
    case "elephant":
      return <span className={className}><AnimalHead ears="floppy" longEars trunk /></span>;
    case "goat":
      return <span className={className}><AnimalHead ears="none" horns snout /></span>;
    case "horse":
      return <span className={className}><AnimalHead ears="none" mane snout /></span>;
    case "lion":
      return <span className={className}><AnimalHead ears="round" mane snout /></span>;
    case "monkey":
      return <span className={className}><AnimalHead ears="round" snout /></span>;
    case "pig":
      return <span className={className}><AnimalHead ears="triangle" snout /></span>;
    case "rabbit":
      return <span className={className}><AnimalHead ears="floppy" longEars /></span>;
    case "tiger":
      return <span className={className}><AnimalHead ears="triangle" stripes /></span>;
    case "yak":
      return <span className={className}><AnimalHead ears="none" horns mane snout /></span>;
    case "zebra":
      return <span className={className}><AnimalHead ears="none" mane stripes snout /></span>;
    default:
      if (SIMPLE[key]) {
        return <span className={className}>{SIMPLE[key]}</span>;
      }
      return (
        <span className={className}>
          <Svg>
            <rect x="20" y="20" width="60" height="60" rx="6" />
            <text x="50" y="60" textAnchor="middle" fontSize="34" fill="currentColor" stroke="none" fontWeight="bold">
              {word.charAt(0).toUpperCase()}
            </text>
          </Svg>
        </span>
      );
  }
}
