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
        // We used to process exchangeCodeForSession here. 
        // However, this caused intermittent 'invalid flow state' errors because the Next.js server 
        // sometimes cannot read the code_verifier cookie set by the browser. 
        // By redirecting the `code` parameter straight to the client URL, 
        // the @supabase/ssr browser client will safely intercept it and authenticate natively!
        redirectUrl.searchParams.set('code', code);
        console.log('[Auth Callback] Deferring auth verification to client. Redirecting to:', redirectUrl.toString());
        return NextResponse.redirect(redirectUrl.toString());
    }

    console.warn('[Auth Callback] No code found in URL. This might be an implicit flow callback (hash fragment). Redirecting to client to parse.');
    // If there's no code, it might be in the URL hash fragment which the server can't read.
    // Redirect to the intended destination so the client-side Supabase client can parse the hash.
    return NextResponse.redirect(redirectUrl.toString());
}
