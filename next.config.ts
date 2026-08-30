import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // Keep image optimization disabled: link icons are loaded directly from their source.
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
};

export default config;
