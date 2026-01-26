'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabase } from '@/utils/supabase/client'

export default function TestCallbackPage() {
    const searchParams = useSearchParams()
    const [logs, setLogs] = useState<string[]>([])
    const [sessionData, setSessionData] = useState<any>(null)

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString()
        setLogs(prev => [...prev, `${timestamp}: ${message}`])
        console.log(`[Test Callback] ${message}`)
    }

    useEffect(() => {
        testCallback()
    }, [])

    const testCallback = async () => {
        addLog('Starting callback test...')
        
        // Check URL parameters
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')
        
        addLog(`URL params - code: ${code ? 'present' : 'missing'}, error: ${error || 'none'}, state: ${state || 'none'}`)

        if (error) {
            addLog(`❌ OAuth error: ${error}`)
            return
        }

        if (!code) {
            addLog('⚠️ No authorization code in URL - this page should be accessed via OAuth callback')
            addLog('Testing current session instead...')
        }

        try {
            const supabase = getSupabase()
            addLog('Created Supabase client')

            // Check current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            addLog(`Session check - hasSession: ${!!session}, error: ${sessionError?.message || 'none'}`)

            if (session) {
                addLog(`✅ Session found - user: ${session.user.email}`)
                addLog(`Session expires: ${new Date(session.expires_at! * 1000).toISOString()}`)
                setSessionData(session)
            } else {
                addLog('❌ No session found')
            }

            // If we have a code, try to exchange it
            if (code) {
                addLog('Attempting to exchange code for session...')
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
                
                if (exchangeError) {
                    addLog(`❌ Exchange error: ${exchangeError.message}`)
                } else if (data.session) {
                    addLog(`✅ Exchange successful - user: ${data.session.user.email}`)
                    setSessionData(data.session)
                } else {
                    addLog('⚠️ Exchange completed but no session returned')
                }
            }

            // Test API call
            addLog('Testing authenticated API call...')
            const response = await fetch('/api/test-session')
            const apiResult = await response.json()
            addLog(`API test - success: ${apiResult.success}, hasSession: ${apiResult.data?.hasSession}`)

        } catch (error: any) {
            addLog(`❌ Error: ${error.message}`)
        }
    }

    const simulateLogin = async (provider: 'google' | 'linkedin_oidc') => {
        addLog(`Starting ${provider} login simulation...`)
        try {
            const supabase = getSupabase()
            const redirectTo = `${window.location.origin}/test-callback`
            
            addLog(`Redirect URL: ${redirectTo}`)
            
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: redirectTo,
                },
            })

            if (error) {
                addLog(`❌ OAuth error: ${error.message}`)
            } else {
                addLog('🔄 Redirecting to OAuth provider...')
            }
        } catch (error: any) {
            addLog(`❌ Login error: ${error.message}`)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🧪 Callback Test Page</h1>
                
                {/* Current Session */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current Session</h2>
                    {sessionData ? (
                        <div className="space-y-2">
                            <div>✅ <strong>Authenticated:</strong> {sessionData.user.email}</div>
                            <div>🕒 <strong>Expires:</strong> {new Date(sessionData.expires_at * 1000).toLocaleString()}</div>
                            <div>🆔 <strong>User ID:</strong> {sessionData.user.id}</div>
                            <div>🔑 <strong>Provider:</strong> {sessionData.user.app_metadata?.provider || 'unknown'}</div>
                        </div>
                    ) : (
                        <div className="text-red-600">❌ No active session</div>
                    )}
                </div>

                {/* Test Actions */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => simulateLogin('google')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            🔵 Test Google
                        </button>
                        <button
                            onClick={() => simulateLogin('linkedin_oidc')}
                            className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900"
                        >
                            🔗 Test LinkedIn
                        </button>
                        <button
                            onClick={testCallback}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            🔄 Refresh Test
                        </button>
                        <a
                            href="/analyze?debug=skip"
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
                        >
                            🚀 Skip to Analyze
                        </a>
                    </div>
                </div>

                {/* Logs */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Test Logs</h2>
                    <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1">{log}</div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-gray-500">No logs yet...</div>
                        )}
                    </div>
                    <button
                        onClick={() => setLogs([])}
                        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Clear Logs
                    </button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold text-blue-800 mb-2">How to use this page:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>1. Click "Test Google" or "Test LinkedIn" to start OAuth flow</li>
                        <li>2. Complete OAuth on provider site</li>
                        <li>3. You'll be redirected back here with callback data</li>
                        <li>4. Check logs to see what happened during the process</li>
                        <li>5. If session is created, try "Skip to Analyze" to test protected route</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}