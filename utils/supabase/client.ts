import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    // We use placeholders if env vars are missing to prevent crashing during build
    // but still return a valid client object to satisfy TypeScript
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

    const isProd = process.env.NODE_ENV === 'production' || 
                   (typeof window !== 'undefined' && window.location.hostname.includes('ncskit.org'));

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
}

// Alias for convenience
export const getSupabase = createClient
