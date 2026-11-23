import type { NextConfig } from "next";

// The site is served from https://guybracha.github.io/GuyBracha/.
// Set NEXT_PUBLIC_BASE_PATH="" when deploying to a custom domain root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/GuyBracha";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
