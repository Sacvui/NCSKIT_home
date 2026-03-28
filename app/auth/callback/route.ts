import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';

    console.log('[Auth Callback Route] Processing exchange using standard cookies store...');

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
                            cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                            );
                        } catch (err) {
                            // This catch is expected in some server environments
                            console.warn('[Auth Callback Route] setAll error (ignored):', err);
                        }
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error) {
            console.log('[Auth Callback Route] Exchange successful.');
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            console.error('[Auth Callback Route] Exchange error:', error.message);
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=no_code`);
}
