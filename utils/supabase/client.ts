import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Prevent crashing during build if env vars are missing
    if (!supabaseUrl || !supabaseAnonKey) {
        return null;
    }

    const isProd = process.env.NODE_ENV === 'production' || 
                   (typeof window !== 'undefined' && window.location.hostname.includes('ncskit.org'));

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookieOptions: {
                domain: isProd ? '.ncskit.org' : undefined,
                path: '/',
                sameSite: 'lax',
                secure: typeof window !== 'undefined' && (window.location.protocol === 'https:' || process.env.NODE_ENV === 'production')
            }
        }
    )
}

// Alias for convenience
export const getSupabase = createClient
