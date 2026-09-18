import type { HeroData } from '@/lib/types'
import { heroData as fallbackHero } from '@/lib/data/hero'
import { getSiteSettings, getWhatsAppUrlFromSettings } from './get-site-settings'

/**
 * Fetch Hero data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getHeroData(): Promise<HeroData> {
  const hero = { ...fallbackHero }

  // Process WhatsApp URL dynamically from site settings
  if (hero.ctaPrimary.url === '#whatsapp' || hero.ctaPrimary.url.trim() === '') {
    const siteSettings = await getSiteSettings()
    hero.ctaPrimary = {
      ...hero.ctaPrimary,
      url: getWhatsAppUrlFromSettings(siteSettings),
    }
  }

  return hero
}
