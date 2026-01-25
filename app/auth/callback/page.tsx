'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'
import { NCSLoader } from '@/components/ui/NCSLoader'

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Get params
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/analyze'
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')

    const [status, setStatus] = useState('Đang kết nối...')

    // CRITICAL: Use ref to prevent double execution in React Strict Mode
    const hasRun = useRef(false)

    useEffect(() => {
        // Prevent double execution
        if (hasRun.current) {
            console.log('[Callback] Already running, skipping...')
            return
        }
        hasRun.current = true

        // 1. Handle explicit errors from OAuth provider
        if (errorParam) {
            console.error('[Callback] Auth Error:', errorParam, errorDesc)
            setStatus(`Lỗi: ${errorDesc || errorParam}`)
            setTimeout(() => router.push('/login'), 3000)
            return
        }

        const supabase = getSupabase()

        const handleAuth = async () => {
            try {
                // 2. Check if we already have a session (Auto-detect worked)
                const { data: { session: existingSession } } = await supabase.auth.getSession()

                if (existingSession) {
                    console.log('[Callback] Existing session found, redirecting to:', next)
                    router.replace(next)
                    return
                }

                // 3. If no session but we have a code, try manual exchange
                if (code) {
                    console.log('[Callback] No session yet, attempting manual exchange...')
                    setStatus('Đang xác thực bảo mật...')

                    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

                    if (error) {
                        console.error('[Callback] Exchange error:', error.message)

                        // Handle specific errors
                        if (error.message.includes('flow state not found') || error.message.includes('PKCE')) {
                            setStatus('Phiên đăng nhập hết hạn. Vui lòng thử lại.')
                        } else if (error.message.includes('already been used')) {
                            // Code already used - check if session exists now
                            const { data: { session: retrySession } } = await supabase.auth.getSession()
                            if (retrySession) {
                                console.log('[Callback] Code used but session exists, redirecting...')
                                router.replace(next)
                                return
                            }
                            setStatus('Mã xác thực đã được sử dụng. Vui lòng thử lại.')
                        } else {
                            setStatus('Lỗi xác thực: ' + error.message)
                        }
                        setTimeout(() => router.push('/login'), 3000)
                        return
                    }

                    if (data.session) {
                        console.log('[Callback] Manual exchange success! Redirecting to:', next)
                        router.replace(next)
                        return
                    }
                }

                // 4. No code and no session - redirect to login
                console.warn('[Callback] No code and no session, redirecting to login')
                setStatus('Không tìm thấy phiên đăng nhập.')
                setTimeout(() => router.push('/login'), 2000)

            } catch (err: any) {
                // CRITICAL: Ignore AbortError - it's just React Strict Mode cleanup
                if (err.name === 'AbortError') {
                    console.log('[Callback] AbortError ignored (React Strict Mode)')
                    return // Do NOT redirect on AbortError
                }

                console.error('[Callback] Unexpected error:', err)
                setStatus('Đã xảy ra lỗi hệ thống.')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        handleAuth()
    }, [code, next, errorParam, errorDesc, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe]">
            <NCSLoader text={status} size="lg" />
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe]">
                <NCSLoader text="Đang khởi tạo..." size="lg" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    )
}
