import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your project values.'
  );
}

// Single shared client. Public reads use RLS's "status = published" policies;
// once the admin logs in, the same client's session lets RLS's is_admin()
// policies open up writes — there is no separate authenticated client.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
