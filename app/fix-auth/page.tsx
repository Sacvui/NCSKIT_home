'use client'

import { useState } from 'react'

export default function FixAuthPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const attemptAutoFix = async () => {
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('/api/fix-supabase-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            
            if (data.success) {
                setResult(data)
            } else {
                setError(data.error)
                setResult(data)
            }
        } catch (err: any) {
            setError('Failed to connect to fix API: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const testAuth = async () => {
        window.open('/test-callback', '_blank')
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔧 Fix Authentication Issues</h1>

                {/* Current Issue */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-red-800 mb-4">🚨 Current Issue</h2>
                    <div className="space-y-2 text-red-700">
                        <div>❌ <strong>NEXT_REDIRECT Error:</strong> Fixed - removed incorrect redirect usage</div>
                        <div>❌ <strong>no_session Error:</strong> Supabase Dashboard configuration needed</div>
                        <div>❌ <strong>OAuth Flow Failing:</strong> Site URL and Redirect URLs not configured</div>
                    </div>
                </div>

                {/* Auto Fix Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">🤖 Automatic Fix</h2>
                    <p className="text-gray-600 mb-4">
                        Attempt to automatically configure Supabase settings using the Management API.
                        This requires the service role key to be properly configured.
                    </p>
                    
                    <div className="flex gap-4">
                        <button
                            onClick={attemptAutoFix}
                            disabled={loading}
                            className={`px-6 py-3 rounded-lg font-medium ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                                    Fixing...
                                </>
                            ) : (
                                '🔧 Auto Fix Configuration'
                            )}
                        </button>

                        <button
                            onClick={testAuth}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            🧪 Test Authentication
                        </button>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div className={`rounded-lg p-6 mb-6 ${
                        result.success ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        <h3 className={`text-lg font-semibold mb-4 ${
                            result.success ? 'text-green-800' : 'text-yellow-800'
                        }`}>
                            {result.success ? '✅ Configuration Updated' : '⚠️ Manual Configuration Required'}
                        </h3>

                        {result.success ? (
                            <div className="space-y-2 text-green-700">
                                <div>✅ Site URL configured</div>
                                <div>✅ Redirect URLs configured</div>
                                <div>✅ Email confirmations disabled</div>
                                <div className="mt-4">
                                    <strong>Next Steps:</strong>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {result.nextSteps?.map((step: string, i: number) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {result.manualSteps && (
                                    <div>
                                        <p className="text-yellow-700 mb-2">{result.manualSteps.message}</p>
                                        <a
                                            href={result.manualSteps.dashboardUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            🔗 Open Supabase Dashboard
                                        </a>
                                    </div>
                                )}

                                {result.manualFix && (
                                    <div>
                                        <p className="text-yellow-700 mb-2">{result.manualFix.message}</p>
                                        <div className="bg-yellow-100 p-4 rounded">
                                            <strong>Manual Steps:</strong>
                                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                                {result.manualFix.steps?.map((step: string, i: number) => (
                                                    <li key={i} className="text-sm">{step}</li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {result.details && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm font-medium">Technical Details</summary>
                                <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Manual Instructions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">📋 Manual Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">1. Supabase Dashboard Settings</h3>
                            <div className="bg-blue-50 p-4 rounded">
                                <p className="mb-2">Go to: <strong>Authentication → Settings</strong></p>
                                <div className="space-y-1 text-sm">
                                    <div><strong>Site URL:</strong> <code>https://ncsstat.ncskit.org</code></div>
                                    <div><strong>Redirect URLs:</strong></div>
                                    <div className="ml-4">
                                        <div><code>https://ncsstat.ncskit.org/auth/callback</code></div>
                                        <div><code>https://ncsstat.ncskit.org/auth/orcid/callback</code></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">2. OAuth Providers</h3>
                            <div className="bg-green-50 p-4 rounded">
                                <p className="mb-2">Configure Google and LinkedIn with callback URL:</p>
                                <code className="text-sm">https://qshimpxmirkyfenhklfh.supabase.co/auth/v1/callback</code>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">3. Test Configuration</h3>
                            <div className="flex gap-4">
                                <a
                                    href="/test-callback"
                                    target="_blank"
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    🧪 Test OAuth Flow
                                </a>
                                <a
                                    href="/debug-auth"
                                    target="_blank"
                                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                                >
                                    🔍 Debug Authentication
                                </a>
                                <a
                                    href="/login"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    🔑 Try Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}