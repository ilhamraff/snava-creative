// ============================================================
// Snava Creative — TypeScript Interfaces
// Shaped to match future Payload CMS schema for easy migration
// ============================================================

export interface SiteSettings {
  siteName: string
  tagline: string
  logo?: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  whatsappMessage: string
  address: string
  socialMedia: SocialLink[]
}

export interface SocialLink {
  platform: string
  url: string
}

export interface CTA {
  label: string
  url: string
}

export interface HeroData {
  headline: string
  subheadline: string
  ctaPrimary: CTA
  ctaSecondary: CTA
}

export interface AboutData {
  title: string
  description: string
  vision: string
  values: ValueItem[]
  image: string
}

export interface ValueItem {
  icon: string
  title: string
  description: string
}

export interface StatItem {
  value: number
  suffix: string
  label: string
}

export interface Service {
  id: string
  title: string
  slug: string
  category?: string
  description: string
  icon: string
  order: number
  isActive: boolean
  packages?: PricingPlan[]
}

export interface PortfolioItem {
  title: string
  slug: string
  category: string
  thumbnail: string
  description: string
  client: string
  year: string
}

export interface Testimonial {
  name: string
  company: string
  role: string
  content: string
  avatar?: string
  rating: number
}

export interface ClientLogo {
  name: string
  order: number
}

export interface FAQItem {
  question: string
  answer: string
  order: number
}

export interface WhyChooseUsItem {
  icon: string
  title: string
  description: string
}

export interface WhyChooseUsData {
  title: string
  subtitle: string
  items: WhyChooseUsItem[]
}

export interface TechItem {
  name: string
  icon: string
  category: string
}

export interface FooterData {
  description: string
  quickLinks: { label: string; href: string }[]
  serviceLinks: { label: string; href: string }[]
  copyright: string
}

export interface FinalCTAData {
  headline: string
  subheadline: string
  ctaPrimary: CTA
  ctaSecondary: CTA
}

export interface PricingFeature {
  name: string
  included: boolean
  tooltip?: string
}

export interface PricingPlan {
  id?: string
  serviceCategory?: string
  name: string
  badge?: string
  subheadline?: string
  price: number | string | null
  billingPeriod?: string | null
  description?: string | null
  features: PricingFeature[]
  cta?: CTA
  isPopular?: boolean
  isCustom?: boolean
}

export interface PricingSectionData {
  headline: string
  subheadline: string
  defaultCategory?: string
}

