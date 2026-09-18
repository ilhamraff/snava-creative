import { redirect } from 'next/navigation'
import { desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { TestimonialsClient } from './testimonials-client'

export const dynamic = 'force-dynamic'

export default async function TestimoniPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const items = await db.query.testimonials.findMany({
    orderBy: [desc(testimonials.createdAt)],
  })

  return <TestimonialsClient initialItems={items} />
}
