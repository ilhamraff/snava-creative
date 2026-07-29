import type { AboutData } from '@/lib/types'
import { aboutData as fallbackAbout } from '@/lib/data/about'
import { getPayloadClient } from '@/lib/payload'

/**
 * Fetch About data from Payload CMS with fallback to static data.
 *
 * 1. Try fetching from Payload Global API (slug: 'about-page')
 * 2. Transform CMS response to AboutData type
 * 3. If Payload fails or data is empty, return static fallback
 *
 * This runs server-side only (RSC / Server Component).
 */
export async function getAboutData(): Promise<AboutData> {
  try {
    const payload = await getPayloadClient()
    const data = (await (payload as any).findGlobal({
      slug: 'about-page',
    })) as Record<string, any> | null

    // If data is null or title is missing, CMS data hasn't been populated yet
    if (!data || !data.title) {
      return fallbackAbout
    }

    return {
      title: data.title,
      description: data.description ?? fallbackAbout.description,
      vision: data.vision ?? fallbackAbout.vision,
      values:
        Array.isArray(data.values) && data.values.length > 0
          ? data.values.map(
              (v: { icon: string; title: string; description: string }) => ({
                icon: v.icon,
                title: v.title,
                description: v.description,
              }),
            )
          : fallbackAbout.values,
      image: fallbackAbout.image, // image not managed in CMS yet
    }
  } catch {
    // Payload unavailable — use static fallback silently
    return fallbackAbout
  }
}
