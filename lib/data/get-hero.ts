import type { HeroData } from '@/lib/types'
import { heroData as fallbackHero } from '@/lib/data/hero'
import { db } from '@/lib/db'
import { getSiteSettings, getWhatsAppUrlFromSettings } from './get-site-settings'

/**
 * Fetch Hero data.
 * Queries PostgreSQL hero_section table via Drizzle ORM with fallback.
 */
export async function getHeroData(): Promise<HeroData> {
  try {
    const row = await db.query.heroSection.findFirst()

    if (!row) {
      const hero = { ...fallbackHero }
      if (hero.ctaPrimary.url === '#whatsapp' || hero.ctaPrimary.url.trim() === '') {
        const siteSettings = await getSiteSettings()
        hero.ctaPrimary = {
          ...hero.ctaPrimary,
          url: getWhatsAppUrlFromSettings(siteSettings),
        }
      }
      return hero
    }

    let primaryUrl = row.ctaPrimaryUrl
    if (primaryUrl === '#whatsapp' || primaryUrl.trim() === '') {
      const siteSettings = await getSiteSettings()
      primaryUrl = getWhatsAppUrlFromSettings(siteSettings)
    }

    return {
      headline: row.headline || fallbackHero.headline,
      subheadline: row.subheadline || fallbackHero.subheadline,
      ctaPrimary: {
        label: row.ctaPrimaryLabel || fallbackHero.ctaPrimary.label,
        url: primaryUrl,
      },
      ctaSecondary: {
        label: row.ctaSecondaryLabel || fallbackHero.ctaSecondary.label,
        url: row.ctaSecondaryUrl || fallbackHero.ctaSecondary.url,
      },
    }
  } catch (error) {
    console.error('Error fetching hero data from DB:', error)
    return fallbackHero
  }
}
