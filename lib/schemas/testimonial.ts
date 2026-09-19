import { z } from 'zod'

export const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama klien minimal 2 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  company: z
    .string()
    .trim()
    .min(2, 'Nama perusahaan minimal 2 karakter')
    .max(255, 'Nama perusahaan maksimal 255 karakter'),
  role: z
    .string()
    .trim()
    .min(2, 'Jabatan minimal 2 karakter')
    .max(255, 'Jabatan maksimal 255 karakter'),
  content: z
    .string()
    .trim()
    .min(10, 'Isi ulasan minimal 10 karakter')
    .max(2000, 'Isi ulasan maksimal 2000 karakter'),
  rating: z.string().trim().default('5'),
  isFeatured: z.boolean().default(true),
})

export type TestimonialInput = z.input<typeof testimonialSchema>
