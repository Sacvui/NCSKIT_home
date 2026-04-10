import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin: urlOrigin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    const host = request.headers.get('host') || '';
    const protocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0];
    const origin = `${protocol}://${host}`;
    
    // Standardize siteUrl: if localhost, use origin. If production sub-domain, use primary.
    const siteUrl = host.includes('localhost') ? origin : origin.replace('stat.ncskit.org', 'ncsstat.ncskit.org');
    const redirectUrl = new URL(next, siteUrl);

    console.log(`[Auth Callback] Processing. Host: ${host}, siteUrl: ${siteUrl}, Code: ${code ? 'present' : 'missing'}`);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback] Success. Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl.toString());
        } else {
            console.error('[Auth Callback] Exchange error:', error.message, error.name);
            const errorUrl = new URL('/login', siteUrl);
            errorUrl.searchParams.set('error', `${error.message} (${error.name})`);
            
            // Helpful debug info for PKCE errors
            if (error.message.toLowerCase().includes('verifier') || error.message.toLowerCase().includes('not found')) {
                errorUrl.searchParams.set('auth_code', 'pkce_error_details');
                errorUrl.searchParams.set('debug_info', `host=${host};proto=${protocol}`);
            }
            return NextResponse.redirect(errorUrl.toString());
        }
    }

    console.warn('[Auth Callback] No code found in URL. This might be an implicit flow callback (hash fragment). Redirecting to client to parse.');
    // If there's no code, it might be in the URL hash fragment which the server can't read.
    // Redirect to the intended destination so the client-side Supabase client can parse the hash.
    return NextResponse.redirect(redirectUrl.toString());
}
