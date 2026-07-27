import type { SiteSettings } from '@/lib/types'
import { siteSettings as fallbackSettings } from '@/lib/data/site-settings'
import { getPayloadClient } from '@/lib/payload'

/**
 * Fetch Site Settings from Payload CMS with fallback to static data.
 *
 * 1. Try fetching from Payload Global API
 * 2. Transform CMS response to SiteSettings type
 * 3. If Payload fails or data is empty, return static fallback
 *
 * This runs server-side only (RSC / Server Component).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const payload = await getPayloadClient()
    // Global 'site-settings' is registered in payload.config.ts.
    // Payload-generated types (payload-types.ts) are stale on Node v24 locally.
    // They will auto-regenerate on Vercel deploy.
    const data = await (payload as any).findGlobal({ slug: 'site-settings' }) as Record<string, any> | null

    // If data is null or siteName is missing, CMS data hasn't been populated yet
    if (!data || !data.siteName) {
      return fallbackSettings
    }

    return {
      siteName: data.siteName,
      tagline: data.tagline ?? fallbackSettings.tagline,
      contactEmail: data.email ?? fallbackSettings.contactEmail,
      contactPhone: data.phone ?? fallbackSettings.contactPhone,
      whatsappNumber: data.whatsappNumber ?? fallbackSettings.whatsappNumber,
      whatsappMessage: data.whatsappMessage ?? fallbackSettings.whatsappMessage,
      address: data.address ?? fallbackSettings.address,
      socialMedia: Array.isArray(data.socialLinks) && data.socialLinks.length > 0
        ? data.socialLinks.map((link: { platform: string; url: string }) => ({
            platform: link.platform,
            url: link.url,
          }))
        : fallbackSettings.socialMedia,
    }
  } catch {
    // Payload unavailable — use static fallback silently
    return fallbackSettings
  }
}
