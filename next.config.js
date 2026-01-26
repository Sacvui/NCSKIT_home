/** @type {import('next').NextConfig} */
const nextConfig = {
    // Headers for WebR (WASM, Service Worker)
    async headers() {
        return [
            // Security headers for all pages
            {
                source: '/:path*',
                headers: [
                    // WebR WASM headers
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
                ],
            },
            {
                source: '/webr/:path*',
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
                ],
            },
        ];
    },
    // Enable strict TypeScript checking for better code quality
    typescript: {
        // Remove ignoreBuildErrors to catch type errors early
        ignoreBuildErrors: false,
    },
    // Remove deprecated eslint config - use .eslintrc.json instead
    experimental: {
        // Enable modern features
        turbo: {
            rules: {
                // Turbopack specific rules if needed
            }
        }
    }
};

export default nextConfig;

