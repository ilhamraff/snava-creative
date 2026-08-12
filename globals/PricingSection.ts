import type { GlobalConfig } from 'payload'

export const PricingSection: GlobalConfig = {
  slug: 'pricing-section',
  label: 'Pricing Section',
  admin: {
    group: 'Halaman Depan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      label: 'Judul Section',
      type: 'text',
      required: true,
      defaultValue: 'Engagement Models',
    },
    {
      name: 'subheadline',
      label: 'Deskripsi Singkat',
      type: 'textarea',
      required: true,
      defaultValue: 'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
    },
  ],
}
