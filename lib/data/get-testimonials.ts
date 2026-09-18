import type { Testimonial } from '@/lib/types'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

/**
 * Fetch Testimonials data from Supabase Postgres via Drizzle ORM.
 * Falls back to static testimonials if database is empty or on error.
 */
export async function getTestimonialsData(): Promise<Testimonial[]> {
  try {
    const dbTestimonials = await db.query.testimonials.findMany({
      where: eq(testimonials.isFeatured, true),
      orderBy: [desc(testimonials.createdAt)],
    })

    if (!dbTestimonials || dbTestimonials.length === 0) {
      return fallbackTestimonials
    }

    return dbTestimonials.map((t) => ({
      name: t.name,
      company: t.company,
      role: t.role,
      content: t.content,
      rating: t.rating ? parseFloat(t.rating) : 5,
    }))
  } catch (error) {
    console.error('Error fetching testimonials from database:', error)
    return fallbackTestimonials
  }
}

