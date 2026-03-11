import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        protocol: 'https',
        hostname: 'assets2.razerzone.com',
      },
      {
        protocol: 'https',
        hostname: 'techspace.ma',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
