'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * AuthRedirectHandler
 * 
 * A silent utility component that detects if an authentication code (from Google/LinkedIn/ORCID)
 * has landed on the wrong page (usually the home page instead of /auth/callback).
 * 
 * If detected, it forces a redirect to the proper callback handler.
 */
export default function AuthRedirectHandler() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Check for parameters that indicate an OAuth or PKCE flow return
        const searchParams = new URLSearchParams(window.location.search);
        const hasCode = searchParams.has('code');
        const hasTokenHash = searchParams.has('token_hash');
        const hasError = searchParams.has('error');

        // Only act if we have code/error and are NOT already on a dedicated auth callback page
        const isAuthPage = pathname?.includes('/auth/callback') || 
                          pathname?.includes('/auth/orcid') || 
                          pathname?.includes('/login');

        if ((hasCode || hasTokenHash || hasError) && !isAuthPage) {
            console.log('[AuthRedirectHandler] Auth parameters detected on root or non-auth page. Redirecting to /auth/callback...');
            
            // We use window.location.href instead of router.push to ensure a clean state 
            // and trigger the exchangeCodeForSession properly.
            window.location.href = `/auth/callback${window.location.search}`;
        }
    }, [pathname]);

    return null;
}
