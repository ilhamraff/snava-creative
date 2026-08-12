import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getServiceBySlug, getRelatedServices } from '@/lib/data/get-service-by-slug'
import { getPortfolioByService } from '@/lib/data/get-portfolio'
import { ServiceHero } from '@/components/sections/service-hero'
import { ServiceProblems } from '@/components/sections/service-problems'
import { ServiceCapabilities } from '@/components/sections/service-capabilities'
import { PortfolioCarousel } from '@/components/sections/portfolio-carousel'
import { PricingSection } from '@/components/pricing/pricing-section'
import { FAQSection } from '@/components/sections/faq'
import { FinalCTASection } from '@/components/sections/final-cta'
import { RelatedServices } from '@/components/sections/related-services'
import { getPricingSectionData } from '@/lib/data/get-pricing-section'
import type { PricingPlan } from '@/lib/types'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: `${service.title} | Snava Creative`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  // Fetch related portfolio
  const portfolioItems = await getPortfolioByService(service.id)
  
  // Fetch related services
  const relatedServices = await getRelatedServices(service.slug)

  // Map packages to PricingPlan
  const pricingPlans: PricingPlan[] = (service.packages || []).map((pkg: any, idx: number) => ({
    id: pkg.id || `pkg-${idx}-${pkg.name}`,
    name: pkg.name,
    serviceCategory: service.title, // Pass context to the pricing card
    price: pkg.price || 0,
    priceDisplay: pkg.price ? `Rp${(pkg.price / 1000).toLocaleString('id-ID')}k` : 'Custom',
    billingPeriod: pkg.billingPeriod || '',
    description: pkg.description || '',
    features: (pkg.features || []).map((f: any) => ({
      name: f.name,
      included: f.included,
    })),
    isPopular: pkg.isPopular || false,
    isCustom: pkg.isCustom || false,
  }))

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <ServiceHero
        eyebrow={service.title}
        headline={service.hero?.headline || service.title}
        description={service.hero?.description || service.description}
        ctaPrimary={{
          label: service.hero?.ctaPrimaryLabel || 'Konsultasi Sekarang',
          url: service.hero?.ctaPrimaryUrl || '/#final-cta'
        }}
        ctaSecondary={service.hero?.ctaSecondaryLabel ? {
          label: service.hero?.ctaSecondaryLabel,
          url: service.hero?.ctaSecondaryUrl || '/portfolio'
        } : undefined}
        image={service.hero?.image}
      />

      {/* 2. Problems */}
      {service.problems && service.problems.length > 0 && (
        <ServiceProblems
          headline="Apakah Ini Tantangan yang Sedang Anda Hadapi?"
          problems={service.problems}
        />
      )}

      {/* 3. What We Do */}
      {service.capabilities && service.capabilities.length > 0 && (
        <ServiceCapabilities
          headline="Solusi Kami untuk Anda"
          capabilities={service.capabilities}
        />
      )}

      {/* 4. Portfolio */}
      {portfolioItems && portfolioItems.length > 0 && (
        <PortfolioCarousel
          items={portfolioItems}
          title="Hasil Karya Kami"
        />
      )}

      {/* 5. Packages */}
      {pricingPlans && pricingPlans.length > 0 && (
        <PricingSection
          plans={pricingPlans}
          data={{
            headline: "Investasi yang Tepat untuk Bisnis Anda",
            subheadline: "Pilih paket yang paling sesuai dengan kebutuhan dan skala bisnis Anda."
          }}
          hideTabs={true}
        />
      )}

      {/* 6. FAQ */}
      {service.faqs && service.faqs.length > 0 && (
        <FAQSection items={service.faqs} />
      )}

      {/* 7. CTA */}
      <FinalCTASection
        headline="Siap Meningkatkan Performa Bisnis Anda?"
        subheadline="Mari berdiskusi lebih lanjut tentang bagaimana layanan kami dapat membantu Anda mencapai tujuan."
      />

      {/* 8. Related Services */}
      {relatedServices && relatedServices.length > 0 && (
        <RelatedServices services={relatedServices} />
      )}
    </div>
  )
}
