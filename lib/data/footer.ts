import type { FinalCTAData, FooterData } from '@/lib/types'
import { getWhatsAppUrl } from './site-settings'

export const finalCtaData: FinalCTAData = {
  headline: 'Siap Membawa Bisnis Anda ke Level Berikutnya?',
  subheadline:
    'Konsultasikan kebutuhan kreatif Anda dengan tim kami. Gratis, tanpa komitmen.',
  ctaPrimary: {
    label: 'Hubungi Kami Sekarang',
    url: getWhatsAppUrl(),
  },
  ctaSecondary: {
    label: 'Lihat Layanan',
    url: '#layanan',
  },
}

export const footerData: FooterData = {
  description:
    'Creative agency yang membantu bisnis tampil menonjol melalui desain dan strategi visual yang tepat.',
  quickLinks: [
    { label: 'Tentang', href: '#tentang' },
    { label: 'Layanan', href: '#layanan' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Testimoni', href: '#testimoni' },
    { label: 'FAQ', href: '#faq' },
  ],
  serviceLinks: [
    { label: 'Branding', href: '#layanan' },
    { label: 'Social Media', href: '#layanan' },
    { label: 'Video Production', href: '#layanan' },
    { label: 'Web Development', href: '#layanan' },
    { label: 'Photography', href: '#layanan' },
  ],
  copyright: `© ${new Date().getFullYear()} Snava Creative. All rights reserved.`,
}
