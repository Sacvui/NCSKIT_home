import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    let response = NextResponse.redirect(`${siteUrl}${next}`);

    console.log(`[Auth Callback Route] Processing exchange. Code: ${code ? 'present' : 'missing'}, Next: ${next}, SiteUrl: ${siteUrl}`);

    if (code) {
        const cookieStore = await cookies();
        
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            // Update both the underlying cookie store and the response object
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                                response.cookies.set(name, value, options);
                            });
                        } catch (err) {
                            console.warn('[Auth Callback Route] setAll error (ignored):', err);
                        }
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback Route] Exchange successful. Redirecting to:', `${siteUrl}${next}`);
            return response;
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
}
