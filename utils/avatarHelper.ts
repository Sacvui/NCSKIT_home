const DEFAULT_AVATAR = '/webr/default-avatar.png';

/**
 * Proxy external avatar URLs through Next.js image optimization API
 * to avoid COEP (Cross-Origin-Embedder-Policy) blocking of cross-origin images.
 * Google/OAuth avatars from lh3.googleusercontent.com are blocked by
 * the `credentialless` COEP header required for WebR WASM.
 */
function proxyAvatarUrl(url: string): string {
    // Only proxy known external OAuth avatar domains
    const externalDomains = [
        'lh3.googleusercontent.com',
        'avatars.githubusercontent.com',
        'platform-lookaside.fbsbx.com',
        'pbs.twimg.com',
    ];
    try {
        const parsed = new URL(url);
        if (externalDomains.some(d => parsed.hostname.includes(d))) {
            return `/api/avatar-proxy?url=${encodeURIComponent(url)}`;
        }
    } catch {
        // Not a valid URL, fall through
    }
    return url;
}

export const getAvatarUrl = (avatarUrl: string | null | undefined, googleAvatarUrl?: string | null | undefined): string => {
    // Check main avatarURL
    if (avatarUrl && avatarUrl !== 'N/A' && avatarUrl !== 'null' && avatarUrl !== '') {
        return proxyAvatarUrl(avatarUrl);
    }

    // Check google avatar fallback
    if (googleAvatarUrl && googleAvatarUrl !== 'N/A' && googleAvatarUrl !== 'null' && googleAvatarUrl !== '') {
        return proxyAvatarUrl(googleAvatarUrl);
    }

    return DEFAULT_AVATAR;
};
