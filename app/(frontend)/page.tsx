import { HeroSection } from '@/components/sections/hero'
import { ClientLogosSection } from '@/components/sections/client-logos'
import { StatisticsSection } from '@/components/sections/statistics'
import { AboutSection } from '@/components/sections/about'
import { ServicesSection } from '@/components/sections/services'
import { WhyChooseUsSection } from '@/components/sections/why-choose-us'
import { PortfolioSection } from '@/components/sections/portfolio'
import { TechStackSection } from '@/components/sections/tech-stack'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { PricingSection } from '@/components/pricing/pricing-section'
import { FAQSection } from '@/components/sections/faq'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FooterSection } from '@/components/sections/footer'

import { pricingSectionData, pricingPlans } from '@/lib/data/pricing'

export default function HomePage() {
  // Teaser: Hanya tampilkan paket Landing Page di halaman depan agar tidak terlalu panjang
  const teaserPlans = pricingPlans.filter(p => p.serviceCategory === 'Landing Page')
  
  return (
    <>
      <HeroSection />
      <ClientLogosSection />
      <StatisticsSection />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <TechStackSection />
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

      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </>
  )
}
