import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Fallback for build time when env vars may not be available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function getSupabase() {
    if (!supabaseInstance) {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn('[Supabase] Missing environment variables. Using placeholder values.')
        }

        // Use standard supabase-js client with localStorage-first configuration
        supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                flowType: 'pkce',
                detectSessionInUrl: true, // AUTO-HANDLE auth codes from OAuth callbacks
                persistSession: true,
                storageKey: 'ncs_auth_token',
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
                autoRefreshToken: true,
                debug: process.env.NODE_ENV === 'development'
            }
        })
    }
    return supabaseInstance
}

// Backward compatible alias
export const createClient = getSupabase
