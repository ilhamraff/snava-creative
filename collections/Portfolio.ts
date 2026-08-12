import type { CollectionConfig } from 'payload'

export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  admin: {
    useAsTitle: 'title',
    group: 'Halaman Depan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Judul Portfolio',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Digunakan untuk URL (contoh: nama-brand-branding)',
      },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'categories' as any,
      required: true,
      hasMany: false,
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      label: 'Deskripsi Singkat',
      type: 'textarea',
    },
    {
      name: 'client',
      label: 'Nama Klien',
      type: 'text',
    },
    {
      name: 'year',
      label: 'Tahun',
      type: 'text',
    },
    {
      name: 'isFeatured',
      label: 'Tampilkan di Halaman Beranda',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Jika dicentang, portfolio ini akan muncul di grid halaman depan (maksimal 6)',
      },
    },
    {
      name: 'relatedServices',
      label: 'Layanan Terkait',
      type: 'relationship',
      relationTo: 'services' as any,
      hasMany: true,
      admin: {
        description: 'Pilih layanan (seperti Social Media Management) yang berkaitan dengan portfolio ini agar muncul di halaman layanan tersebut.',
      },
    },
  ],
}
