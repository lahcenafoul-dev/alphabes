import type { Config } from "tailwindcss";

// AlphaBes design tokens.
// Concept: a classroom shelf of wooden alphabet blocks against warm paper.
// Not the generic AI cream+terracotta pairing -- paper is closer to white,
// and the accent set is a primary crayon-box palette used in flat blocks,
// not gradients.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFDF7",
        chalkboard: "#1F2A44",
        crayon: {
          red: "#FF5A5F",
          yellow: "#FFC93C",
          green: "#3FA35C",
          blue: "#3EA6FF",
          purple: "#8B5CF6",
        },
        wood: {
          light: "#F1D9A8",
          DEFAULT: "#D9A86C",
          dark: "#8A5A32",
        },
      },
      fontFamily: {
        display: ["var(--font-baloo)", "system-ui", "sans-serif"],
        body: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        block: "14px",
      },
      boxShadow: {
        block: "inset 0 -6px 0 rgba(0,0,0,0.15), 0 6px 0 rgba(0,0,0,0.08)",
        blockHover: "inset 0 -6px 0 rgba(0,0,0,0.15), 0 10px 0 rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
