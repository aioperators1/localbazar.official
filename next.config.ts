import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   serverActions: true, // Enabled by default in Next.js 14+
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
