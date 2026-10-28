import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // The word pictures (components/illustrations) are JSX.
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // next-intl imports "next/server" without an extension, which Node's ESM
    // resolver rejects; let Vite resolve it instead.
    server: { deps: { inline: ["next-intl"] } },
  },
});
