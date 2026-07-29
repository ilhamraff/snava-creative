import type { HeroData } from '@/lib/types'
import { heroData as fallbackHero } from '@/lib/data/hero'
import { getPayloadClient } from '@/lib/payload'
import { getSiteSettings, getWhatsAppUrlFromSettings } from './get-site-settings'

/**
 * Fetch Hero data from Payload CMS with fallback to static data.
 *
 * 1. Fetches from Payload Global API.
 * 2. If ctaPrimary.url is empty or '#whatsapp', dynamically injects
 *    the WA URL from Site Settings.
 * 3. Falls back to static data if CMS is empty or unavailable.
 */
export async function getHeroData(): Promise<HeroData> {
  try {
    const payload = await getPayloadClient()
    const heroRes = await (payload as any).findGlobal({
      slug: 'hero-section',
    })

    if (!heroRes || !heroRes.headline) {
      return fallbackHero
    }

    // Process WhatsApp URL dynamically
    let primaryUrl = heroRes.ctaPrimary?.url || '#whatsapp'
    if (primaryUrl === '#whatsapp' || primaryUrl.trim() === '') {
      const siteSettings = await getSiteSettings()
      primaryUrl = getWhatsAppUrlFromSettings(siteSettings)
    }

    return {
      headline: heroRes.headline,
      subheadline: heroRes.subheadline,
      ctaPrimary: {
        label: heroRes.ctaPrimary?.label || fallbackHero.ctaPrimary.label,
        url: primaryUrl,
      },
      ctaSecondary: {
        label: heroRes.ctaSecondary?.label || fallbackHero.ctaSecondary.label,
        url: heroRes.ctaSecondary?.url || fallbackHero.ctaSecondary.url,
      },
    }
  } catch (error) {
    return fallbackHero
  }
}
