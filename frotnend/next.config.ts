import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://source.unsplash.com/random/800x600/?restaurant,nepal')],
  },
};

export default nextConfig;
