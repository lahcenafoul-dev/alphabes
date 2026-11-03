import type { MetadataRoute } from "next";
import { OWL_PURPLE } from "@/lib/owl-icon";

// /manifest.webmanifest, linked from every page by Next.js.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlphaBes",
    short_name: "AlphaBes",
    description: "Letters, sounds and first reading for children ages 3 to 8.",
    start_url: "/",
    display: "browser",
    background_color: "#FFFDF7",
    theme_color: OWL_PURPLE,
    icons: [
      { src: "/icon2", sizes: "192x192", type: "image/png" },
      { src: "/icon3", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
