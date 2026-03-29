import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    // Explicitly check for host to handle production redirects
    const host = request.headers.get('host') || 'ncsstat.ncskit.org';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${host}`;
    
    // Create the redirect response first
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
                            console.log('[Auth Callback Route] Setting cookies from exchange successfully.');
                            cookiesToSet.forEach(({ name, value, options }) => {
                                // Strip domain to avoid cross-subdomain issues, force secure and lax
                                const cookieOptions = {
                                    ...options,
                                    domain: '', // Force null to use current host
                                    secure: true,
                                    sameSite: 'lax' as const,
                                    path: '/',
                                };
                                
                                cookieStore.set(name, value, cookieOptions);
                                response.cookies.set(name, value, cookieOptions);
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
            console.log('[Auth Callback Route] Exchange successful. Cookies set. Redirecting to:', `${siteUrl}${next}`);
            return response;
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            // On error, we still want to redirect but to the login page with the error
            return NextResponse.redirect(`${siteUrl}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${siteUrl}/login?error=no_code`);
}
