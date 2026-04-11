import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    // Construct base URL correctly for deployment environment
    const host = request.headers.get('host') || '';
    const protocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0];
    const origin = `${protocol}://${host}`;
    const siteUrl = host.includes('localhost') ? origin : origin.replace('stat.ncskit.org', 'ncsstat.ncskit.org');

    console.log(`[Auth Callback] Processing code-exchange for: ${siteUrl}`);

    if (code) {
        // We need a response object to attach cookies to
        const response = NextResponse.redirect(new URL(next, siteUrl));
        
        // Create a special client for this response
        // Using '@supabase/ssr' pattern specifically for Route Handlers
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.headers.get('cookie')?.split(';').map(c => {
                            const [name, ...value] = c.trim().split('=');
                            return { name, value: value.join('=') };
                        }) || [];
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            response.cookies.set(name, value, {
                                ...options,
                                path: '/', // Force root path for all auth cookies
                            });
                        });
                    },
                },
            }
        );

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('[Auth Callback] Code exchange failed:', error.message);
                return NextResponse.redirect(new URL(`/login?error=exchange_failed&err_msg=${encodeURIComponent(error.message)}&next=${next}`, siteUrl));
            }
            
            console.log('[Auth Callback] SUCCESS. Session cookies attached to redirect.');
            return response; // Correctly return the response WITH cookies attached
        } catch (err) {
            console.error('[Auth Callback] Fatal error during exchange:', err);
            return NextResponse.redirect(new URL(`/login?error=internal_error&next=${next}`, siteUrl));
        }
    }

    return NextResponse.redirect(new URL(next, siteUrl));
}
