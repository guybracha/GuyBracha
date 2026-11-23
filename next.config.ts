import type { NextConfig } from "next";

// Served from the domain root by default (Vercel, custom domains).
// For GitHub Pages project sites set NEXT_PUBLIC_BASE_PATH="/GuyBracha" at build time.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
