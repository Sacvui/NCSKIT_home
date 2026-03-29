import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    const host = request.headers.get('host') || 'ncsstat.ncskit.org';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;

    console.log(`[Auth Callback Route] Processing exchange. Code: ${code ? 'present' : 'missing'}, Next: ${next}, SiteUrl: ${siteUrl}`);

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback Route] Exchange successful. Cookies should be set in store. Redirecting to:', `${siteUrl}${next}`);
            
            // Re-verify the session to ensure cookies are definitely populated in the response headers
            await supabase.auth.getUser();
            
            const response = NextResponse.redirect(`${siteUrl}${next}`);
            return response;
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
}
