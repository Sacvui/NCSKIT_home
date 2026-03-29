import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    // Use origin from the request to ensure we stay on the same domain/protocol
    // This handles both localhost and production correctly.
    const redirectUrl = new URL(next, origin);

    console.log(`[Auth Callback Route] Processing exchange. Origin: ${origin}, Code: ${code ? 'present' : 'missing'}, Next: ${next}`);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback Route] Exchange successful. Redirecting to:', redirectUrl.toString());
            // In Next.js 15 App Router, supabase-ssr handles cookie persistence via createClient.
            return NextResponse.redirect(redirectUrl.toString());
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            const errorUrl = new URL('/login', origin);
            errorUrl.searchParams.set('error', error.message);
            return NextResponse.redirect(errorUrl.toString());
        }
    }

    console.warn('[Auth Callback Route] No code found in request.');
    const noCodeUrl = new URL('/login', origin);
    noCodeUrl.searchParams.set('error', 'no_code');
    return NextResponse.redirect(noCodeUrl.toString());
}
