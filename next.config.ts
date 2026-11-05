import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Keep review screenshots clean (no floating dev badge).
  devIndicators: false,
  partialPrefetching: true,
  // D74: a confidential work in progress: every response tells search engines not to index or follow it (with
  // app/robots.ts), so a preview link never ends up in search results. Revisit only at launch.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] }];
  },
  // Frozen copies of earlier versions (D39; scripts/build-versions.sh) are static files under public/versions/<commit>/;
  // their pages are .html files, so a clean URL finds its file once nothing else matched
  async rewrites() {
    return [
      { source: "/versions/:commit", destination: "/versions/:commit/index.html" },
      { source: "/versions/:commit/:path+", destination: "/versions/:commit/:path+.html" },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        // Tailwind for global CSS only: CSS Modules (*.module.css) must keep their scoped class names.
        condition: { all: [{ not: "foreign" }, { not: { path: /\.module\.css$/ } }] },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
