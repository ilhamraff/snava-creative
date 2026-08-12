import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    group: 'Layanan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Nama Layanan',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: 'Deskripsi Layanan',
      type: 'textarea',
      required: true,
    },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      label: 'Aktif',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      label: 'Urutan',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'packages',
      label: 'Paket Harga',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Nama Paket',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          label: 'Harga (Angka)',
          type: 'number',
          admin: {
            description: 'Biarkan kosong untuk paket custom.',
          },
        },
        {
          name: 'billingPeriod',
          label: 'Periode Tagihan',
          type: 'text',
          admin: {
            description: 'Contoh: Per Bulan, /project, /video. Biarkan kosong jika tidak relevan.',
          },
        },
        {
          name: 'description',
          label: 'Deskripsi Tambahan',
          type: 'textarea',
          admin: {
            description: 'Biasanya digunakan untuk deskripsi custom package.',
          },
        },
        {
          name: 'features',
          label: 'Fitur',
          type: 'array',
          fields: [
            {
              name: 'name',
              label: 'Nama Fitur',
              type: 'text',
              required: true,
            },
            {
              name: 'included',
              label: 'Termasuk?',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'isPopular',
          label: 'Most Popular',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'isCustom',
          label: 'Custom Package',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'hero',
      label: 'Hero Section (Detail Page)',
      type: 'group',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text' },
        { name: 'description', label: 'Deskripsi', type: 'textarea' },
        { name: 'image', label: 'Gambar Hero', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'problems',
      label: 'Problem Section',
      type: 'array',
      fields: [
        { name: 'title', label: 'Judul Masalah', type: 'text', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea', required: true },
      ],
    },
    {
      name: 'capabilities',
      label: 'What We Do Section',
      type: 'array',
      fields: [
        { name: 'title', label: 'Nama Layanan', type: 'text', required: true },
        { name: 'description', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'icon', label: 'Icon (Lucide)', type: 'text', admin: { description: 'Contoh: PenTool, Camera, Layout' } },
      ],
    },
    {
      name: 'faqs',
      label: 'FAQ Khusus Layanan',
      type: 'array',
      fields: [
        { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
        { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
      ],
    },
  ],
}
