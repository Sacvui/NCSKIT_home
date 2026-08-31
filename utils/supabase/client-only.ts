import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClientOnly() {
    // BYPASS SUPABASE FOR LOCAL TESTING IF ENV VARS ARE MISSING
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase env vars missing. Returning dummy client for local testing.');
        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
            },
            from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) })
        } as any;
    }

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                flowType: 'pkce',
                detectSessionInUrl: false,
                persistSession: true,
                storageKey: 'ncs_auth_token', // Explicit key to ensure consistency
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                debug: true // Enable debug logs
            }
        }
    )
}
