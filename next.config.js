/** @type {import('next').NextConfig} */

// ─── Content Security Policy ──────────────────────────────────────────────────
//
// Design constraints:
//  1. WebR WASM requires 'wasm-unsafe-eval' in script-src
//  2. WebR service worker requires 'blob:' in worker-src
//  3. Tailwind CSS 4 injects inline styles → 'unsafe-inline' in style-src
//  4. Next.js injects inline scripts for hydration → 'unsafe-inline' in script-src
//  5. Supabase Realtime uses WSS → wss://*.supabase.co in connect-src
//  6. Google Fonts → fonts.googleapis.com / fonts.gstatic.com
//  7. Vercel Analytics → va.vercel-scripts.com
//  8. Cloudflare Insights → static.cloudflareinsights.com
//
// NOTE: 'unsafe-inline' for scripts is required because Next.js injects inline
//       hydration scripts that cannot be hashed/nonced without a custom server.
//       This is a known limitation of Next.js static/edge deployments on Vercel.
//       The main XSS protection comes from other headers (X-Frame-Options, etc.)
//
const CSP_DIRECTIVES = [
    // Default: only same-origin
    "default-src 'self'",

    // Scripts: self + WebR WASM eval + blob workers + inline (Next.js hydration)
    // + Vercel Analytics + Vercel Live + Cloudflare Insights
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://va.vercel-scripts.com https://vercel.live https://static.cloudflareinsights.com",

    // Styles: self + inline (Tailwind CSS 4 requires unsafe-inline)
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

    // Fonts
    "font-src 'self' https://fonts.gstatic.com",

    // Images: self + data URIs + blob + all HTTPS (avatar proxy, OG images)
    "img-src 'self' data: blob: https:",

    // Connections: self + Supabase + Gemini AI + ORCID + WebR Repos + CDNs
    "connect-src 'self' blob: data: https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com https://pub.orcid.org https://orcid.org https://va.vercel-scripts.com https://*.vercel-scripts.com https://cloudflareinsights.com https://*.r-wasm.org https://cdn.jsdelivr.net https://*.vercel.app",

    // Workers: self + blob (WebR service worker)
    "worker-src 'self' blob:",

    // Frames: deny all (no iframes needed)
    "frame-ancestors 'none'",

    // Forms: only self
    "form-action 'self'",

    // Base URI: only self (prevent base tag injection)
    "base-uri 'self'",
].join('; ');

const nextConfig = {
    // Headers for WebR (WASM, Service Worker)
    async headers() {
        return [
            // Security headers for all pages
            {
                source: '/:path*',
                headers: [
                    // WebR WASM headers
                    // CRITICAL: 'credentialless' (NOT 'require-corp') is required because:
                    // - repo.r-wasm.org does NOT send CORP headers
                    // - 'require-corp' blocks ALL cross-origin fetches without CORP
                    // - 'credentialless' still enables SharedArrayBuffer on Chrome 96+
                    //   while allowing cross-origin fetches (without cookies/credentials)
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    // Security headers
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    // Content Security Policy
                    {
                        key: 'Content-Security-Policy',
                        value: CSP_DIRECTIVES,
                    },
                ],
            },
            // WebR core binaries (R.wasm, webr-worker.js, R.js)
            {
                source: '/webr_core_v3/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'cross-origin',
                    },
                    {
                        // Force browser to revalidate WebR binaries on each visit
                        // This prevents stale worker cache issues after deployments
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
            // Local R package repository (psych, jsonlite, etc.)
            {
                source: '/webr_repo_v3/:path*',
                headers: [
                    {
                        // CRITICAL: Without this, COEP blocks loading .tgz packages
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'cross-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, stale-while-revalidate=604800',
                    },
                ],
            },
            // Also serve old v2 repo with correct headers (if still referenced)
            {
                source: '/webr_repo_v2/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'cross-origin',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                ],
            },
            {
                source: '/webr-serviceworker.js',
                headers: [
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'credentialless',
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        // Service workers MUST not be cached to ensure updates propagate
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                ],
            },
        ];
    },

    // Enable strict TypeScript checking for better code quality
    typescript: {
        ignoreBuildErrors: false,
    },

    // Enable compression
    compress: true,

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Production optimizations
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
};

export default nextConfig;
