import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { logger } from '@/utils/logger';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/analyze';
    
    const host = request.headers.get('host') || '';
    const protocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0];
    const origin = `${protocol}://${host}`;
    
    // Always use the exact origin the user accessed to ensure cookies match the domain!
    const siteUrl = origin;

    logger.debug(`[Auth Callback] Processing code-exchange for: ${siteUrl}`);

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
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, { ...options, path: '/' });
                            });
                        } catch (error) {
                            console.error('[Auth Callback] Error setting cookies:', error);
                        }
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
            
            logger.debug('[Auth Callback] SUCCESS. Session cookies saved to store.');
            return NextResponse.redirect(new URL(next, siteUrl));
        } catch (err) {
            console.error('[Auth Callback] Fatal error during exchange:', err);
            return NextResponse.redirect(new URL(`/login?error=internal_error&next=${next}`, siteUrl));
        }
    }

    return NextResponse.redirect(new URL(next, siteUrl));
}
