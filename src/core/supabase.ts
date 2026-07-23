import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _supabaseAdmin: SupabaseClient | null = null

function ensureEnv(name: string): string {
  const val = process.env[name]
  if (!val) throw new Error(`${name} is not set`)
  return val
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      ensureEnv('SUPABASE_URL'),
      ensureEnv('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: { autoRefreshToken: false, persistSession: false },
      },
    )
  }
  return _supabaseAdmin
}
