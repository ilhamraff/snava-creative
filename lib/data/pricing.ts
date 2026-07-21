import type { PricingSectionData, PricingPlan } from '@/lib/types'
import { getWhatsAppUrl } from './site-settings'

export const pricingSectionData: PricingSectionData = {
  headline: 'Harga Transparan, Hasil Maksimal',
  subheadline: 'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
  defaultCategory: 'Landing Page'
}

export const pricingPlans: PricingPlan[] = [
  // ==========================================
  // LANDING PAGE
  // ==========================================
  {
    id: 'lp-basic',
    serviceCategory: 'Landing Page',
    name: 'Basic Landing Page',
    subheadline: 'Solusi tepat untuk kampanye singkat atau peluncuran produk tunggal.',
    price: 'Rp 2.500.000',
    billingPeriod: '/project',
    description: 'Desain satu halaman landing page responsif dengan struktur standar untuk konversi.',
    cta: {
      label: 'Pilih Paket Basic',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan paket Basic Landing Page.')
    },
    features: [
      { name: '1 Halaman (Maks 5 Section)', included: true },
      { name: 'Custom Design (Bukan Template)', included: true },
      { name: 'Responsive Mobile Friendly', included: true },
      { name: 'Basic Copywriting', included: true },
      { name: 'Integrasi WhatsApp', included: true },
      { name: 'Revisi Maksimal 2x', included: true },
      { name: 'Domain & Hosting', included: false, tooltip: 'Klien menyediakan domain dan hosting sendiri' },
      { name: 'Integrasi Payment Gateway', included: false },
    ]
  },
  {
    id: 'lp-pro',
    serviceCategory: 'Landing Page',
    name: 'Pro Landing Page',
    badge: 'Most Popular',
    subheadline: 'Dioptimalkan secara maksimal untuk bisnis yang ingin mendapatkan leads tinggi.',
    price: 'Rp 5.000.000',
    billingPeriod: '/project',
    description: 'Landing page premium dengan custom asset, copywriting persuasi tinggi, dan performa super cepat.',
    isPopular: true,
    cta: {
      label: 'Pilih Paket Pro',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan paket Pro Landing Page.')
    },
    features: [
      { name: '1 Halaman (Hingga 10 Section)', included: true },
      { name: 'Premium Custom Design', included: true },
      { name: 'Responsive Mobile Friendly', included: true },
      { name: 'High-Converting Copywriting', included: true },
      { name: 'Integrasi Form Leads (Google Sheet/Email)', included: true },
      { name: 'Custom Icon & Ilustrasi', included: true },
      { name: 'Revisi Maksimal 5x', included: true },
      { name: 'Setup Facebook/Tiktok Pixel', included: true },
    ]
  },
  {
    id: 'lp-custom',
    serviceCategory: 'Landing Page',
    name: 'Custom Web Development',
    badge: 'Enterprise',
    subheadline: 'Untuk kebutuhan kompleks seperti company profile multi-halaman atau web app.',
    price: 'Custom',
    description: 'Konsultasikan kebutuhan spesifik sistem, fitur khusus, atau integrasi pihak ketiga.',
    isCustom: true,
    cta: {
      label: 'Konsultasi Sekarang',
      url: getWhatsAppUrl('Halo Snava, saya ingin konsultasi pembuatan Custom Website.')
    },
    features: [
      { name: 'Unlimited Pages (Sesuai Kebutuhan)', included: true },
      { name: 'Sistem CMS (Content Management)', included: true },
      { name: 'UI/UX Research', included: true },
      { name: 'Integrasi API & Payment Gateway', included: true },
      { name: 'Advanced SEO Setup', included: true },
      { name: 'Support & Maintenance (1 Tahun)', included: true },
    ]
  },

  // ==========================================
  // PRODUCT PHOTOGRAPHY
  // ==========================================
  {
    id: 'foto-katalog',
    serviceCategory: 'Product Photography',
    name: 'Katalog Basic',
    subheadline: 'Foto produk dengan latar belakang putih polos untuk kebutuhan marketplace.',
    price: 'Rp 50.000',
    billingPeriod: '/foto',
    description: 'Sangat cocok untuk e-commerce, Amazon, Shopee, Tokopedia, dan katalog produk standar.',
    cta: {
      label: 'Pesan Foto Katalog',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan jasa Foto Produk Katalog Basic.')
    },
    features: [
      { name: 'Background Putih/Polos', included: true },
      { name: 'Basic Retouching (Warna & Cahaya)', included: true },
      { name: 'High Resolution JPEG', included: true },
      { name: 'Maks 3 Angle per Produk', included: true },
      { name: 'Penggunaan Properti', included: false },
      { name: 'Konsep Kreatif', included: false },
    ]
  },
  {
    id: 'foto-kreatif',
    serviceCategory: 'Product Photography',
    name: 'Creative Styling',
    badge: 'Recommended',
    subheadline: 'Fotografi terkonsep dengan properti dan penataan cahaya dramatis.',
    price: 'Rp 250.000',
    billingPeriod: '/foto',
    description: 'Cocok untuk campaign media sosial, banner website, atau materi iklan berbayar (Ads).',
    isPopular: true,
    cta: {
      label: 'Pesan Creative Styling',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan jasa Foto Produk Creative Styling.')
    },
    features: [
      { name: 'Custom Background & Texture', included: true },
      { name: 'Styling dengan Properti Pendukung', included: true },
      { name: 'Premium Retouching (Blemish Removal)', included: true },
      { name: 'Format High Res & Social Media Ready', included: true },
      { name: 'Moodboard & Concepting', included: true },
      { name: 'Model Tangan (Hand Talent)', included: true },
    ]
  },

  // ==========================================
  // LOGO DESIGN
  // ==========================================
  {
    id: 'logo-starter',
    serviceCategory: 'Logo Design',
    name: 'Starter Identity',
    subheadline: 'Desain logo dasar untuk bisnis yang baru mulai melangkah.',
    price: 'Rp 1.500.000',
    billingPeriod: '/project',
    description: 'Dapatkan identitas visual yang profesional untuk membangun kepercayaan pelanggan dari awal.',
    cta: {
      label: 'Pilih Paket Starter',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan paket Logo Design Starter.')
    },
    features: [
      { name: '2 Alternatif Desain Logo', included: true },
      { name: 'Revisi Maksimal 3x', included: true },
      { name: 'File Master (AI, EPS, PDF)', included: true },
      { name: 'Export Transparan (PNG)', included: true },
      { name: 'Panduan Penggunaan Logo (1 Halaman)', included: true },
      { name: 'Desain Kartu Nama', included: false },
      { name: 'Brand Guideline Lengkap', included: false },
    ]
  },
  {
    id: 'logo-brand',
    serviceCategory: 'Logo Design',
    name: 'Full Branding',
    badge: 'Complete Package',
    subheadline: 'Sistem identitas visual menyeluruh untuk perusahaan yang siap bersaing.',
    price: 'Rp 6.000.000',
    billingPeriod: '/project',
    description: 'Tidak hanya logo, kami merancang sistem visual, tipografi, warna, dan aturan penerapannya.',
    isPopular: true,
    cta: {
      label: 'Pilih Full Branding',
      url: getWhatsAppUrl('Halo Snava, saya tertarik dengan paket Full Branding.')
    },
    features: [
      { name: '3 Alternatif Desain Logo', included: true },
      { name: 'Revisi Unlimited (Hingga Deal)', included: true },
      { name: 'File Master & Export Lengkap', included: true },
      { name: 'Buku Brand Guideline Lengkap', included: true },
      { name: 'Desain Kop Surat & Kartu Nama', included: true },
      { name: 'Desain Amplop & ID Card', included: true },
      { name: 'Palet Warna & Tipografi Khusus', included: true },
    ]
  }
]
