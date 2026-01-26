import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

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

            // Provide more specific error messages
            let errorMessage = 'Lỗi trao đổi mã: ' + exchangeError.message
            if (exchangeError.message.includes('Invalid login credentials')) {
                errorMessage = 'Thông tin đăng nhập không hợp lệ'
            } else if (exchangeError.message.includes('Email not confirmed')) {
                errorMessage = 'Email chưa được xác nhận'
            } else if (exchangeError.message.includes('flow state')) {
                errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng thử lại'
            }

            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
        }

        if (!data.session) {
            console.warn('[Callback Route] No session created despite successful exchange')
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Không thể tạo phiên đăng nhập - vui lòng kiểm tra cấu hình Supabase')}`)
        }

        console.log('[Callback Route] Session established successfully')
        console.log('[Callback Route] User:', data.session.user.email)
        console.log('[Callback Route] Session expires at:', new Date(data.session.expires_at! * 1000).toISOString())

        console.log('[Callback Route] Redirecting to:', next)
        // Use NextResponse.redirect for API routes - this prevents NEXT_REDIRECT error
        return NextResponse.redirect(`${origin}${next}`)

    } catch (err: any) {
        console.error('[Callback Route] Unexpected error:', err.message, err.stack)
        
        // Handle specific Next.js redirect errors
        if (err.message?.includes('NEXT_REDIRECT')) {
            console.log('[Callback Route] Handling NEXT_REDIRECT error, using NextResponse.redirect instead')
            return NextResponse.redirect(`${origin}${next}`)
        }
        
        let errorMessage = 'Lỗi không mong muốn: ' + err.message
        if (err.message?.includes('fetch')) {
            errorMessage = 'Lỗi kết nối mạng, vui lòng thử lại'
        } else if (err.message?.includes('timeout')) {
            errorMessage = 'Kết nối quá chậm, vui lòng thử lại'
        }
        
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMessage)}`)
    }
}
