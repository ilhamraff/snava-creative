import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Pengaturan',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              label: 'Site Name',
              type: 'text',
              required: true,
            },
            {
              name: 'tagline',
              label: 'Tagline',
              type: 'text',
            },
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'email',
              label: 'Email',
              type: 'email',
            },
            {
              name: 'phone',
              label: 'Phone',
              type: 'text',
            },
            {
              name: 'whatsappNumber',
              label: 'WhatsApp Number',
              type: 'text',
              admin: {
                description: 'Format internasional tanpa tanda +, contoh: 628123456789',
              },
            },
            {
              name: 'whatsappMessage',
              label: 'WhatsApp Default Message',
              type: 'textarea',
            },
            {
              name: 'address',
              label: 'Address',
              type: 'textarea',
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'socialLinks',
              label: 'Social Links',
              type: 'array',
              labels: {
                singular: 'Social Link',
                plural: 'Social Links',
              },
              fields: [
                {
                  name: 'platform',
                  label: 'Platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'Instagram' },
                    { label: 'LinkedIn', value: 'LinkedIn' },
                    { label: 'Behance', value: 'Behance' },
                    { label: 'Dribbble', value: 'Dribbble' },
                    { label: 'YouTube', value: 'YouTube' },
                    { label: 'Twitter / X', value: 'Twitter' },
                    { label: 'Facebook', value: 'Facebook' },
                    { label: 'GitHub', value: 'GitHub' },
                    { label: 'TikTok', value: 'TikTok' },
                    { label: 'Pinterest', value: 'Pinterest' },
                    { label: 'WhatsApp', value: 'WhatsApp' },
                    { label: 'Telegram', value: 'Telegram' },
                    { label: 'Threads', value: 'Threads' },
                  ],
                },
                {
                  name: 'url',
                  label: 'URL',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
