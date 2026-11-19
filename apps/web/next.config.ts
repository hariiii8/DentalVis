import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@dentalvis/ui', '@dentalvis/common'],
};

export default nextConfig;
