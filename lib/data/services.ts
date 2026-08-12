import type { Service } from '@/lib/types'

export const services: Service[] = [
  {
    id: 'fallback-branding',
    slug: 'branding',
    title: 'Branding',
    description:
      'Bangun identitas brand yang kuat dan konsisten — dari logo hingga brand guideline lengkap.',
    icon: 'Palette',
    order: 1,
    isActive: true,
  },
  {
    id: 'fallback-social-media',
    slug: 'desain-media-sosial',
    title: 'Desain Media Sosial',
    description:
      'Konten visual yang menarik perhatian dan meningkatkan engagement di setiap platform.',
    icon: 'Megaphone',
    order: 2,
    isActive: true,
  },
  {
    id: 'fallback-logo',
    slug: 'logo-design',
    title: 'Logo Design',
    description:
      'Logo yang memorable dan merepresentasikan esensi bisnis Anda.',
    icon: 'PenTool',
    order: 3,
    isActive: true,
  },
  {
    id: 'fallback-company-profile',
    slug: 'company-profile',
    title: 'Company Profile',
    description:
      'Dokumen profesional yang mempresentasikan bisnis Anda dengan impresif.',
    icon: 'FileText',
    order: 4,
    isActive: true,
  },
  {
    id: 'fallback-landing-page',
    slug: 'landing-page',
    title: 'Landing Page',
    description:
      'Halaman web yang dirancang untuk mengkonversi pengunjung menjadi pelanggan.',
    icon: 'Globe',
    order: 5,
    isActive: true,
  },
  {
    id: 'fallback-product-photography',
    slug: 'product-photography',
    title: 'Product Photography',
    description:
      'Foto produk berkualitas tinggi yang meningkatkan daya tarik visual.',
    icon: 'Camera',
    order: 6,
    isActive: true,
  },
  {
    id: 'fallback-motion-graphic',
    slug: 'motion-graphic',
    title: 'Motion Graphic',
    description:
      'Animasi dinamis yang menyampaikan pesan dengan cara yang engaging.',
    icon: 'Play',
    order: 7,
    isActive: true,
  },
  {
    id: 'fallback-video-company',
    slug: 'video-company-profile',
    title: 'Video Company Profile',
    description:
      'Video profesional yang menceritakan kisah dan nilai perusahaan Anda.',
    icon: 'Video',
    order: 8,
    isActive: true,
  },
  {
    id: 'fallback-video-komersial',
    slug: 'video-komersial',
    title: 'Video Komersial',
    description:
      'Iklan video yang memikat dan mendorong aksi dari target audiens Anda.',
    icon: 'Clapperboard',
    order: 9,
    isActive: true,
  },
]
