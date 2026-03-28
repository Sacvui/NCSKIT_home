import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Server-side Auth Callback Route Handler
 * This handles the OAuth code exchange entirely on the server to prevent
 * PKCE verifier mismatch errors commonly found in client-side components.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/analyze';

    console.log('[Auth Callback Route] Processing code exchange...');

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (!error) {
                console.log('[Auth Callback Route] Exchange successful, redirecting to:', next);
                
                // Create a response object first to ensure cookies from the exchange are captured
                const response = NextResponse.redirect(`${origin}${next}`);
                return response;
            } else {
                console.error('[Auth Callback Route] Exchange error:', error.message);
                const errorMessage = error.message.includes('code_verifier') 
                    ? 'Lỗi bảo mật PKCE: Vui lòng xóa cookie trình duyệt hoặc thử lại trong tab ẩn danh.' 
                    : error.message;
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`);
            }
        } catch (err: any) {
            console.error('[Auth Callback Route] Unexpected error:', err.message);
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Lỗi hệ thống trong quá trình xử lý callback.')}`);
        }
    }

    // Fallback if no code is present
    console.warn('[Auth Callback Route] No code found in URL');
    return NextResponse.redirect(`${origin}/login?error=Authentication code missing`);
}
