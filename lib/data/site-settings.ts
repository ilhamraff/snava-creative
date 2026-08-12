import type { SiteSettings } from '@/lib/types'

export const siteSettings: SiteSettings = {
  siteName: 'Snava Creative',
  tagline: 'Creative Digital Agency',
  contactEmail: 'hello@snavacreative.com',
  contactPhone: '08211983889',
  whatsappNumber: '628211983889',
  whatsappMessage: 'Halo Snava Creative, saya tertarik untuk konsultasi tentang project saya.',
  address: 'Jakarta, Indonesia',
  socialMedia: [
    { platform: 'Instagram', url: 'https://instagram.com/snavacreative' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/snavacreative' },
    { platform: 'Behance', url: 'https://behance.net/snavacreative' },
    { platform: 'Dribbble', url: 'https://dribbble.com/snavacreative' },
  ],
}

export function getWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || siteSettings.whatsappMessage
  return `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(message)}`
}
