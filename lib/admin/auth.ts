import 'server-only'

import { createClient } from '@/lib/supabase/server'

/** Preserve the existing access policy: any authenticated user. */
export async function requireAdminSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Sesi tidak valid atau tidak diizinkan.')
  }

  return { user, supabase }
}
