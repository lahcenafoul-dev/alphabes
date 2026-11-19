const path = require("path");

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

// What next-intl's plugin (createNextIntlPlugin("./i18n/request.ts")) does
// for this config: point `next-intl/config` at our request config. The plugin
// itself is not used because it loads @swc/core and @parcel/watcher (native
// binaries, only for its experimental message extraction) as soon as
// next.config.js is read, and the Cloudflare build failed on that on
// 2026-11-18 ("Failed to load native binding"). If next-intl is upgraded,
// check its plugin still adds nothing else we need (env, turbopack alias).
function withNextIntl(config) {
  return {
    ...config,
    webpack(webpackConfig, context) {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "next-intl/config": path.resolve(__dirname, "i18n/request.ts"),
      };
      return typeof config.webpack === "function" ? config.webpack(webpackConfig, context) : webpackConfig;
    },
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep Prisma out of the bundler so its Workers (WASM) build is picked at
  // runtime by OpenNext.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  // app/global-not-found.tsx: a 404 page in the visitor's language that,
  // unlike app/not-found.tsx, isn't rendered into every page.
  experimental: {
    globalNotFound: true,
  },
  // Always put <title>/<meta> in <head>, including on pages rendered per
  // request (404, dashboard, stories), instead of streaming them into <body>
  // for non-bot browsers. Their metadata is cheap to compute.
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.alphabes.com" },
    ],
  },
  // The French, Spanish and Portuguese pack PDFs were public files; they are
  // now a Pro download (docs/paypal-plan.md). Old links and search results
  // go to the pack's page. Each file was named after its pack.
  async redirects() {
    return [
      // An older, shorter copy of the privacy policy (docs/seo-audit.md, I4).
      { source: "/privacy", destination: "/privacy-policy", statusCode: 301 },
      // The English online tracer gave the same PDF as the tracing worksheet
      // (SEO phase 4, 2026-11-19). Both cases: the page used to answer /alphabet/A/worksheet too.
      ...LETTERS.flatMap((l) =>
        [l, l.toUpperCase()].map((p) => ({ source: `/alphabet/${p}/worksheet`, destination: `/worksheets/letter-${l}-tracing`, statusCode: 301 })),
      ),
      { source: "/fiches-pdf/packs/:slug([a-z0-9-]+).pdf", destination: "/fr/fiches/packs/:slug", permanent: true },
      { source: "/fichas-pdf/paquetes/:slug([a-z0-9-]+).pdf", destination: "/es/fichas/paquetes/:slug", permanent: true },
      { source: "/atividades-pdf/pacotes/:slug([a-z0-9-]+).pdf", destination: "/pt/atividades/pacotes/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Crawlers and proxies may keep the sitemaps (index and one per
      // language, built at build time; lib/sitemap.ts) an hour.
      {
        source: "/:file(sitemap|sitemap-en|sitemap-fr|sitemap-es|sitemap-pt).xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
