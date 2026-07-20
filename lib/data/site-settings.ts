import type { SiteSettings } from '@/lib/types'

export const siteSettings: SiteSettings = {
  siteName: 'Snava Creative',
  tagline: 'Creative Digital Agency',
  contactEmail: 'hello@snavacreative.com',
  contactPhone: '08123456789',
  whatsappNumber: '628123456789',
  whatsappMessage: 'Halo Snava Creative, saya tertarik untuk konsultasi tentang project saya.',
  address: 'Jakarta, Indonesia',
  socialMedia: [
    { platform: 'Instagram', url: 'https://instagram.com/snavacreative', icon: 'FaInstagram' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/snavacreative', icon: 'FaLinkedin' },
    { platform: 'Behance', url: 'https://behance.net/snavacreative', icon: 'FaBehance' },
    { platform: 'Dribbble', url: 'https://dribbble.com/snavacreative', icon: 'FaDribbble' },
  ],
}

export function getWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || siteSettings.whatsappMessage
  return `https://wa.me/${siteSettings.whatsappNumber}?text=${encodeURIComponent(message)}`
}
