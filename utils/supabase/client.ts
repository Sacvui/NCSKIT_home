import { createBrowserClient } from '@supabase/ssr'

const globalSupabase = global as unknown as {
  supabaseClient: ReturnType<typeof createBrowserClient> | undefined
}

export const getSupabase = () => {
  if (globalSupabase.supabaseClient) {
    return globalSupabase.supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  globalSupabase.supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return globalSupabase.supabaseClient
}

export const createClient = getSupabase;
