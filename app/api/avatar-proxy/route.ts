import { NextRequest, NextResponse } from 'next/server';

// Allowlist of trusted external avatar domains
const ALLOWED_DOMAINS = [
    'lh3.googleusercontent.com',
    'avatars.githubusercontent.com',
    'platform-lookaside.fbsbx.com',
    'pbs.twimg.com',
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing url parameter', { status: 400 });
    }

    // Validate URL and domain allowlist to prevent SSRF
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    if (parsed.protocol !== 'https:') {
        return new NextResponse('Only HTTPS URLs are allowed', { status: 400 });
    }

    const isAllowed = ALLOWED_DOMAINS.some(domain => parsed.hostname.endsWith(domain));
    if (!isAllowed) {
        return new NextResponse('Domain not allowed', { status: 403 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                // Pass a reasonable user-agent
                'User-Agent': 'Mozilla/5.0 ncsStat Avatar Proxy',
            },
        });

        if (!response.ok) {
            return new NextResponse('Failed to fetch avatar', { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Only allow image content types
        if (!contentType.startsWith('image/')) {
            return new NextResponse('Not an image', { status: 400 });
        }

        const buffer = await response.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                // Cache avatar for 1 hour on CDN, 24h in browser
                'Cache-Control': 'public, max-age=86400, s-maxage=3600',
                // Allow embedding in COEP context
                'Cross-Origin-Resource-Policy': 'cross-origin',
            },
        });
    } catch (error) {
        console.error('[AvatarProxy] Fetch error:', error);
        return new NextResponse('Proxy error', { status: 502 });
    }
}
