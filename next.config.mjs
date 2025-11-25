/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
  // Vercel optimization
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;

