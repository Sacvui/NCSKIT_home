'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState('Processing authentication...')

    const processedCode = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const handleAuthCallback = async () => {
            const code = searchParams.get('code')
            const next = searchParams.get('next') || '/profile'
            const error = searchParams.get('error')
            const errorDescription = searchParams.get('error_description')

            // Handle URL-based errors
            if (error) {
                console.error('[AuthCallback] URL Error:', error, errorDescription)
                if (isMounted) router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
                return
            }

            // Prevent double-firing in Strict Mode
            if (code && processedCode.current === code) {
                console.log('[AuthCallback] Code already processing, skipping...')
                return;
            }
            if (code) processedCode.current = code;

            const supabase = getSupabase()

            // 1. No Code: Just check session and redirect
            if (!code) {
                const { data } = await supabase.auth.getSession()
                if (data?.session) {
                    if (isMounted) router.push(next)
                } else {
                    if (isMounted) router.push('/login')
                }
                return
            }

            // 2. Exchange Code
            try {
                setStatus('Đang xác thực bảo mật...')

                // Direct exchange - simpler and faster
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (exchangeError) throw exchangeError

                if (data?.session) {
                    setStatus('Đăng nhập thành công! Đang vào ứng dụng...')
                    if (isMounted) {
                        router.refresh() // Clear cache
                        router.replace(next) // Go to destination immediately
                    }
                } else {
                    throw new Error('Phiên đăng nhập không hợp lệ (No session)')
                }

            } catch (err: any) {
                console.error('[AuthCallback] Exchange failed:', err)

                // Quick Recovery: Maybe session was set despite error?
                const { data: recovery } = await supabase.auth.getSession()
                if (recovery?.session) {
                    if (isMounted) {
                        router.refresh()
                        router.replace(next)
                    }
                    return
                }

                // If truly failed
                setStatus('Đăng nhập thất bại. Đang thử lại...')
                if (isMounted) {
                    setTimeout(() => {
                        router.push(`/login?error=${encodeURIComponent(err.message || 'Lỗi đăng nhập')}`)
                    }, 2000)
                }
            }
        }

        handleAuthCallback()
        return () => { isMounted = false }
    }, [router, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-gray-600 font-medium">{status}</p>
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    )
}
