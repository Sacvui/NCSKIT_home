/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.openai.com',
      },
      {
        protocol: 'https',
        hostname: '**.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.anthropic.com',
      },
      {
        protocol: 'https',
        hostname: '**.x.ai',
      },
      {
        protocol: 'https',
        hostname: '**.perplexity.ai',
      },
      {
        protocol: 'https',
        hostname: '**.langchain.com',
      },
      {
        protocol: 'https',
        hostname: '**.huggingface.co',
      },
      {
        protocol: 'https',
        hostname: '**.wolframalpha.com',
      },
    ],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', 'recharts'],
  },
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

