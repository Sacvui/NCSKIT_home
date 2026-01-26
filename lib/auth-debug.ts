/**
 * Authentication Debug Utilities
 * 
 * Helps diagnose authentication issues in the ncsStat application
 */

import { createClient } from '@/utils/supabase/server'

export interface AuthDebugInfo {
    hasSupabaseSession: boolean
    hasOrcidCookie: boolean
    supabaseUser: any
    orcidUserId: string | null
    profileExists: boolean
    sessionExpiry: string | null
    errors: string[]
    // Enhanced debug info
    cookieDetails: {
        orcidUser?: string
        orcidPending?: string
        supabaseTokens: string[]
        allAuthCookies: string[]
    }
    environmentInfo: {
        supabaseConfigured: boolean
        orcidConfigured: boolean
        siteUrl: string | null
        nodeEnv: string | null
        vercelEnv: string | null
    }
    databaseInfo?: {
        profileCount: number
        recentLogins: any[]
        systemConfig: any[]
    }
    performanceInfo: {
        checkStartTime: number
        checkEndTime: number
        duration: number
    }
}

/**
 * Server-side auth debugging (use in API routes or server components)
 */
export async function debugAuthServer(request?: Request): Promise<AuthDebugInfo> {
    const startTime = Date.now()
    
    const info: AuthDebugInfo = {
        hasSupabaseSession: false,
        hasOrcidCookie: false,
        supabaseUser: null,
        orcidUserId: null,
        profileExists: false,
        sessionExpiry: null,
        errors: [],
        cookieDetails: {
            supabaseTokens: [],
            allAuthCookies: []
        },
        environmentInfo: {
            supabaseConfigured: false,
            orcidConfigured: false,
            siteUrl: null,
            nodeEnv: null,
            vercelEnv: null
        },
        performanceInfo: {
            checkStartTime: startTime,
            checkEndTime: 0,
            duration: 0
        }
    }

    try {
        // Environment info
        info.environmentInfo = {
            supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                                  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')),
            orcidConfigured: !!process.env.NEXT_PUBLIC_ORCID_CLIENT_ID,
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
            nodeEnv: process.env.NODE_ENV || null,
            vercelEnv: process.env.VERCEL_ENV || null
        }

        // Cookie analysis
        if (request) {
            const cookies = request.headers.get('cookie') || ''
            const cookieArray = cookies.split('; ').filter(c => c.length > 0)
            
            info.cookieDetails.allAuthCookies = cookieArray.filter(cookie => 
                cookie.includes('sb-') || 
                cookie.includes('orcid') || 
                cookie.includes('auth') ||
                cookie.includes('supabase')
            )
            
            info.cookieDetails.supabaseTokens = cookieArray.filter(cookie => 
                cookie.includes('sb-') && cookie.includes('auth')
            )

            const orcidMatch = cookies.match(/orcid_user=([^;]+)/)
            if (orcidMatch) {
                info.hasOrcidCookie = true
                info.orcidUserId = orcidMatch[1]
                info.cookieDetails.orcidUser = orcidMatch[1]
            }

            const orcidPendingMatch = cookies.match(/orcid_pending=([^;]+)/)
            if (orcidPendingMatch) {
                info.cookieDetails.orcidPending = orcidPendingMatch[1]
            }
        }

        // Supabase checks
        if (info.environmentInfo.supabaseConfigured) {
            const supabase = await createClient()

            // Check Supabase session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()
            
            if (sessionError) {
                info.errors.push(`Supabase session error: ${sessionError.message}`)
            } else if (session) {
                info.hasSupabaseSession = true
                info.sessionExpiry = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
                
                // Get user details
                const { data: { user }, error: userError } = await supabase.auth.getUser()
                if (userError) {
                    info.errors.push(`Supabase user error: ${userError.message}`)
                } else {
                    info.supabaseUser = user
                }
            }

            // Database info
            try {
                // Get profile count
                const { count: profileCount } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })

                // Get recent logins
                const { data: recentLogins } = await supabase
                    .from('profiles')
                    .select('id, email, full_name, last_active, provider, created_at')
                    .order('last_active', { ascending: false })
                    .limit(10)

                // Get system config
                const { data: systemConfig } = await supabase
                    .from('system_config')
                    .select('*')
                    .limit(20)

                info.databaseInfo = {
                    profileCount: profileCount || 0,
                    recentLogins: recentLogins || [],
                    systemConfig: systemConfig || []
                }
            } catch (dbError: any) {
                info.errors.push(`Database info error: ${dbError.message}`)
            }

            // ORCID profile validation
            if (info.orcidUserId) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, orcid_id, email, full_name, last_active, tokens')
                    .eq('id', info.orcidUserId)
                    .single()

                if (profileError) {
                    info.errors.push(`ORCID profile error: ${profileError.message}`)
                } else if (profile) {
                    info.profileExists = true
                }
            }
        } else {
            info.errors.push('Supabase not configured')
        }

    } catch (error: any) {
        info.errors.push(`Debug error: ${error.message}`)
    }

    const endTime = Date.now()
    info.performanceInfo.checkEndTime = endTime
    info.performanceInfo.duration = endTime - startTime

    return info
}

