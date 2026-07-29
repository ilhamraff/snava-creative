import { HeroSection } from '@/components/sections/hero'
import { PortfolioSection } from '@/components/sections/portfolio'
import { AboutSection } from '@/components/sections/about'
import { ServicesSection } from '@/components/sections/services'
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
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
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
