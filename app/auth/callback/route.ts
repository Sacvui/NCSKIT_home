import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';

    console.log('[Auth Callback Route] Processing exchange with manual response cookie attachment...');

    // 1. Create the redirect response object first
    const response = NextResponse.redirect(`${origin}${next}`);

    if (code) {
        // 2. Initialize Supabase client targeting the redirect response
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        const cookieString = request.headers.get('Cookie') ?? '';
                        return cookieString.split(';').map(v => {
                            const parts = v.split('=');
                            return {
                                name: parts[0].trim(),
                                value: parts.slice(1).join('=').trim()
                            };
                        }).filter(c => c.name !== '');
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            // Apply cookies directly to the redirect response object
                            response.cookies.set(name, value, {
                                ...options,
                                // Ensure cross-subdomain compatibility
                                domain: (process.env.NEXT_PUBLIC_SITE_URL?.includes('ncskit.org')) ? '.ncskit.org' : undefined,
                            });
                        });
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback Route] Exchange successful. Cookies attached to response.');
            return response;
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=no_code`);
}
