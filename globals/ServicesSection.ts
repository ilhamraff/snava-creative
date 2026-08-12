import type { GlobalConfig } from 'payload'

export const ServicesSection: GlobalConfig = {
  slug: 'services-section',
  label: 'Services Section',
  admin: {
    group: 'Halaman Depan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Judul Section',
      type: 'text',
      required: true,
      defaultValue: 'Capabilities',
    },
    {
      name: 'description',
      label: 'Deskripsi Singkat',
      type: 'textarea',
      required: true,
      defaultValue: 'Dari identitas brand hingga konten video, kami siap membantu bisnis Anda tampil menonjol dengan desain yang disengaja.',
    },
  ],
}

