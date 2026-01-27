'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

function CallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState('Processing authentication...')

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code')
            const next = searchParams.get('next') || '/profile'
            const error = searchParams.get('error')
            const errorDescription = searchParams.get('error_description')

            if (error) {
                console.error('Auth error:', error, errorDescription)
                router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
                return
            }

            if (!code) {
                // If no code, check if we already have a session (implicit flow or existing session)
                const supabase = getSupabase()
                const { data: { session } } = await supabase.auth.getSession()

                if (session) {
                    console.log('Session found, redirecting to:', next)
                    router.push(next)
                } else {
                    console.warn('No code or session found')
                    // Just redirect to login if nothing present
                    router.push('/login')
                }
                return
            }

            try {
                const supabase = getSupabase()
                console.log('Exchanging code for session...')
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

                if (exchangeError) {
                    console.error('Session exchange error:', exchangeError)

                    // Check if code was used but session exists
                    const { data: { session } } = await supabase.auth.getSession()
                    if (session) {
                        console.log('Session exists despite error, proceeding.')
                        router.push(next)
                        return
                    }

                    router.push(`/login?error=${encodeURIComponent(exchangeError.message)}`)
                    return
                }

                console.log('Session established, redirecting to:', next)
                router.refresh() // Refresh to update any server components if mixed
                router.push(next)

            } catch (err: any) {
                console.error('Unexpected auth error:', err)
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
