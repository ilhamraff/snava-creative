import { HeroSectionServer } from '@/components/sections/hero-server'
import { PortfolioSectionServer } from '@/components/sections/portfolio-server'
import { AboutSection } from '@/components/sections/about'
import { ServicesSectionServer } from '@/components/sections/services-server'
// import { ClientLogosSection } from '@/components/sections/client-logos'
// import { TestimonialsSectionServer } from '@/components/sections/testimonials-server'
// import { PricingSection } from '@/components/pricing/pricing-section'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FooterSectionServer } from '@/components/sections/footer-server'

// import { pricingSectionData, pricingPlans } from '@/lib/data/pricing'

// Revalidate cache every 60 seconds (Incremental Static Regeneration)
// Ini yang akan memperbaiki bug cache di Vercel/Production
export const revalidate = 60

export default function HomePage() {
  // const teaserPlans = pricingPlans.filter(p => p.serviceCategory === 'Landing Page')
  
  return (
    <>
      <HeroSectionServer />
      <PortfolioSectionServer limit={6} onlyFeatured={true} showViewAll={true} />
      <AboutSection />
      <ServicesSectionServer />
      {/* <ClientLogosSection /> */}
      {/* <TestimonialsSectionServer /> */}
      
      {/* 
      <PricingSection 
        data={{
          ...pricingSectionData,
          subheadline: 'Paket terlaris kami untuk membantu bisnis Anda tampil maksimal secara online.'
        }} 
        plans={teaserPlans} 
        hideTabs={true}
        viewMoreUrl="/pricing"
      />
      */}

      <FinalCTASection />
      <FooterSectionServer />
    </>
  )
}
