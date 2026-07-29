import type { Testimonial } from '@/lib/types'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'
import { getPayloadClient } from '@/lib/payload'

/**
 * Fetch Testimonials data from Payload CMS with fallback to static data.
 *
 * 1. Fetches up to 10 Testimonials where isFeatured is true.
 * 2. Falls back to static data if CMS is empty or unavailable.
 */
export async function getTestimonialsData(): Promise<Testimonial[]> {
  try {
    const payload = await getPayloadClient()

    const testimonialsRes = await (payload as any).find({
      collection: 'testimonials',
      where: {
        isFeatured: {
          equals: true,
        },
      },
      limit: 10,
      sort: '-createdAt',
    })

    const cmsItems: Testimonial[] = testimonialsRes.docs.map((item: any) => ({
      name: item.name,
      company: item.company,
      role: item.role,
      content: item.content,
      rating: item.rating || 5,
    }))

    if (cmsItems.length === 0) {
      return fallbackTestimonials
    }

    return cmsItems
  } catch (error) {
    // If Payload is down, use static fallback silently
    return fallbackTestimonials
  }
}
