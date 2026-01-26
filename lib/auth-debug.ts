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
}

/**
 * Server-side auth debugging (use in API routes or server components)
 */
export async function debugAuthServer(request?: Request): Promise<AuthDebugInfo> {
    const info: AuthDebugInfo = {
        hasSupabaseSession: false,
        hasOrcidCookie: false,
        supabaseUser: null,
        orcidUserId: null,
        profileExists: false,
        sessionExpiry: null,
        errors: []
    }

    try {
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

        // Check ORCID cookie (if request provided)
        if (request) {
            const cookies = request.headers.get('cookie') || ''
            const orcidMatch = cookies.match(/orcid_user=([^;]+)/)
            if (orcidMatch) {
                info.hasOrcidCookie = true
                info.orcidUserId = orcidMatch[1]

                // Validate ORCID user in database
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, orcid_id, email, full_name')
                    .eq('id', info.orcidUserId)
                    .single()

                if (profileError) {
                    info.errors.push(`ORCID profile error: ${profileError.message}`)
                } else if (profile) {
                    info.profileExists = true
                }
            }
        }

    } catch (error: any) {
        info.errors.push(`Debug error: ${error.message}`)
    }

    return info
}

/**
 * Client-side auth debugging (use in React components)
 */
export function debugAuthClient(): Promise<AuthDebugInfo> {
    return new Promise(async (resolve) => {
        const info: AuthDebugInfo = {
            hasSupabaseSession: false,
            hasOrcidCookie: false,
            supabaseUser: null,
            orcidUserId: null,
            profileExists: false,
            sessionExpiry: null,
            errors: []
        }

        try {
            // Check ORCID cookie
            if (typeof document !== 'undefined') {
                const cookies = document.cookie
                const orcidMatch = cookies.match(/orcid_user=([^;]+)/)
                if (orcidMatch) {
                    info.hasOrcidCookie = true
                    info.orcidUserId = orcidMatch[1]
                    // Note: Can't validate profile from client-side easily
                }
            }

            // Check Supabase session only if environment is configured
            const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                                     !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

            if (hasSupabaseConfig) {
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

        resolve(info)
    })
}

/**
 * Format debug info for logging
 */
export function formatAuthDebug(info: AuthDebugInfo): string {
    const lines = [
        '=== AUTH DEBUG INFO ===',
        `Supabase Session: ${info.hasSupabaseSession ? '✅' : '❌'}`,
        `ORCID Cookie: ${info.hasOrcidCookie ? '✅' : '❌'}`,
        `Profile Exists: ${info.profileExists ? '✅' : '❌'}`,
        `Session Expiry: ${info.sessionExpiry || 'N/A'}`,
        `ORCID User ID: ${info.orcidUserId || 'N/A'}`,
        `Supabase User: ${info.supabaseUser?.email || 'N/A'}`,
    ]

    if (info.errors.length > 0) {
        lines.push('Errors:')
        info.errors.forEach(error => lines.push(`  - ${error}`))
    }

    lines.push('=====================')
    return lines.join('\n')
}