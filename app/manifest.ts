import type { MetadataRoute } from "next";

// /manifest.webmanifest, linked from every page by Next.js.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlphaBes",
    short_name: "AlphaBes",
    description: "Letters, sounds and first reading for children ages 3 to 8.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFDF7",
    theme_color: "#D9A86C",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
