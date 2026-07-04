import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.6", "192.168.0.6:3000"],
  images: {
    formats: ["image/avif", "image/webp"]
  },
  reactStrictMode: true
};

export default nextConfig;
