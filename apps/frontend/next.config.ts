import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pharmacore/shared-web",
    "@pharmacore/shared",
    "@pharmacore/auth-web",
    "@pharmacore/auth",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