/**
 * Client-side auth debugging (use in React components)
 */
export function debugAuthClient(): Promise<AuthDebugInfo> {
    return new Promise(async (resolve) => {
        const startTime = Date.now()
        
        const info: AuthDebugInfo = {
            hasSupabaseSession: false,
            hasOrcidCookie: false,
            supabaseUser: null,
            orcidUserId: null,
            profileExists: false,
            sessionExpiry: null,
            errors: [],
            cookieDetails: {
                supabaseTokens: [],
                allAuthCookies: []
            },
            environmentInfo: {
                supabaseConfigured: false,
                orcidConfigured: false,
                siteUrl: null,
                nodeEnv: null,
                vercelEnv: null
            },
            performanceInfo: {
                checkStartTime: startTime,
                checkEndTime: 0,
                duration: 0
            }
        }

        try {
            // Environment info
            info.environmentInfo = {
                supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                                      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')),
                orcidConfigured: !!process.env.NEXT_PUBLIC_ORCID_CLIENT_ID,
                siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
                nodeEnv: process.env.NODE_ENV || null,
                vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV || null
            }

            // Cookie analysis
            if (typeof document !== 'undefined') {
                const cookies = document.cookie
                const cookieArray = cookies.split('; ').filter(c => c.length > 0)
                
                info.cookieDetails.allAuthCookies = cookieArray.filter(cookie => 
                    cookie.includes('sb-') || 
                    cookie.includes('orcid') || 
                    cookie.includes('auth') ||
                    cookie.includes('supabase')
                )
                
                info.cookieDetails.supabaseTokens = cookieArray.filter(cookie => 
                    cookie.includes('sb-') && cookie.includes('auth')
                )

                const orcidMatch = cookies.match(/orcid_user=([^;]+)/)
                if (orcidMatch) {
                    info.hasOrcidCookie = true
                    info.orcidUserId = orcidMatch[1]
                    info.cookieDetails.orcidUser = orcidMatch[1]
                }

                const orcidPendingMatch = cookies.match(/orcid_pending=([^;]+)/)
                if (orcidPendingMatch) {
                    info.cookieDetails.orcidPending = orcidPendingMatch[1]
                }
            }

            // Check Supabase session only if environment is configured
            if (info.environmentInfo.supabaseConfigured) {
                // Dynamic import to avoid SSR issues
                const { getSupabase } = await import('@/utils/supabase/client')
                const supabase = getSupabase()

                // Check Supabase session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                
                if (sessionError) {
                    info.errors.push(`Supabase session error: ${sessionError.message}`)
                } else if (session) {
                    info.hasSupabaseSession = true
                    info.sessionExpiry = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null
                    
                    // Get user details
                    const { data: { user }, error: userError } = await supabase.auth.getUser()
                    if (userError) {
                        info.errors.push(`Supabase user error: ${userError.message}`)
                    } else {
                        info.supabaseUser = user
                    }
                }
            } else {
                info.errors.push('Supabase not configured (missing or placeholder environment variables)')
            }

        } catch (error: any) {
            info.errors.push(`Debug error: ${error.message}`)
        }

        const endTime = Date.now()
        info.performanceInfo.checkEndTime = endTime
        info.performanceInfo.duration = endTime - startTime

        resolve(info)
    })
}

/**
 * Format debug info for logging
 */
export function formatAuthDebug(info: AuthDebugInfo): string {
    const lines = [
        '=== AUTH DEBUG INFO ===',
        `Performance: ${info.performanceInfo.duration}ms`,
        `Supabase Session: ${info.hasSupabaseSession ? '✅' : '❌'}`,
        `ORCID Cookie: ${info.hasOrcidCookie ? '✅' : '❌'}`,
        `Profile Exists: ${info.profileExists ? '✅' : '❌'}`,
        `Session Expiry: ${info.sessionExpiry || 'N/A'}`,
        `ORCID User ID: ${info.orcidUserId || 'N/A'}`,
        `Supabase User: ${info.supabaseUser?.email || 'N/A'}`,
        '',
        '--- Environment ---',
        `Supabase Configured: ${info.environmentInfo.supabaseConfigured ? '✅' : '❌'}`,
        `ORCID Configured: ${info.environmentInfo.orcidConfigured ? '✅' : '❌'}`,
        `Environment: ${info.environmentInfo.nodeEnv}`,
        '',
        '--- Cookies ---',
        `Auth Cookies: ${info.cookieDetails.allAuthCookies.length}`,
        `Supabase Tokens: ${info.cookieDetails.supabaseTokens.length}`,
    ]

    if (info.databaseInfo) {
        lines.push('', '--- Database ---')
        lines.push(`Total Profiles: ${info.databaseInfo.profileCount}`)
        lines.push(`Recent Logins: ${info.databaseInfo.recentLogins.length}`)
        lines.push(`System Config: ${info.databaseInfo.systemConfig.length}`)
    }

    if (info.errors.length > 0) {
        lines.push('', '--- Errors ---')
        info.errors.forEach(error => lines.push(`  - ${error}`))
    }

    lines.push('=====================')
    return lines.join('\n')
}