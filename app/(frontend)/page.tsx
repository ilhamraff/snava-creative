import { HeroSectionServer } from '@/components/sections/hero-server'
import { PortfolioSectionServer } from '@/components/sections/portfolio-server'
import { AboutSection } from '@/components/sections/about'
import { ServicesSectionServer } from '@/components/sections/services-server'
// import { ClientLogosSection } from '@/components/sections/client-logos'
// import { TestimonialsSectionServer } from '@/components/sections/testimonials-server'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FooterSectionServer } from '@/components/sections/footer-server'
import { getServicesData } from '@/lib/data/get-services'
import { getPricingSectionData } from '@/lib/data/get-pricing-section'
import { PricingPlan } from '@/lib/types'
import { PricingSection } from '@/components/pricing/pricing-section'

// Revalidate cache every 60 seconds (Incremental Static Regeneration)
// Ini yang akan memperbaiki bug cache di Vercel/Production
export const revalidate = 60

export default async function HomePage() {
  const [servicesData, pricingGlobal] = await Promise.all([
    getServicesData(),
    getPricingSectionData()
  ])
  
  const pricingPlans: PricingPlan[] = servicesData.services.flatMap(service => 
    (service.packages || []).map(pkg => ({
      ...pkg,
      serviceCategory: service.title
    }))
  )
  
  // Show popular or teaser plans
  const teaserPlans = pricingPlans.filter(p => p.isPopular)

  const sectionData = {
    headline: pricingGlobal.headline || 'Engagement Models',
    subheadline: pricingGlobal.subheadline || 'Paket terlaris kami untuk membantu bisnis Anda tampil maksimal secara online.',
    defaultCategory: teaserPlans[0]?.serviceCategory || servicesData.services[0]?.title
  }
  
  return (
    <>
      <HeroSectionServer />
      <PortfolioSectionServer limit={6} onlyFeatured={true} showViewAll={true} />
      <AboutSection />
      <ServicesSectionServer />
      {/* <ClientLogosSection /> */}
      {/* <TestimonialsSectionServer /> */}
      
      {teaserPlans.length > 0 && (
        <PricingSection 
          data={sectionData} 
          plans={teaserPlans} 
          hideTabs={true}
          viewMoreUrl="/pricing"
        />
      )}

      <FinalCTASection />
      <FooterSectionServer />
    </>
  )
}
