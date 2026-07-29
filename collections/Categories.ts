import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
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
      label: 'Nama Kategori',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
