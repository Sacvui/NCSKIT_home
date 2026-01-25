'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
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

    // Simple polling approach - let Supabase handle detectSessionInUrl automatically
    const checkSession = useCallback(async () => {
        const supabase = getSupabase()
        const { data: { session } } = await supabase.auth.getSession()
        return session
    }, [])

    useEffect(() => {
        // Handle OAuth errors
        if (errorParam) {
            console.error('[Callback] OAuth Error:', errorParam, errorDesc)
            setStatus(`Lỗi: ${errorDesc || errorParam}`)
            setTimeout(() => router.push('/login'), 3000)
            return
        }

        let mounted = true
        let attempts = 0
        const maxAttempts = 15 // 15 attempts * 1s = 15 seconds max

        const pollSession = async () => {
            while (mounted && attempts < maxAttempts) {
                attempts++
                console.log(`[Callback] Checking session (attempt ${attempts}/${maxAttempts})...`)

                try {
                    const session = await checkSession()

                    if (session) {
                        console.log('[Callback] Session found! Redirecting to:', next)
                        setStatus('Đăng nhập thành công!')

                        // Small delay for UX
                        await new Promise(r => setTimeout(r, 500))

                        if (mounted) {
                            router.replace(next)
                        }
                        return
                    }
                } catch (err: any) {
                    // Ignore errors, just keep polling
                    console.log('[Callback] Session check error:', err.message)
                }

                // Wait 1 second before next attempt
                await new Promise(r => setTimeout(r, 1000))
            }

            // Max attempts reached without finding session
            if (mounted) {
                console.log('[Callback] Timeout - no session found')
                setStatus('Không thể xác thực. Vui lòng thử lại.')
                setTimeout(() => router.push('/login'), 2000)
            }
        }

        // Start polling after a small delay (let Supabase process the URL)
        const timeoutId = setTimeout(pollSession, 500)

        return () => {
            mounted = false
            clearTimeout(timeoutId)
        }
    }, [errorParam, errorDesc, router, next, checkSession])

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
