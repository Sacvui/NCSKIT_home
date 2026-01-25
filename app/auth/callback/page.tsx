'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'
import { NCSLoader } from '@/components/ui/NCSLoader'

// MODULE-LEVEL: Persists across React re-mounts in Strict Mode
let authAttempted = false
let authPromise: Promise<void> | null = null

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/analyze'
    const errorParam = searchParams.get('error')
    const errorDesc = searchParams.get('error_description')

    const [status, setStatus] = useState('Đang kết nối...')

    useEffect(() => {
        // Handle OAuth errors
        if (errorParam) {
            console.error('[Callback] Auth Error:', errorParam, errorDesc)
            setStatus(`Lỗi: ${errorDesc || errorParam}`)
            setTimeout(() => router.push('/login'), 3000)
            return
        }

        // If auth already in progress, wait for it
        if (authPromise) {
            console.log('[Callback] Auth already in progress, waiting...')
            authPromise.then(() => {
                // Check if we have session now
                getSupabase().auth.getSession().then(({ data: { session } }) => {
                    if (session) {
                        router.replace(next)
                    }
                })
            })
            return
        }

        // If already attempted, just check session and redirect
        if (authAttempted) {
            console.log('[Callback] Auth already attempted, checking session...')
            getSupabase().auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    setStatus('Đăng nhập thành công!')
                    router.replace(next)
                } else {
                    setStatus('Phiên đăng nhập đã xử lý.')
                    setTimeout(() => router.push('/login'), 2000)
                }
            })
            return
        }

        // First time - mark attempted and run auth
        authAttempted = true

        const handleAuth = async () => {
            const supabase = getSupabase()

            try {
                // 1. Check existing session first
                const { data: { session: existingSession } } = await supabase.auth.getSession()

                if (existingSession) {
                    console.log('[Callback] Session exists! Redirecting...')
                    setStatus('Đăng nhập thành công!')
                    router.replace(next)
                    return
                }

                // 2. Try manual exchange if we have code
                if (code) {
                    console.log('[Callback] Exchanging code for session...')
                    setStatus('Đang xác thực bảo mật...')

                    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

                    if (error) {
                        console.error('[Callback] Exchange error:', error.message)

                        // Check if session was established anyway
                        const { data: { session: retrySession } } = await supabase.auth.getSession()
                        if (retrySession) {
                            console.log('[Callback] Session found after error')
                            setStatus('Đăng nhập thành công!')
                            router.replace(next)
                            return
                        }

                        setStatus('Lỗi xác thực. Đang thử lại...')
                        setTimeout(() => router.push('/login'), 3000)
                        return
                    }

                    if (data.session) {
                        console.log('[Callback] Exchange success!')
                        setStatus('Đăng nhập thành công!')
                        router.replace(next)
                        return
                    }
                }

                // 3. Wait and check again (auto-detect delay)
                setStatus('Đang chờ xác thực...')
                await new Promise(r => setTimeout(r, 2000))

                const { data: { session: delayedSession } } = await supabase.auth.getSession()
                if (delayedSession) {
                    setStatus('Đăng nhập thành công!')
                    router.replace(next)
                    return
                }

                // 4. Failed - redirect to login
                setStatus('Không thể xác thực. Vui lòng thử lại.')
                setTimeout(() => router.push('/login'), 2000)

            } catch (err: any) {
                // Ignore AbortError - let the second mount handle it
                if (err.name === 'AbortError') {
                    console.log('[Callback] AbortError - will retry on next mount')
                    authAttempted = false // Allow retry
                    return
                }

                console.error('[Callback] Error:', err)
                setStatus('Đã xảy ra lỗi.')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        authPromise = handleAuth()
        authPromise.finally(() => {
            authPromise = null
        })

    }, [code, next, errorParam, errorDesc, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe]">
            <NCSLoader text={status} size="lg" />
        </div>
    )
}

// Reset module state on page unload (for fresh login attempts)
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        authAttempted = false
        authPromise = null
    })
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
