import type { Testimonial } from '@/lib/types'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'

/**
 * Fetch Testimonials data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getTestimonialsData(): Promise<Testimonial[]> {
  return fallbackTestimonials
}
