import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Fallback for build time when env vars may not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export async function createClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('[Supabase Server] Missing environment variables. Using placeholder values.')
    }

    const cookieStore = await cookies()

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
                        const domain = isProd ? '.ncskit.org' : undefined

                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, {
                                ...options,
                                domain: name.includes('supabase') ? domain : options?.domain,
                                secure: isProd,
                                sameSite: 'lax',
                                path: '/',
                            })
                        )
                    } catch (error) {
                        console.error('[Supabase Server] Error setting cookies:', error)
                    }
                },
            },
            cookieOptions: {
                domain: process.env.NODE_ENV === 'production' ? '.ncskit.org' : undefined,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
                path: '/',
            }
        }
    )
}
