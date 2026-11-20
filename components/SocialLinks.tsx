// Small icon links to the AlphaBes social profiles (lib/social.ts), for the
// site footer and the home page footer. The labels come from the page's
// language ("AlphaBes on YouTube"); the icons are simple line drawings.
import { SOCIAL_PROFILES, type SocialProfile } from "@/lib/social";

const ICONS: Record<SocialProfile["id"], React.ReactNode> = {
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M10.6 20.5l1.9-8.2M10.4 14.6c-1.3-.9-1.7-2.6-1.1-4.2.9-2.4 4.4-3 6-1.2 1.6 1.8.5 5.7-2.2 5.7-.7 0-1.3-.3-1.6-.8" />
    </>
  ),
  tiktok: <path d="M13.5 3.5v11.2a3.3 3.3 0 1 1-3.3-3.3M13.5 3.5c.4 2.6 2.3 4.4 4.8 4.6" />,
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function SocialLinks({
  label,
  linkLabel,
  className = "",
  linkClassName = "",
}: {
  /** The list's name ("Follow AlphaBes"). */
  label: string;
  /** Each link's accessible name, from its network's name ("AlphaBes on YouTube"). */
  linkLabel: (network: string) => string;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <ul aria-label={label} className={`flex items-center gap-3 ${className}`}>
      {SOCIAL_PROFILES.map((p) => (
        <li key={p.id}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            aria-label={linkLabel(p.name)}
            title={linkLabel(p.name)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${linkClassName}`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[p.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
