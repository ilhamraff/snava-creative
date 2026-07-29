import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    group: 'Halaman Depan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Nama Klien',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      label: 'Nama Perusahaan',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Jabatan / Posisi',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      label: 'Isi Testimoni',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      label: 'Rating (1-5)',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'isFeatured',
      label: 'Tampilkan di Halaman Beranda',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Jika dicentang, testimoni ini akan masuk ke dalam slider halaman depan (maksimal 10 terbaru)',
      },
    },
  ],
}
