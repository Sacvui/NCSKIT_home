import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/analyze'
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('[Callback Route] Processing callback:', { code: code?.slice(0, 8) + '...', next, error })

    // Handle OAuth errors
    if (error) {
        console.error('[Callback Route] OAuth error:', error, errorDescription)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || error)}`)
    }

    if (code) {
        try {
            const supabase = await createClient()
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
                console.error('[Callback Route] Exchange error:', exchangeError.message)

                // Check if it's a "code already used" error - session might exist
                if (exchangeError.message.includes('already been used') || exchangeError.message.includes('flow state')) {
                    console.log('[Callback Route] Code already used, redirecting anyway')
                    return NextResponse.redirect(`${origin}${next}`)
                }

                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(exchangeError.message)}`)
            }

            if (data.session) {
                console.log('[Callback Route] Session established, redirecting to:', next)
                return NextResponse.redirect(`${origin}${next}`)
            }
        } catch (err: any) {
            console.error('[Callback Route] Unexpected error:', err.message)
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Unexpected authentication error')}`)
        }
    }

    // No code provided, redirect to login
    console.warn('[Callback Route] No code provided, redirecting to login')
    return NextResponse.redirect(`${origin}/login`)
}
