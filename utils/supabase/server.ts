import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

export async function createClient() {
    const cookieStore = await cookies()

    // BYPASS SUPABASE FOR LOCAL TESTING IF ENV VARS ARE MISSING
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase env vars missing. Returning dummy client for local testing.');
        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                getUser: async () => ({ data: { user: null }, error: null }),
            },
            from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), maybeSingle: async () => ({ data: null, error: null }) }) }) })
        } as any;
    }

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, {
                                ...options,
                                path: '/', // Ensure cookies are accessible everywhere
                            })
                        )
                    } catch (error) {
                        // Safe to ignore in Server Components
                    }
                },
            },
        }
    ) as any
}
