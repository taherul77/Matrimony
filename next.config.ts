import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Use a custom build directory to avoid Windows file lock issues on .next
  distDir: ".next-dev",
};

export default nextConfig;
