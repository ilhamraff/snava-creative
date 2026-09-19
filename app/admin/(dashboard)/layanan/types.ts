export interface ServiceWithRelations {
  id: number
  title: string
  slug: string
  category: string | null
  description: string | null
  icon: string | null
  isActive: boolean | null
  sortOrder: string | null
  heroHeadline: string | null
  heroDescription: string | null
  heroImageId: number | null
  createdAt: Date | null
  updatedAt: Date | null
  heroImage?: {
    id: number
    url: string | null
    alt: string
  } | null
  packages?: {
    id: string
    name: string
    price: string | null
    billingPeriod: string | null
    description: string | null
    isPopular: boolean | null
    isCustom: boolean | null
    order?: number | null
    features?: {
      id: string
      name: string
      included: boolean | null
      order?: number | null
    }[]
  }[]
  problems?: {
    id: string
    title: string
    description: string
    order?: number | null
  }[]
  capabilities?: {
    id: string
    title: string
    description: string
    icon: string | null
    order?: number | null
  }[]
  faqs?: {
    id: string
    question: string
    answer: string
    order?: number | null
  }[]
}

export interface PackageFeatureState {
  id: string
  name: string
  included: boolean
}

export interface PackageState {
  id: string
  name: string
  price: string
  billingPeriod: string
  description: string
  isPopular: boolean
  isCustom: boolean
  features: PackageFeatureState[]
}

export interface ProblemState {
  id: string
  title: string
  description: string
}

export interface CapabilityState {
  id: string
  title: string
  description: string
  icon: string
}

export interface FaqState {
  id: string
  question: string
  answer: string
}

