import { createBrowserClient } from '@supabase/ssr'

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('[Supabase Client] Missing environment variables:', {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseAnonKey,
                url: supabaseUrl || 'MISSING',
                keyLength: supabaseAnonKey?.length || 0
            })
            
            // Don't create client with placeholder values in production
            if (process.env.NODE_ENV === 'production') {
                throw new Error('Supabase environment variables not configured')
            }
            
            // In development, use placeholders but warn
            console.warn('[Supabase Client] Using placeholder values for development')
            supabaseInstance = createBrowserClient(
                'https://placeholder.supabase.co',
                'placeholder-key'
            )
        } else {
            console.log('[Supabase Client] Initializing with environment variables')
            supabaseInstance = createBrowserClient(
                supabaseUrl, 
                supabaseAnonKey,
                {
                    cookieOptions: {
                        domain: '',
                        path: '/',
                        sameSite: 'lax',
                        secure: (typeof window !== 'undefined' && window.location.protocol === 'https:') || process.env.NODE_ENV === 'production'
                    }
                }
            )
        }
    }
    return supabaseInstance
}

// Backward compatible alias
export const createClient = getSupabase
