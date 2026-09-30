import { getAdminMedia } from '@/lib/data/admin/media'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MediaClient } from './_components/media-client'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const items = await getAdminMedia()

  return <MediaClient initialItems={items} />
}
