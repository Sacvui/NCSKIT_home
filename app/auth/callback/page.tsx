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

            // Helper: Retry logic for flaky operations
            const safeSupabaseCall = async<T>(fn: () => Promise<T>, retries = 3): Promise<T | null > => {
            try {
                return await fn();
            } catch (e: any) {
                if ((e.name === 'AbortError' || e.message?.includes('aborted')) && retries > 0) {
                    console.warn(`[AuthCallback] Operation aborted, retrying... (${retries})`);
                    await new Promise(r => setTimeout(r, 500));
                    return safeSupabaseCall(fn, retries - 1);
                }
                console.error('[AuthCallback] Supabase call failed:', e);
                return null; // Return null on failure instead of throwing
            }
        };

        if (code && processedCode.current === code) return;
        if (code) processedCode.current = code;

        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        if (error) {
            console.error('Auth error:', error, errorDescription)
            if (isMounted) router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
            return
        }

        const supabase = getSupabase()

        // 1. If NO Code: Check Session
        if (!code) {
            const sessionResult = await safeSupabaseCall(() => supabase.auth.getSession());
            if (sessionResult?.data?.session) {
                console.log('Session found (no code), redirecting to:', next)
                if (isMounted) router.push(next)
            } else {
                console.warn('No code or session found')
                if (isMounted) router.push('/login')
            }
            return
        }

        // 2. Exchange Code
        try {
            console.log('Exchanging code for session...')
            let exchangeData = null;
            let exchangeError = null;

            // Manual retry loop for specific exchange call to capture error
            for (let i = 0; i < 3; i++) {
                try {
                    const res = await supabase.auth.exchangeCodeForSession(code);
                    exchangeData = res.data;
                    exchangeError = res.error;
                    if (!exchangeError || i === 2) break; // Success or last attempt
                    if (exchangeError.message?.includes('aborted')) throw exchangeError; // Force retry logic
                } catch (e) {
                    console.warn(`Retry attempt ${i + 1} for exchange:`, e);
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            if (exchangeError) {
                console.error('Session exchange error:', exchangeError)
                // Recovery: Check if session exists anyway
                const sessionResult = await safeSupabaseCall(() => supabase.auth.getSession());
                if (sessionResult?.data?.session) {
                    console.log('Session valid despite exchange error. Proceeding.')
                    if (isMounted) {
                        router.refresh()
                        router.push(next)
                    }
                    return
                }

                if (isMounted) router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
                return
            }

            console.log('Session established, redirecting to:', next)
            if (isMounted) {
                router.refresh()
                router.push(next)
            }

        } catch (err: any) {
            console.error('Unexpected auth error:', err)
            try {
                // Safe recovery check
                const sessionResult = await safeSupabaseCall(() => supabase.auth.getSession());
                if (sessionResult?.data?.session) {
                    if (isMounted) router.push(next)
                } else {
                    if (isMounted) router.push(`/login?error=${encodeURIComponent(err.message || 'Unknown error')}`)
                }
            } catch (innerErr) {
                console.error('Fatal recovery error:', innerErr);
                if (isMounted) router.push('/login')
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
