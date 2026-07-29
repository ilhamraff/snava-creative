import { HeroSection } from '@/components/sections/hero'
import { PortfolioSectionServer } from '@/components/sections/portfolio-server'
import { AboutSection } from '@/components/sections/about'
import { ServicesSectionServer } from '@/components/sections/services-server'
import { ClientLogosSection } from '@/components/sections/client-logos'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { PricingSection } from '@/components/pricing/pricing-section'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FooterSectionServer } from '@/components/sections/footer-server'

import { pricingSectionData, pricingPlans } from '@/lib/data/pricing'

export default function HomePage() {
  const teaserPlans = pricingPlans.filter(p => p.serviceCategory === 'Landing Page')
  
  return (
    <>
      <HeroSection />
      <PortfolioSectionServer />
      <AboutSection />
      <ServicesSectionServer />
      <ClientLogosSection />
      <TestimonialsSection />
      
      <PricingSection 
        data={{
          ...pricingSectionData,
          subheadline: 'Paket terlaris kami untuk membantu bisnis Anda tampil maksimal secara online.'
        }} 
        plans={teaserPlans} 
        hideTabs={true}
        viewMoreUrl="/pricing"
      />

      <FinalCTASection />
      <FooterSectionServer />
    </>
  )
}
