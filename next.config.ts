import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Keep review screenshots clean (no floating dev badge).
  devIndicators: false,
  partialPrefetching: true,
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
