'use client'

import { getSupabase } from '@/utils/supabase/client'
import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProjectFlowAnimation } from '@/components/login/ProjectFlowAnimation'
import { Loader2, Info, RefreshCw } from 'lucide-react'
import { NCSLoader } from '@/components/ui/NCSLoader'
import { getStoredLocale } from '@/lib/i18n'
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {/* Disabled WebR Preloader to prevent interfering with Auth flow */}
            {/* <WebRPreloader /> */}
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next')
    const [loading, setLoading] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [locale, setLocale] = useState('vi')
    const isVi = locale === 'vi'

    useEffect(() => {
        setLocale(getStoredLocale())
    }, [])

    const handleHardReset = async () => {
        setLoading('reset')
        try {
            // 1. Clear all cookies for both current domain and .ncskit.org
            const cookies = document.cookie.split(';')
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i]
                const eqPos = cookie.indexOf('=')
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
                
                // Clear from current host
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
                // Clear from .ncskit.org
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.ncskit.org;`
            }

            // 2. Clear storage
            localStorage.clear()
            sessionStorage.clear()

            console.log('Session hard reset complete')
            // 3. Reload
            window.location.href = window.location.origin + window.location.pathname
        } catch (err) {
            console.error('Hard reset error:', err)
            setLoading(null)
        }
    }

    // Real OAuth flow with Supabase
    const handleLogin = async (provider: 'google' | 'linkedin_oidc') => {
        console.log('Login initiated for provider:', provider)
        setLoading(provider)
        setErrorMsg(null)
        try {
            const supabase = getSupabase()
            const origin = window.location.origin
            const isLocalhost = origin.includes('localhost')
            // Only force the primary production domain if we are clearly on a production sub-environment
            const siteUrl = isLocalhost ? origin : origin.replace('stat.ncskit.org', 'ncsstat.ncskit.org')
            // Bypass the server-side /auth/callback route entirely to avoid Next.js cookie issues
            // By redirecting directly to the client page, @supabase/ssr createBrowserClient will automatically 
            // intercept the `?code=` URL parameter and complete the PKCE flow reliably in the browser.
            const redirectTo = `${siteUrl}${next || '/analyze'}`
            console.log('[Login Debug] Initiating Auth Flow:', {
                provider,
                origin,
                siteUrl,
                redirectTo,
                isHttps: window.location.protocol === 'https:',
            })

            // Provider-specific options
            const providerOptions: any = { redirectTo }
            
            if (provider === 'google') {
                providerOptions.queryParams = {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            } else if (provider === 'linkedin_oidc') {
                // LinkedIn OIDC requires specific scopes to return the user email.
                // We omit Google-specific offline/consent params as they cause issues.
                providerOptions.scopes = 'openid profile email'
            }

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: providerOptions,
            })

            if (error) {
                console.error('[Login Debug] OAuth error caught:', error)
                setErrorMsg(`Auth Error: ${error.message} (${error.name})`)
                setLoading(null)
            } else {
                console.log('[Login Debug] OAuth redirect data:', data)
                if (data.url) {
                    console.log('[Login Debug] Manual redirecting to Supabase flow:', data.url)
                    window.location.href = data.url
                }
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setErrorMsg(err.message || 'Đã xảy ra lỗi khi đăng nhập')
            setLoading(null)
        }
    }

    return (
        <div className="h-screen w-screen overflow-hidden bg-white flex">
            {/* Left Column: Login Form */}
            <div className="w-full lg:w-1/3 flex items-center justify-center p-8 lg:p-12 border-r border-gray-100 relative z-20 bg-white h-full overflow-y-auto">
                <div className="w-full max-w-sm space-y-8 py-10">
                    {/* Beta Disclaimer Banner */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-xs text-orange-800 mb-6 flex items-start gap-2">
                        <span className="font-bold uppercase bg-orange-200 text-orange-800 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0 mt-0.5">BETA</span>
                        <p>
                            Hệ thống đang thử nghiệm. Vui lòng đọc <a href="/legal/disclaimer" target="_blank" className="font-bold underline hover:text-orange-950">Tuyên bố miễn trừ trách nhiệm</a> trước khi sử dụng.
                        </p>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <img className="mx-auto h-16 w-auto mb-6" src="/logo.svg" alt="ncsStat" />
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to unlock the power of advanced statistics
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        {errorMsg && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                {errorMsg}
                            </div>
                        )}

                        {/* Google */}
                        <button
                            disabled={!!loading}
                            onClick={() => handleLogin('google')}
                            className={`group relative w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 text-base font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                ${loading === 'google' ? 'bg-gray-50 scale-[0.98]' : 'bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'}
                                ${loading && loading !== 'google' ? 'opacity-50 grayscale' : ''}
                            `}
                        >
                            {loading === 'google' ? (
                                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            ) : (
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span>{loading === 'google' ? 'Redirecting to Google...' : 'Continue with Google'}</span>
                        </button>

                        {/* LinkedIn - Temporarily disabled due to VN ISP blocking */}
                        <button
                            disabled={true}
                            type="button"
                            className="group relative w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 text-base font-medium rounded-xl bg-gray-50 opacity-60 grayscale cursor-not-allowed"
                            title={isVi ? "LinkedIn đang bị chặn bởi nhiều nhà mạng tại VN" : "LinkedIn is blocked by ISPs in Vietnam"}
                        >
                            <svg className="h-5 w-5 fill-current text-gray-500" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <span className="text-gray-500 leading-tight">
                                {isVi ? 'Đăng nhập LinkedIn (Tạm bảo trì do mạng VN)' : 'Continue with LinkedIn (Network restricted)'}
                            </span>
                        </button>

                        {/* Text Carousel for Context (Only show when loading) */}
                        {loading && (
                            <div className="pt-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <LoadingState context={loading} />
                            </div>
                        )}

                        {/* ORCID Login - Now Enabled */}
                        {/* ORCID Login - Temporarily Disabled */}
                        <button
                            disabled={true}
                            className="group relative w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 text-base font-medium rounded-xl bg-gray-50 opacity-60 grayscale cursor-not-allowed"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#A6CE39">
                                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.948.948 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.306v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.212-3.722-4.097-3.722h-2.222z" />
                            </svg>
                            <span className="text-gray-500">Đăng nhập với ORCID (Đang bảo trì)</span>
                        </button>
                    </div>

                    {/* Hard Reset Link for Persistent Errors */}
                    {(searchParams.get('error') || searchParams.get('auth_code')) && (
                        <div className="mt-8 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
                            <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                {isVi ? 'Gặp sự cố đăng nhập?' : 'Having login issues?'}
                            </h4>
                            <p className="text-xs text-blue-700/70 mb-3 leading-relaxed">
                                {isVi 
                                    ? 'Nếu bạn liên tục gặp lỗi xác định mã PKCE, hệ thống có thể đang lưu giữ phiên làm việc cũ bị lỗi.' 
                                    : 'If you consistently see PKCE errors, your browser might be holding a stale session.'}
                            </p>
                            <button 
                                onClick={handleHardReset}
                                className="w-full py-2.5 px-4 bg-white border border-blue-200 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loading === 'reset' ? 'animate-spin' : ''}`} />
                                {isVi ? 'Dọn dẹp & Làm mới ngay' : 'Clean session & Reset now'}
                            </button>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400 font-light leading-relaxed">
                            Secured by Supabase and ncsStat Scientific Core. <br />
                            By signing in, you agree to our <a href="#" className="underline hover:text-gray-600">Terms</a> & <a href="#" className="underline hover:text-gray-600">Privacy</a>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Animation (2/3 width on desktop, hidden on mobile) */}
            <div className="hidden lg:block lg:w-2/3 bg-gray-900 relative overflow-hidden h-full">
                {/* Trigger Release: 2026-01-22-09-20 */}
                <ProjectFlowAnimation />
            </div>
        </div>
    )
}

function LoadingState({ context }: { context?: string }) {
    const [textIndex, setTextIndex] = useState(0)
    const texts = [
        "Initializing Scientific Core...",
        "Establishing Secure Connection...",
        "Loading R Statistical Engine...",
        "Verifying User Credentials...",
        "Preparing Analytics Workspace..."
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % texts.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [texts.length])

    return (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
            <NCSLoader size="lg" />

            <div className="h-8">
                <p className="text-sm font-medium text-blue-600 animate-pulse">
                    {texts[textIndex]}
                </p>
            </div>
        </div>
    )
}
