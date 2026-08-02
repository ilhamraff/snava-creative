import type { SiteSettings, FooterData, FinalCTAData } from '@/lib/types'
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a WhatsApp URL from a SiteSettings object (dynamic, CMS-aware).
 * Unlike the static `getWhatsAppUrl()` in site-settings.ts, this accepts
 * settings as a parameter so it works with data fetched from Payload.
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
 * Fetch footer display data. Description, quickLinks and serviceLinks are
 * static (not managed in site-settings CMS), but copyright uses the dynamic
 * siteName from CMS.
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
      // { label: 'Testimonials', href: '#testimoni' },
      // { label: 'FAQ', href: '#faq' },
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
 * Fetch Final CTA display data. WhatsApp URL is built from CMS settings.
 */
export async function getFinalCtaData(): Promise<FinalCTAData> {
  const settings = await getSiteSettings()
  const waUrl = getWhatsAppUrlFromSettings(settings)
  return {
    headline: 'Ready to Take Your Brand to the Next Level?',
    subheadline:
      'Let’s discuss your creative needs with our team. Free, with no commitment.',
    ctaPrimary: {
      label: 'Contact Us Now',
      url: waUrl,
    },
    ctaSecondary: {
      label: 'View Services',
      url: '#layanan',
    },
  }
}
