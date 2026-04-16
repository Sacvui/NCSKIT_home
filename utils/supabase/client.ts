import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

export type TypedSupabaseClient = ReturnType<typeof createBrowserClient<Database>>

let supabaseInstance: TypedSupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance as any;

  supabaseInstance = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabaseInstance as any;
};

export const createClient = getSupabase;
