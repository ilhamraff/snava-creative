import type { HeroData } from '@/lib/types'
import { getWhatsAppUrl } from './site-settings'

export const heroData: HeroData = {
  headline: 'Wujudkan Identitas Digital yang Membedakan Bisnis Anda',
  subheadline:
    'Kami membantu UMKM, startup, dan perusahaan membangun brand yang kuat melalui desain kreatif, video profesional, dan strategi visual yang tepat sasaran.',
  ctaPrimary: {
    label: 'Konsultasi Gratis',
    url: getWhatsAppUrl(),
  },
  ctaSecondary: {
    label: 'Lihat Portfolio',
    url: '#portfolio',
  },
}
