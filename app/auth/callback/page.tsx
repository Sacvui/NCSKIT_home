'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientOnly } from '@/utils/supabase/client-only'
import { Loader2 } from 'lucide-react'

function AuthCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Sometimes the code comes as a query param, sometimes hash (implicit), but for PKCE flow it's usually query
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/analyze'
    const errorParam = searchParams.get('error')

    const [status, setStatus] = useState('Đang xử lý đăng nhập...')

    useEffect(() => {
        const handleAuth = async () => {
            if (errorParam) {
                setStatus(`Lỗi: ${errorParam}`)
                setTimeout(() => router.push('/login'), 2000)
                return
            }

            if (!code) {
                console.log('No code found, redirecting to login')
                router.push('/login?error=no_code_client')
                return
            }

            // localStorage-first: Only use localStorage client for PKCE exchange
            const clientOnly = createClientOnly()

            try {
                console.log('[Auth] Exchanging code via localStorage client...')
                const { data, error } = await clientOnly.auth.exchangeCodeForSession(code)

                if (error) throw error

                if (data.session) {
                    console.log('[Auth] Success! User:', data.session.user.id)
                    setStatus('Đăng nhập thành công!')

                    // Instant redirect - no cookie sync needed!
                    // Pages will check localStorage client for session
                    window.location.href = next
                }
            } catch (error: any) {
                console.error('[Auth] Error:', error)
                router.push(`/login?error=${encodeURIComponent(error.message)}`)
            }
        }

        handleAuth()
    }, [code, next, errorParam, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe] text-gray-600">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold">{status}</h2>
            <p className="text-sm text-gray-400 mt-2">Dữ liệu đang được xác thực trực tiếp trên trình duyệt...</p>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafe] text-gray-600">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <h2 className="text-xl font-semibold">Đang tải...</h2>
            </div>
        }>
            <AuthCallbackContent />
        </Suspense>
    )
}
