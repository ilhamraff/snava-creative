import { z } from 'zod'

export const portfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Judul minimal 2 karakter')
    .max(255, 'Judul maksimal 255 karakter'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug minimal 2 karakter')
    .max(255, 'Slug maksimal 255 karakter'),
  categoryId: z.coerce.number().int().positive('Kategori wajib dipilih'),
  thumbnailId: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  client: z.string().trim().optional(),
  year: z.string().trim().optional(),
  isFeatured: z.boolean().default(true),
})

export type PortfolioInput = Omit<z.input<typeof portfolioSchema>, 'categoryId' | 'thumbnailId'> & {
  categoryId: number
  thumbnailId?: number
  relatedServiceIds?: number[]
}
