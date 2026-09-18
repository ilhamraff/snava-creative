import type { SiteSettings, FooterData, FinalCTAData } from '@/lib/types'
import { siteSettings as fallbackSettings } from '@/lib/data/site-settings'

/**
 * Fetch Site Settings.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  return fallbackSettings
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a WhatsApp URL from a SiteSettings object.
 */
export function getWhatsAppUrlFromSettings(
  settings: SiteSettings,
  customMessage?: string,
): string {
  const message = customMessage || settings.whatsappMessage
  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`
}

// ---------------------------------------------------------------------------
// Composed data fetchers (Footer & Final CTA)
// ---------------------------------------------------------------------------

/**
 * Fetch footer display data.
 */
export async function getFooterData(): Promise<FooterData> {
  const settings = await getSiteSettings()
  return {
    description:
      'Creative agency that helps businesses stand out through thoughtful design and visual strategy.',
    quickLinks: [
      { label: 'About', href: '#tentang' },
      { label: 'Services', href: '#layanan' },
      { label: 'Portfolio', href: '#portfolio' },
    ],
    serviceLinks: [
      { label: 'Branding', href: '#layanan' },
      { label: 'Social Media', href: '#layanan' },
      { label: 'Video Production', href: '#layanan' },
      { label: 'Web Development', href: '#layanan' },
      { label: 'Photography', href: '#layanan' },
    ],
    copyright: `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`,
  }
}

/**
 * Fetch Final CTA display data.
 */
export async function getFinalCtaData(): Promise<FinalCTAData> {
  const settings = await getSiteSettings()
  const waUrl = getWhatsAppUrlFromSettings(settings)
  return {
    headline: 'Siap Bawa Brand Anda ke Level Selanjutnya?',
    subheadline:
      'Mari diskusikan kebutuhan kreatif Anda dengan tim kami. Gratis, tanpa komitmen.',
    ctaPrimary: {
      label: 'Hubungi Kami Sekarang',
      url: waUrl,
    },
    ctaSecondary: {
      label: 'Lihat Semua Layanan',
      url: '#layanan',
    },
  }
}
