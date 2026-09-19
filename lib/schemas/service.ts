import { z } from 'zod'

export interface ServicePackageFeatureInput {
  id?: string
  name: string
  included?: boolean
}

export interface ServicePackageInput {
  id?: string
  name: string
  price?: number | string | null
  billingPeriod?: string | null
  description?: string | null
  isPopular?: boolean
  isCustom?: boolean
  features?: ServicePackageFeatureInput[]
}

export interface ServiceProblemInput {
  id?: string
  title: string
  description: string
}

export interface ServiceCapabilityInput {
  id?: string
  title: string
  description: string
  icon?: string
}

export interface ServiceFaqInput {
  id?: string
  question: string
  answer: string
}

export const serviceSchema = z.object({
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
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  icon: z.string().trim().default('Layers'),
  isActive: z.boolean().default(true),
  sortOrder: z.string().trim().default('1'),
  heroHeadline: z.string().trim().optional(),
  heroDescription: z.string().trim().optional(),
  heroImageId: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().trim().optional(),
})

export type ServiceInput = Omit<z.input<typeof serviceSchema>, 'heroImageId'> & {
  heroImageId?: number
  packages?: ServicePackageInput[]
  problems?: ServiceProblemInput[]
  capabilities?: ServiceCapabilityInput[]
  faqs?: ServiceFaqInput[]
}
