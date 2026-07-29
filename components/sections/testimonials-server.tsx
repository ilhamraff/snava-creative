import { getTestimonialsData } from '@/lib/data/get-testimonials'
import { TestimonialsSection } from './testimonials'

/**
 * Server Component wrapper that fetches Testimonials from Payload CMS
 * and passes them down to the client component.
 */
export async function TestimonialsSectionServer() {
  const testimonials = await getTestimonialsData()
  return <TestimonialsSection testimonials={testimonials} />
}
