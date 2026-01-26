import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    let { searchParams, origin } = new URL(request.url)

    // Enforce HTTPS in production/Vercel to ensure Secure cookies are accepted
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
        if (origin.startsWith('http://')) {
            origin = origin.replace('http://', 'https://')
        }
    }
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/analyze'
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('[Callback Route] Processing callback:', {
        code: code?.slice(0, 8) + '...',
        next,
        error,
        origin,
        userAgent: request.headers.get('user-agent')?.slice(0, 50)
    })

    // Handle OAuth errors
    if (error) {
        console.error('[Callback Route] OAuth error:', error, errorDescription)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('OAuth lỗi: ' + (errorDescription || error))}`)
    }

    if (!code) {
        console.error('[Callback Route] No authorization code provided')
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Thiếu mã xác thực')}`)
    }

    try {
        const supabase = await createClient()
        console.log('[Callback Route] Created Supabase client, exchanging code for session')

        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
            console.error('[Callback Route] Exchange error:', exchangeError.message, exchangeError.status)

            // Check if it's a "code already used" error - session might exist
            if (exchangeError.message.includes('already been used') ||
                exchangeError.message.includes('flow state') ||
                exchangeError.message.includes('expired')) {
                console.log('[Callback Route] Code already used/expired, checking existing session')

                // Check if user already has a valid session
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    console.log('[Callback Route] Found existing session, redirecting to:', next)
                    return NextResponse.redirect(`${origin}${next}`)
                }
            }

            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Lỗi trao đổi mã: ' + exchangeError.message)}`)
        }

        if (!data.session) {
            console.warn('[Callback Route] No session created despite successful exchange')
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Không thể tạo phiên đăng nhập')}`)
        }

        console.log('[Callback Route] Session established successfully')
        console.log('[Callback Route] User:', data.session.user.email)
        console.log('[Callback Route] Session expires at:', new Date(data.session.expires_at! * 1000).toISOString())

        console.log('[Callback Route] Redirecting to:', next)
        // Use redirect from next/navigation which handles cookies correctly
        return redirect(`${origin}${next}`)

    } catch (err: any) {
        console.error('[Callback Route] Unexpected error:', err.message, err.stack)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Lỗi không mong muốn: ' + err.message)}`)
    }
}
