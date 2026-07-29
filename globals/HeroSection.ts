import type { GlobalConfig } from 'payload'

export const HeroSection: GlobalConfig = {
  slug: 'hero-section',
  label: 'Hero Section',
  admin: {
    group: 'Halaman Depan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      label: 'Headline Utama',
      type: 'text',
      required: true,
      defaultValue: 'Crafting Brands, Preserving Moments',
    },
    {
      name: 'subheadline',
      label: 'Sub-headline (Teks Deskripsi)',
      type: 'textarea',
      required: true,
      defaultValue: 'Kami menghadirkan layanan branding, desain, website, produksi foto & video, hingga dokumentasi profesional untuk membantu bisnis berkembang dan setiap momen berharga tampil lebih bermakna',
    },
    {
      name: 'ctaPrimary',
      label: 'Tombol Utama (CTA 1)',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Teks Tombol',
          type: 'text',
          required: true,
          defaultValue: 'Konsultasi Gratis',
        },
        {
          name: 'url',
          label: 'Link URL',
          type: 'text',
          required: true,
          defaultValue: '#whatsapp',
          admin: {
            description: 'Isi dengan URL (misal: /contact, https://...), atau biarkan #whatsapp agar otomatis memakai nomor dari Site Settings.',
          },
        },
      ],
    },
    {
      name: 'ctaSecondary',
      label: 'Tombol Kedua (CTA 2)',
      type: 'group',
      fields: [
        {
          name: 'label',
          label: 'Teks Tombol',
          type: 'text',
          required: true,
          defaultValue: 'Jelajahi Portfolio',
        },
        {
          name: 'url',
          label: 'Link URL',
          type: 'text',
          required: true,
          defaultValue: '#portfolio',
        },
      ],
    },
  ],
}
