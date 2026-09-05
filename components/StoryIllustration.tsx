type Props = { scene: string | null };

export default function StoryIllustration({ scene }: Props) {
  const svg = getScene(scene);
  return (
    <div className="w-full aspect-video bg-paper flex items-center justify-center">
      {svg}
    </div>
  );
}

function getScene(scene: string | null) {
  switch (scene) {
    // ===== The Little Apple =====
    case "apple-1":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#bae6fd" />
          <ellipse cx="200" cy="270" rx="200" ry="30" fill="#86efac" />
          <circle cx="200" cy="180" r="60" fill="#ef4444" />
          <path d="M195 120 Q190 100 210 95" stroke="#78350f" strokeWidth="6" fill="none" />
          <ellipse cx="220" cy="105" rx="18" ry="10" fill="#22c55e" />
        </svg>
      );
    case "apple-2":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#bae6fd" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#86efac" />
          <rect x="185" y="150" width="30" height="140" fill="#92400e" />
          <circle cx="200" cy="110" r="90" fill="#22c55e" />
          <circle cx="230" cy="140" r="20" fill="#ef4444" />
        </svg>
      );
    case "apple-3":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#93c5fd" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#86efac" />
          <rect x="185" y="150" width="30" height="140" fill="#92400e" />
          <circle cx="200" cy="110" r="90" fill="#22c55e" />
          <circle cx="260" cy="220" r="18" fill="#ef4444" />
          <path d="M60 90 Q90 80 120 90" stroke="white" strokeWidth="5" fill="none" />
          <path d="M280 60 Q310 50 340 60" stroke="white" strokeWidth="5" fill="none" />
        </svg>
      );
    case "apple-4":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#bae6fd" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#86efac" />
          <circle cx="200" cy="120" r="40" fill="#fbbf24" />
          <path d="M170 160 L230 160 L220 260 L180 260 Z" fill="#f472b6" />
          <circle cx="195" cy="185" r="15" fill="#ef4444" />
        </svg>
      );
    case "apple-5":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#fde68a" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#86efac" />
          <rect x="185" y="180" width="30" height="110" fill="#92400e" />
          <circle cx="200" cy="140" r="70" fill="#22c55e" />
          <text x="200" y="150" textAnchor="middle" fontSize="28" fontWeight="bold" fill="white">
            The End
          </text>
        </svg>
      );

    // ===== The Brave Little Bear =====
    case "bear-1":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#bbf7d0" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#4d7c0f" />
          <circle cx="200" cy="190" r="55" fill="#92400e" />
          <circle cx="170" cy="150" r="18" fill="#92400e" />
          <circle cx="230" cy="150" r="18" fill="#92400e" />
          <circle cx="185" cy="185" r="6" fill="#1f2937" />
          <circle cx="215" cy="185" r="6" fill="#1f2937" />
          <ellipse cx="200" cy="205" rx="16" ry="10" fill="#d6a973" />
        </svg>
      );
    case "bear-2":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#1f2937" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#111827" />
          <rect x="60" y="80" width="20" height="200" fill="#3f2d1c" />
          <rect x="320" y="60" width="20" height="220" fill="#3f2d1c" />
          <circle cx="200" cy="200" r="45" fill="#92400e" />
          <circle cx="185" cy="195" r="5" fill="white" />
          <circle cx="215" cy="195" r="5" fill="white" />
        </svg>
      );
    case "bear-3":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#312e81" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#1e1b4b" />
          <circle cx="150" cy="200" r="45" fill="#92400e" />
          <text x="270" y="150" fontSize="60" fontWeight="bold" fill="#facc15">
            !
          </text>
          <path d="M240 170 Q260 160 280 170" stroke="#facc15" strokeWidth="4" fill="none" />
        </svg>
      );
    case "bear-4":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#0ea5e9" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#0369a1" />
          <circle cx="200" cy="190" r="50" fill="#92400e" />
          <circle cx="185" cy="185" r="6" fill="white" />
          <circle cx="215" cy="185" r="6" fill="white" />
          <path d="M120 250 L160 220" stroke="#92400e" strokeWidth="10" strokeLinecap="round" />
          <path d="M280 250 L240 220" stroke="#92400e" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case "bear-5":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#fbcfe8" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#f472b6" />
          <circle cx="160" cy="190" r="45" fill="#92400e" />
          <circle cx="240" cy="190" r="45" fill="#78350f" />
          <circle cx="150" cy="185" r="5" fill="white" />
          <circle cx="250" cy="185" r="5" fill="white" />
        </svg>
      );

    // ===== The Curious Cat =====
    case "cat-1":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#fed7aa" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#86efac" />
          <ellipse cx="200" cy="200" rx="45" ry="35" fill="#f97316" />
          <circle cx="200" cy="150" r="30" fill="#f97316" />
          <path d="M175 130 L165 105 L185 120 Z" fill="#f97316" />
          <path d="M225 130 L235 105 L215 120 Z" fill="#f97316" />
          <circle cx="190" cy="148" r="4" fill="#1f2937" />
          <circle cx="210" cy="148" r="4" fill="#1f2937" />
        </svg>
      );
    case "cat-2":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#bbf7d0" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#4d7c0f" />
          <rect x="150" y="180" width="100" height="80" fill="#d97706" />
          <rect x="140" y="165" width="120" height="20" fill="#b45309" />
          <path d="M150 180 L200 220 L250 180" stroke="#78350f" strokeWidth="4" fill="none" />
        </svg>
      );
    case "cat-3":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#f5d0fe" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#d946ef" />
          <circle cx="200" cy="180" r="60" fill="#f472b6" />
          <path d="M150 180 Q200 140 250 180" stroke="#be185d" strokeWidth="3" fill="none" />
          <path d="M150 200 Q200 240 250 200" stroke="#be185d" strokeWidth="3" fill="none" />
        </svg>
      );
    case "cat-4":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#99f6e4" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#14b8a6" />
          <ellipse cx="220" cy="220" rx="45" ry="30" fill="#f97316" />
          <circle cx="240" cy="180" r="25" fill="#f97316" />
          <circle cx="150" cy="200" r="35" fill="#f472b6" />
        </svg>
      );
    case "cat-5":
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#1e293b" />
          <ellipse cx="200" cy="280" rx="200" ry="20" fill="#0f172a" />
          <circle cx="200" cy="220" r="55" fill="#f97316" />
          <path d="M170 200 Q200 180 230 200" stroke="#1f2937" strokeWidth="3" fill="none" />
          <text x="270" y="140" fontSize="30" fill="#facc15">
            Z z z
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <rect width="400" height="300" fill="#e5e7eb" />
        </svg>
      );
  }
}