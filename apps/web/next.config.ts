import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@flight-tracker/types",
    "@flight-tracker/config",
    "@flight-tracker/utils",
    "@flight-tracker/ui",
    "@flight-tracker/api-client",
  ],
};

export default nextConfig;
