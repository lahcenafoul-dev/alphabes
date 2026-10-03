const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
      // Crawlers and proxies may keep the sitemap an hour (its story list is
      // cached that long on the server too; see app/sitemap.ts).
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
