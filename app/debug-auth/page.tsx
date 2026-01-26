'use client'

import { useEffect, useState } from 'react'
import { debugAuthClient, formatAuthDebug, AuthDebugInfo } from '@/lib/auth-debug'

export default function DebugAuthPage() {
    const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null)
    const [serverDebug, setServerDebug] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const runDebug = async () => {
            try {
                // Client-side debug
                const clientInfo = await debugAuthClient()
                setDebugInfo(clientInfo)

                // Server-side debug via API
                try {
                    const response = await fetch('/api/debug-auth')
                    const serverData = await response.json()
                    setServerDebug(serverData)
                } catch (serverError: any) {
                    console.warn('Server debug failed:', serverError)
                    setServerDebug({ error: 'Server debug unavailable: ' + serverError.message })
                }

            } catch (error: any) {
                console.error('Debug error:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        runDebug()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Đang kiểm tra authentication...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50">
                <h1 className="text-xl font-bold text-red-800 mb-4">🚨 Debug Error</h1>
                <p className="text-red-600">{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 font-mono text-xs overflow-auto h-screen bg-gray-50">
            <h1 className="text-xl font-bold mb-4">🔍 Auth Debug Tool</h1>

            {/* Quick Status */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">📊 Quick Status</h2>
                <div className="bg-white p-4 border rounded grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Client-side</h3>
                        <div className="space-y-1">
                            <div>Supabase Session: {debugInfo?.hasSupabaseSession ? '✅' : '❌'}</div>
                            <div>ORCID Cookie: {debugInfo?.hasOrcidCookie ? '✅' : '❌'}</div>
                            <div>Errors: {debugInfo?.errors.length || 0}</div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Server-side</h3>
                        <div className="space-y-1">
                            <div>Supabase Session: {serverDebug?.debug?.hasSupabaseSession ? '✅' : '❌'}</div>
                            <div>ORCID Cookie: {serverDebug?.debug?.hasOrcidCookie ? '✅' : '❌'}</div>
                            <div>Profile Valid: {serverDebug?.debug?.profileExists ? '✅' : '❌'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Debug */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">💻 Client-side Debug</h2>
                <pre className="bg-white p-4 border rounded text-xs overflow-auto">
                    {debugInfo ? formatAuthDebug(debugInfo) : 'Loading...'}
                </pre>
            </section>

            {/* Server Debug */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">🖥️ Server-side Debug</h2>
                <pre className="bg-white p-4 border rounded text-xs overflow-auto">
                    {serverDebug?.formatted || JSON.stringify(serverDebug, null, 2)}
                </pre>
            </section>

            {/* Raw Data */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">📋 Raw Debug Data</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">Client Raw</h3>
                        <pre className="bg-white p-4 border rounded text-xs overflow-auto max-h-96">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Server Raw</h3>
                        <pre className="bg-white p-4 border rounded text-xs overflow-auto max-h-96">
                            {JSON.stringify(serverDebug, null, 2)}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Cookie Analysis */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">🍪 Cookie Analysis</h2>
                <div className="bg-white p-4 border rounded">
                    {typeof document !== 'undefined' && document.cookie ? (
                        <div className="space-y-2">
                            {document.cookie.split('; ').map((cookie, i) => {
                                const [name, value] = cookie.split('=')
                                const isAuthRelated = name.includes('sb-') || name.includes('orcid') || name.includes('auth')
                                return (
                                    <div key={i} className={`p-2 rounded ${isAuthRelated ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                                        <div className="font-semibold">{name}</div>
                                        <div className="text-xs text-gray-600 break-all">{value}</div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="text-red-500">No cookies found</div>
                    )}
                </div>
            </section>

            {/* Actions */}
            <section className="mb-8">
                <h2 className="font-bold border-b mb-2">🔧 Quick Actions</h2>
                <div className="bg-white p-4 border rounded space-y-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
                    >
                        🔄 Refresh Debug
                    </button>
                    <button
                        onClick={() => {
                            document.cookie.split(";").forEach(c => {
                                const eqPos = c.indexOf("=");
                                const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
                                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                            });
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-2"
                    >
                        🗑️ Clear All Cookies
                    </button>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 mr-2"
                    >
                        🧹 Clear Storage
                    </button>
                    <a
                        href="/login"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        🔑 Go to Login
                    </a>
                </div>
            </section>

            {/* Environment Info */}
            <section>
                <h2 className="font-bold border-b mb-2">🌍 Environment</h2>
                <pre className="bg-white p-4 border rounded text-xs">
                    {JSON.stringify({
                        origin: typeof window !== 'undefined' ? window.location.origin : 'N/A',
                        protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
                        host: typeof window !== 'undefined' ? window.location.host : 'N/A',
                        NODE_ENV: process.env.NODE_ENV,
                        VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
                        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                    }, null, 2)}
                </pre>
            </section>
        </div>
    )
}
