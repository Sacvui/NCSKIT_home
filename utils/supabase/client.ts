import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export type TypedSupabaseClient = ReturnType<typeof createBrowserClient<Database>>

let supabaseInstance: TypedSupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance as any;

  // BYPASS SUPABASE FOR LOCAL TESTING IF ENV VARS ARE MISSING
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase env vars missing. Returning dummy client for local testing.');
      supabaseInstance = {
          auth: {
              getSession: async () => ({ data: { session: null }, error: null }),
              getUser: async () => ({ data: { user: null }, error: null }),
              onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
          },
          from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }) })
      } as any;
      return supabaseInstance as any;
  }

  supabaseInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabaseInstance as any;
};

export const createClient = getSupabase;
