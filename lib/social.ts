// AlphaBes's social profiles: the organization's sameAs (lib/json-ld.ts) and
// the icon links in the footers (components/SocialLinks.tsx). Plain profile
// URLs, no query strings.
export type SocialProfile = { id: "youtube" | "pinterest" | "tiktok" | "instagram"; name: string; url: string };

export const SOCIAL_PROFILES: SocialProfile[] = [
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com/@Alphabes" },
  { id: "pinterest", name: "Pinterest", url: "https://www.pinterest.com/alphabeskid/" },
  { id: "tiktok", name: "TikTok", url: "https://www.tiktok.com/@alphabes01" },
  { id: "instagram", name: "Instagram", url: "https://www.instagram.com/alph.abes/" },
];
