import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    // Determine the definitive site URL. 
    // On Vercel production, we MUST use https and the configured domain.
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const siteUrl = isProduction ? 'https://ncsstat.ncskit.org' : origin;
    
    // Ensure redirectUrl is absolute and uses the correct host/protocol
    const redirectUrl = new URL(next, siteUrl);

    console.log(`[Auth Callback] Processing exchange. Origin: ${origin}, siteUrl: ${siteUrl}, Code: ${code ? 'present' : 'missing'}`);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback] Exchange successful. Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl.toString());
        } else {
            console.error('[Auth Callback] Exchange error:', error.message);
            const errorUrl = new URL('/login', siteUrl);
            errorUrl.searchParams.set('error', error.message);
            // Include extra info for debugging PKCE errors
            if (error.message.includes('verifier')) {
                errorUrl.searchParams.set('auth_reason', 'pkce_verifier_error');
            }
            return NextResponse.redirect(errorUrl.toString());
        }
    }

    console.warn('[Auth Callback] No code found.');
    const noCodeUrl = new URL('/login', siteUrl);
    noCodeUrl.searchParams.set('error', 'no_code');
    return NextResponse.redirect(noCodeUrl.toString());
}
