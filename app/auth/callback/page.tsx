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
        const handleAuthCallback = async () => {
            const code = searchParams.get('code')
            const next = searchParams.get('next') || '/profile'
            const error = searchParams.get('error')
            const errorDescription = searchParams.get('error_description')

            // Prevent double processing in Strict Mode
            if (code && processedCode.current === code) {
                console.log('Code already processing/processed, skipping.');
                return;
            }
            if (code) processedCode.current = code;

            if (error) {
                console.error('Auth error:', error, errorDescription)
                router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
                return
            }

            const supabase = getSupabase()

            if (!code) {
                // Check if session exists (implicit/recovery)
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    console.log('Session found (no code), redirecting to:', next)
                    router.push(next)
                } else {
                    console.warn('No code or session found')
                    router.push('/login')
                }
                return
            }

            try {
                console.log('Exchanging code for session...')
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (exchangeError) {
                    console.error('Session exchange error:', exchangeError)

                    // Robust check: If session exists, ignore the error (possibly double-invoke race)
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session) {
                        console.log('Session valid despite exchange error. Proceeding.')
                        router.refresh()
                        router.push(next)
                        return
                    }

                    // Special handling for AbortError/Signal Aborted
                    if (exchangeError.message?.includes('aborted') || exchangeError.name === 'AbortError') {
                        console.warn('Request aborted, likely navigation or race. Checking session one last time.')
                        const { data: { session: retrySession } } = await supabase.auth.getSession()
                        if (retrySession) {
                            router.push(next)
                            return
                        }
                    }

                    router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
                    return
                }

                console.log('Session established, redirecting to:', next)
                router.refresh()
                router.push(next)

            } catch (err: any) {
                console.error('Unexpected auth error:', err)
                // Just in case, check session again before failing hard
                const { data: { session } } = await supabase.auth.getSession()
                if (session) {
                    router.push(next)
                    return
                }
                router.push(`/login?error=${encodeURIComponent(err.message)}`)
            }
        }

        handleAuthCallback()
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
