import type { NextConfig } from "next";
import 'lib/env.ts'

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },

    ],
    formats: ['image/avif', 'image/webp'],
  },

  cacheLife: {
    frequent: {
      stale: 60,
      revalidate: 300,
      expire: 3600,
    },
    user: {
      stale: 0,
      revalidate: 900,
      expire: 3600,
    },
    static: {
      stale: 86400,
      revalidate: 604800,
      expire: 2592000,
    },
  },
};

export default nextConfig;
