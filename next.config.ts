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
      {
        protocol: 'https',
        hostname: 'setupgame.ma',
      },
    ],
  },
};

export default nextConfig;
