export interface PortfolioWithRelations {
  id: number
  title: string
  slug: string
  categoryId: number
  thumbnailId: number
  description: string | null
  client: string | null
  year: string | null
  isFeatured: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
  category?: {
    id: number
    name: string
  } | null
  thumbnail?: {
    id: number
    url: string | null
    alt: string
  } | null
  relatedServices?: Array<{
    id: number
    order?: number | null
    servicesId: number | null
    service?: {
      id: number
      title: string
    } | null
  }>
}

export interface CategoryOption {
  id: number
  name: string
}

export interface ServiceOption {
  id: number
  title: string
}
