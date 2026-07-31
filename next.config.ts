import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['169.254.83.107', '192.168.100.8', '192.168.100.12'],
  reactCompiler: true,
};

export default nextConfig;
