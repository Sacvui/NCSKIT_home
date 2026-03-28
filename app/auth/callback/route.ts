import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

/**
 * Server-side Auth Callback Route Handler
 * This handles the OAuth code exchange entirely on the server to prevent
 * PKCE verifier mismatch errors commonly found in client-side components.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';

    console.log('[Auth Callback Route] Processing code exchange...');

    if (code) {
        // Create the redirect response first
        const response = NextResponse.redirect(`${origin}${next}`);

        try {
            // Initialize Supabase within the route handler to use the response object for cookies
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            const cookieStore = request.headers.get('cookie') ?? '';
                            // Basic parser for headers cookie string
                            return cookieStore.split(';').map(c => {
                                const [name, ...value] = c.trim().split('=');
                                return { name, value: value.join('=') };
                            });
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
                                response.cookies.set(name, value, options)
                            );
                        },
                    },
                }
            );

            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (!error) {
                console.log('[Auth Callback Route] Exchange successful, redirecting with cookies.');
                return response;
            } else {
                console.error('[Auth Callback Route] Exchange error:', error.message);
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
            }
        } catch (err: any) {
            console.error('[Auth Callback Route] Unexpected error:', err.message);
            return NextResponse.redirect(`${origin}/login?error=callback_exception`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=no_code`);
}
