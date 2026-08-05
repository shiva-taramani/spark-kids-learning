import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    'https://placeholder.supabase.co';

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'placeholder-key';

  if (typeof window !== 'undefined' && supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase URL is set to placeholder fallback. Please check NEXT_PUBLIC_SUPABASE_URL variable.');
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
