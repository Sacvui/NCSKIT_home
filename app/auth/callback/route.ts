import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    // Use absolute site URL for production to avoid protocol/host mismatches in redirects
    const host = request.headers.get('host') || '';
    const protocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0];
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || host.includes('ncskit.org');
    
    // Fallback to origin but prioritize the production domain if we know we are there
    let siteUrl = `${protocol}://${host}`;
    if (isProduction && !host.includes('localhost')) {
        siteUrl = 'https://ncsstat.ncskit.org';
    }
    
    // Ensure redirectUrl is absolute and uses the correct host/protocol
    const redirectUrl = new URL(next, siteUrl);

    console.log(`[Auth Callback] Processing exchange. Proto: ${protocol}, Host: ${host}, siteUrl: ${siteUrl}, Code: ${code ? 'present' : 'missing'}`);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback] Exchange successful. Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl.toString());
        } else {
            console.error('[Auth Callback] Exchange error:', error.message, error.name);
            const errorUrl = new URL('/login', siteUrl);
            errorUrl.searchParams.set('error', error.message);
            // Include extra info for debugging PKCE errors
            if (error.message.includes('verifier') || error.message.includes('found')) {
                errorUrl.searchParams.set('auth_code', 'pkce_missing');
                errorUrl.searchParams.set('debug_host', host);
            }
            return NextResponse.redirect(errorUrl.toString());
        }
    }

    console.warn('[Auth Callback] No code found.');
    const noCodeUrl = new URL('/login', siteUrl);
    noCodeUrl.searchParams.set('error', 'no_code');
    return NextResponse.redirect(noCodeUrl.toString());
}
