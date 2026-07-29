import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'vision',
      label: 'Vision',
      type: 'textarea',
    },
    {
      name: 'values',
      label: 'Values',
      type: 'array',
      maxRows: 6,
      labels: {
        singular: 'Value',
        plural: 'Values',
      },
      fields: [
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Target', value: 'Target' },
            { label: 'Lightbulb', value: 'Lightbulb' },
            { label: 'Handshake', value: 'Handshake' },
            { label: 'Zap', value: 'Zap' },
            { label: 'Heart', value: 'Heart' },
            { label: 'Shield', value: 'Shield' },
            { label: 'Star', value: 'Star' },
            { label: 'Rocket', value: 'Rocket' },
            { label: 'Users', value: 'Users' },
            { label: 'Trophy', value: 'Trophy' },
            { label: 'Palette', value: 'Palette' },
            { label: 'Code', value: 'Code' },
          ],
        },
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
