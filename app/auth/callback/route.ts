import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    const host = request.headers.get('host') || '';
    const protocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0];
    const origin = `${protocol}://${host}`;
    
    const siteUrl = host.includes('localhost') ? origin : origin.replace('stat.ncskit.org', 'ncsstat.ncskit.org');

    console.log(`[Auth Callback] Processing. Host: ${host}, Code: ${code ? 'present' : 'missing'}, Next: ${next}`);

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('[Auth Callback] Exchange failed:', error.message);
                // Redirect to login with error
                return NextResponse.redirect(new URL(`/login?error=exchange_failed&next=${next}`, siteUrl));
            }
            
            console.log('[Auth Callback] Exchange successful! Redirecting to:', next);
            // Redirect to target WITHOUT code param — session is now in cookies
            return NextResponse.redirect(new URL(next, siteUrl));
        } catch (err) {
            console.error('[Auth Callback] Unexpected error:', err);
            return NextResponse.redirect(new URL(`/login?error=auth_error&next=${next}`, siteUrl));
        }
    }

    console.warn('[Auth Callback] No code found. Redirecting to:', next);
    return NextResponse.redirect(new URL(next, siteUrl));
}
