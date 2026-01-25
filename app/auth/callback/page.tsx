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

    useEffect(() => {
        // 1. Handle explicit errors
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
                    console.log('[Callback] Existing session found, redirecting...')
                    router.replace(next)
                    return
                }

                // 3. If no session but we have a code, try manual exchange
                if (code) {
                    console.log('[Callback] No session yet, attempting manual exchange code:', code.substring(0, 5) + '...')
                    setStatus('Đang xác thực bảo mật...')

                    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

                    if (error) {
                        console.error('[Callback] Exchange error:', error)
                        // If flow state not found (PKCE mismatch), we must ask user to login again
                        if (error.message.includes('flow state not found') || error.message.includes('PKCE')) {
                            setStatus('Phiên đăng nhập hết hạn. Vui lòng thử lại.')
                        } else {
                            setStatus('Lỗi xác thực: ' + error.message)
                        }
                        setTimeout(() => router.push('/login'), 3000)
                        return
                    }

                    if (data.session) {
                        console.log('[Callback] Manual exchange success!')
                        router.replace(next)
                        return
                    }
                }

                // 4. Last resort: Wait for auth state change event (Race condition)
                console.log('[Callback] Waiting for auth state change...')
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    console.log('[Callback] Auth event:', event)
                    if (event === 'SIGNED_IN' && session) {
                        console.log('[Callback] Signed in event received!')
                        subscription.unsubscribe()
                        router.replace(next)
                    }
                })

                // Timeout fallback
                setTimeout(() => {
                    // Check one last time
                    supabase.auth.getSession().then(({ data }) => {
                        if (data.session) {
                            router.replace(next)
                        } else {
                            console.warn('[Callback] Auth timeout')
                            setStatus('Không thể xác thực. Vui lòng đăng nhập lại.')
                            setTimeout(() => router.push('/login'), 2000)
                        }
                    })
                }, 5000) // 5s timeout

            } catch (err: any) {
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
