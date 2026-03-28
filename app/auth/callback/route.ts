import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Server-side Auth Callback Route Handler
 * This handles the OAuth code exchange entirely on the server to prevent
 * PKCE verifier mismatch errors commonly found in client-side components.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/analyze';

    console.log('[Auth Callback Route] Processing code exchange...');

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (!error) {
                console.log('[Auth Callback Route] Exchange successful, redirecting to:', next);
                return NextResponse.redirect(`${origin}${next}`);
            } else {
                console.error('[Auth Callback Route] Exchange error:', error.message);
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
            }
        } catch (err: any) {
            console.error('[Auth Callback Route] Unexpected error:', err.message);
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(err.message)}`);
        }
    }

    // Fallback if no code is present
    console.warn('[Auth Callback Route] No code found in URL');
    return NextResponse.redirect(`${origin}/login?error=Authentication code missing`);
}
