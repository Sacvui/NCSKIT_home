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

    const [status, setStatus] = useState('Đang xử lý đăng nhập...')

    useEffect(() => {
        // Handle error from OAuth provider
        if (errorParam) {
            setStatus(`Lỗi: ${errorParam}`)
            setTimeout(() => router.push('/login'), 2000)
            return
        }

        const supabase = getSupabase()

        // With detectSessionInUrl: true, Supabase auto-processes the code
        // We just need to wait for the session to be ready
        const checkSession = async () => {
            try {
                // Give Supabase a moment to process the URL
                await new Promise(resolve => setTimeout(resolve, 500))

                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('[Callback] Session error:', error)
                    setStatus('Lỗi xác thực: ' + error.message)
                    setTimeout(() => router.push('/login'), 2000)
                    return
                }

                if (session) {
                    console.log('[Callback] Session ready! User:', session.user.id)
                    router.replace(next)
                } else {
                    // Session not ready yet, try listening for auth state change
                    console.log('[Callback] Waiting for session...')
                    setStatus('Đang hoàn tất xác thực...')

                    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                        console.log('[Callback] Auth event:', event)
                        if (event === 'SIGNED_IN' && session) {
                            subscription.unsubscribe()
                            router.replace(next)
                        }
                    })

                    // Timeout after 10 seconds
                    setTimeout(() => {
                        subscription.unsubscribe()
                        setStatus('Xác thực timeout. Vui lòng thử lại.')
                        setTimeout(() => router.push('/login'), 2000)
                    }, 10000)
                }
            } catch (err: any) {
                console.error('[Callback] Error:', err)
                setStatus('Đã xảy ra lỗi: ' + err.message)
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        checkSession()
    }, [errorParam, next, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe] text-gray-600">
            <NCSLoader text={status} size="lg" />
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe]">
                <NCSLoader text="Đang kết nối..." size="lg" />
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    )
}
