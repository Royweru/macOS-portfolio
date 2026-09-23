import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  // Keep the development-only floating indicator out of the OS taskbar hit area.
  devIndicators: false,
};

export default nextConfig;
