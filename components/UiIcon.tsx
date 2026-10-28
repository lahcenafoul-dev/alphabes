// Icons for cards, buttons and headings: lucide-react line icons, all with
// the same stroke, plus a clapping-hands icon drawn in the same style
// (lucide has none). Decorative: the text next to them carries the meaning.
import {
  ArrowRight,
  BookOpen,
  CaseSensitive,
  Check,
  Dices,
  Download,
  Ear,
  Eye,
  Footprints,
  Gamepad2,
  Hand,
  Image,
  Layers,
  Lock,
  MessageCircle,
  Palette,
  PartyPopper,
  Pencil,
  Play,
  PenLine,
  Printer,
  Puzzle,
  RotateCcw,
  Search,
  Shapes,
  ShoppingBag,
  Square,
  Trophy,
  Volume2,
  Waves,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

export const ICON_STROKE = 2.25;

const ICONS = {
  search: Search,
  image: Image,
  ear: Ear,
  pencil: Pencil,
  trophy: Trophy,
  waves: Waves,
  palette: Palette,
  puzzle: Puzzle,
  writing: PenLine,
  letters: CaseSensitive,
  eye: Eye,
  shapes: Shapes,
  hand: Hand,
  bag: ShoppingBag,
  dice: Dices,
  jump: Footprints,
  cards: Layers,
  // buttons and feedback
  listen: Volume2,
  retry: RotateCcw,
  stop: Square,
  party: PartyPopper,
  check: Check,
  cross: X,
  next: ArrowRight,
  play: Play,
  lock: Lock,
  print: Printer,
  download: Download,
  speak: MessageCircle,
  stories: BookOpen,
  games: Gamepad2,
} satisfies Record<string, LucideIcon>;

export type UiIconName = keyof typeof ICONS | "clap";

export function ClapIcon({ className, strokeWidth = ICON_STROKE, size = 24 }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4.5" y="8" width="6" height="13" rx="3" transform="rotate(-18 7.5 14.5)" />
      <rect x="13.5" y="8" width="6" height="13" rx="3" transform="rotate(18 16.5 14.5)" />
      <path d="M12 2.5v2.5M7.5 4l1.2 1.8M16.5 4l-1.2 1.8" />
    </svg>
  );
}

export default function UiIcon({ name, strokeWidth = ICON_STROKE, ...props }: { name: UiIconName } & LucideProps) {
  if (name === "clap") return <ClapIcon strokeWidth={strokeWidth} {...props} />;
  const Icon = ICONS[name];
  return <Icon strokeWidth={strokeWidth} aria-hidden="true" {...props} />;
}

/** An icon on a soft yellow tile, at the top of a card. */
export function IconTile({ name, className = "h-12 w-12" }: { name: UiIconName; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-block bg-crayon-yellow/30 text-chalkboard ${className}`} aria-hidden="true">
      <UiIcon name={name} className="h-1/2 w-1/2" />
    </span>
  );
}

/** An icon sized to the text around it, before (or after) a label. */
export function InlineIcon({ name, after = false, className = "" }: { name: UiIconName; after?: boolean; className?: string }) {
  return <UiIcon name={name} className={`${after ? "ml-1.5" : "mr-1.5"} inline-block h-[1.15em] w-[1.15em] shrink-0 align-[-0.2em] ${className}`} />;
}
