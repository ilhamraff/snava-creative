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
    {
      name: 'services',
      label: 'Daftar Layanan',
      type: 'array',
      labels: {
        singular: 'Layanan',
        plural: 'Layanan',
      },
      fields: [
        {
          name: 'icon',
          label: 'Icon (Lucide)',
          type: 'select',
          required: true,
          options: [
            { label: 'Palette', value: 'Palette' },
            { label: 'Megaphone', value: 'Megaphone' },
            { label: 'PenTool', value: 'PenTool' },
            { label: 'FileText', value: 'FileText' },
            { label: 'Globe', value: 'Globe' },
            { label: 'Camera', value: 'Camera' },
            { label: 'Play', value: 'Play' },
            { label: 'Video', value: 'Video' },
            { label: 'Clapperboard', value: 'Clapperboard' },
            { label: 'Code', value: 'Code' },
            { label: 'Smartphone', value: 'Smartphone' },
            { label: 'Lightbulb', value: 'Lightbulb' },
          ],
        },
        {
          name: 'title',
          label: 'Nama Layanan',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Deskripsi Layanan',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
