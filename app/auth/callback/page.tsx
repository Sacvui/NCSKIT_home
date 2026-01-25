'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'
import { NCSLoader } from '@/components/ui/NCSLoader'

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const next = searchParams.get('next') ?? '/analyze'
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')

    const [status, setStatus] = useState('Đang xác thực...')

    useEffect(() => {
        // Handle OAuth errors
        if (errorParam) {
            console.error('[Callback] OAuth Error:', errorParam, errorDesc)
            setStatus(`Lỗi: ${errorDesc || errorParam}`)
            setTimeout(() => router.push('/login'), 3000)
            return
        }

        const supabase = getSupabase()
        let redirected = false

        // Use event listener - not affected by AbortController
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[Callback] Auth event:', event, session ? 'Session exists' : 'No session')

            if (redirected) return

            if (event === 'SIGNED_IN' && session) {
                redirected = true
                console.log('[Callback] SIGNED_IN detected, redirecting to:', next)
                setStatus('Đăng nhập thành công!')
                setTimeout(() => router.replace(next), 500)
            } else if (event === 'TOKEN_REFRESHED' && session) {
                redirected = true
                console.log('[Callback] TOKEN_REFRESHED, redirecting to:', next)
                setStatus('Đăng nhập thành công!')
                setTimeout(() => router.replace(next), 500)
            }
        })

        // Also check immediately if session already exists (from auto-detect)
        // Use a simple timeout to avoid AbortError
        const checkExisting = setTimeout(async () => {
            if (redirected) return

            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session && !redirected) {
                    redirected = true
                    console.log('[Callback] Existing session found, redirecting to:', next)
                    setStatus('Đăng nhập thành công!')
                    setTimeout(() => router.replace(next), 500)
                }
            } catch (err: any) {
                // Ignore AbortError - the event listener will handle it
                if (err.name !== 'AbortError') {
                    console.log('[Callback] Session check error:', err.message)
                }
            }
        }, 100)

        // Timeout fallback
        const timeoutId = setTimeout(() => {
            if (!redirected) {
                console.log('[Callback] Auth timeout')
                setStatus('Không thể xác thực. Vui lòng thử lại.')
                setTimeout(() => router.push('/login'), 2000)
            }
        }, 15000) // 15 second timeout

        return () => {
            subscription.unsubscribe()
            clearTimeout(checkExisting)
            clearTimeout(timeoutId)
        }
    }, [errorParam, errorDesc, router, next])

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
