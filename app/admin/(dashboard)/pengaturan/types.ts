export interface MediaItem {
  id: number
  url: string | null
  alt: string | null
  filename: string | null
}

export interface SocialLinkItem {
  id?: string
  platform: string
  url: string
}

export interface SiteSettingsData {
  id: number
  siteName: string
  tagline: string | null
  logoId: number | null
  email: string | null
  phone: string | null
  whatsappNumber: string | null
  whatsappMessage: string | null
  address: string | null
  logo?: {
    id: number
    url: string | null
    alt: string | null
  } | null
  socialLinks?: SocialLinkItem[]
}

export interface HeroSectionData {
  id: number
  headline: string
  subheadline: string
  ctaPrimaryLabel: string
  ctaPrimaryUrl: string
  ctaSecondaryLabel: string
  ctaSecondaryUrl: string
}

export interface AboutValueItem {
  id?: string
  icon: string
  title: string
  description: string
}

export interface AboutPageData {
  id: number
  title: string
  description: string
  vision: string | null
  values?: AboutValueItem[]
}

export interface PricingSectionData {
  id: number
  headline: string
  subheadline: string
}

export interface ServicesSectionData {
  id: number
  title: string
  description: string
}

export interface SettingsClientProps {
  initialSiteSettings: SiteSettingsData | null
  initialHeroSection: HeroSectionData | null
  initialAboutPage: AboutPageData | null
  initialPricingSection: PricingSectionData | null
  initialServicesSection: ServicesSectionData | null
  mediaList: MediaItem[]
}

