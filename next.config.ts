import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'keshav-cup.sirv.com',
        pathname: '/keshav-cup-2025/**', // Allows all images in the /uuuu/ path
      },
    ],
  },
};

export default nextConfig;
