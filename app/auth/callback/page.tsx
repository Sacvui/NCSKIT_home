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
            const next = searchParams.get('next') || '/analyze'
            const error = searchParams.get('error')
            const errorDescription = searchParams.get('error_description')

            // Handle URL-based errors
            if (error) {
                console.error('[AuthCallback] URL Error:', error, errorDescription)
                if (isMounted) router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
                return
            }

            // Prevent double-firing in Strict Mode
            if (code && (processedCode.current === code)) {
                console.log('[AuthCallback] Code already processing or processed, skipping...');
                return;
            }
            if (code) processedCode.current = code;

            const supabase = getSupabase()

            // 1. No Code: Just check session and redirect
            if (!code) {
                const { data } = await supabase.auth.getSession()
                if (data?.session) {
                    if (isMounted) router.replace(next)
                } else {
                    if (isMounted) router.replace('/login')
                }
                return
            }

            // 2. Exchange Code
            try {
                setStatus('Đang xác thực bảo mật...')
                console.log('[AuthCallback] Exchanging code for session...');

                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (exchangeError) {
                    // Check if it's already been exchanged (common with rapid refreshes)
                    if (exchangeError.message?.includes('both use and code_challenge') ||
                        exchangeError.message?.includes('already been used')) {
                        console.log('[AuthCallback] Code already used, checking for existing session...');
                        const { data: sessionData } = await supabase.auth.getSession();
                        if (sessionData?.session && isMounted) {
                            router.replace(next);
                            return;
                        }
                    }
                    throw exchangeError;
                }

                if (data?.session) {
                    console.log('[AuthCallback] Exchange successful');
                    setStatus('Đăng nhập thành công! Đang vào ứng dụng...')
                    if (isMounted) {
                        router.refresh()
                        router.replace(next)
                    }
                } else {
                    throw new Error('Không có phiên đăng nhập khả dụng')
                }

            } catch (err: any) {
                // If the error is an AbortError, it might be because the component unmounted 
                // or React Strict Mode killed the first request. 
                // We should check if we actually have a session before showing error.
                if (err.name === 'AbortError') {
                    console.warn('[AuthCallback] Exchange aborted, checking if session exists anyway...');
                    const { data } = await supabase.auth.getSession();
                    if (data?.session && isMounted) {
                        router.replace(next);
                        return;
                    }
                    return; // Don't redirect yet, let another effect/attempt handle it
                }

                console.error('[AuthCallback] Exchange failed:', err)

                // Quick session check fallback
                const { data: recovery } = await supabase.auth.getSession()
                if (recovery?.session) {
                    console.log('[AuthCallback] Found session after error, redirecting...');
                    if (isMounted) {
                        router.refresh()
                        router.replace(next)
                    }
                    return
                }

                // If truly failed and not aborted
                if (isMounted) {
                    setStatus('Đăng nhập thất bại. Đang chuyển hướng...')
                    setTimeout(() => {
                        if (isMounted) router.push(`/login?error=${encodeURIComponent(err.message || 'Lỗi đăng nhập')}`)
                    }, 1500)
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
