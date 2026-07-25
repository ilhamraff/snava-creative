import type { HeroData } from '@/lib/types'
import { getWhatsAppUrl } from './site-settings'

export const heroData: HeroData = {
  headline: 'Crafting Brands, Preserving Moments',
  subheadline:
    'Kami menghadirkan layanan branding, desain, website, produksi foto & video, hingga dokumentasi profesional untuk membantu bisnis berkembang dan setiap momen berharga tampil lebih bermakna',
  ctaPrimary: {
    label: 'Konsultasi Gratis',
    url: getWhatsAppUrl(),
  },
  ctaSecondary: {
    label: 'Jelajahi Portfolio',
    url: '#portfolio',
  },
}
