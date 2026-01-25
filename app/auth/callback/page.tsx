'use client'

import { useEffect, useState, Suspense } from 'react'
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
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        // Prevent concurrent processing
        if (isProcessing) return
        setIsProcessing(true)

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
                // 2. FIRST: Check if we already have a session (auto-detect worked or previous success)
                const { data: { session: existingSession } } = await supabase.auth.getSession()

                if (existingSession) {
                    console.log('[Callback] Session exists! Redirecting to:', next)
                    setStatus('Đăng nhập thành công!')
                    router.replace(next)
                    return
                }

                // 3. No session yet - try manual exchange if we have a code
                if (code) {
                    console.log('[Callback] No session, attempting exchange with code...')
                    setStatus('Đang xác thực bảo mật...')

                    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

                    if (error) {
                        console.error('[Callback] Exchange error:', error.message)

                        // Handle "already used" - session might exist now
                        if (error.message.includes('already been used') || error.message.includes('flow state')) {
                            // Re-check session
                            const { data: { session: retrySession } } = await supabase.auth.getSession()
                            if (retrySession) {
                                console.log('[Callback] Session found after error, redirecting...')
                                setStatus('Đăng nhập thành công!')
                                router.replace(next)
                                return
                            }
                            setStatus('Mã xác thực đã được sử dụng. Đang thử lại...')
                        } else {
                            setStatus('Lỗi: ' + error.message.substring(0, 50))
                        }
                        setTimeout(() => router.push('/login'), 3000)
                        return
                    }

                    if (data.session) {
                        console.log('[Callback] Exchange success! Redirecting to:', next)
                        setStatus('Đăng nhập thành công!')
                        router.replace(next)
                        return
                    }
                }

                // 4. No code and no session - wait a moment then check again (auto-detect delay)
                console.log('[Callback] No immediate session, waiting for auto-detect...')
                setStatus('Đang chờ xác thực...')

                await new Promise(resolve => setTimeout(resolve, 2000))

                const { data: { session: delayedSession } } = await supabase.auth.getSession()
                if (delayedSession) {
                    console.log('[Callback] Session detected after delay, redirecting...')
                    setStatus('Đăng nhập thành công!')
                    router.replace(next)
                    return
                }

                // 5. Still no session - redirect to login
                console.warn('[Callback] No session established, redirecting to login')
                setStatus('Không tìm thấy phiên đăng nhập.')
                setTimeout(() => router.push('/login'), 2000)

            } catch (err: any) {
                // Ignore AbortError completely - don't change state
                if (err.name === 'AbortError') {
                    console.log('[Callback] AbortError ignored, letting next attempt proceed')
                    setIsProcessing(false) // Allow retry
                    return
                }

                console.error('[Callback] Unexpected error:', err)
                setStatus('Đã xảy ra lỗi hệ thống.')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        handleAuth()
    }, [code, next, errorParam, errorDesc, router, isProcessing])

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
