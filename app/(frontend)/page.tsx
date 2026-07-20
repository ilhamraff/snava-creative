import { HeroSection } from '@/components/sections/hero'
import { ClientLogosSection } from '@/components/sections/client-logos'
import { StatisticsSection } from '@/components/sections/statistics'
import { AboutSection } from '@/components/sections/about'
import { ServicesSection } from '@/components/sections/services'
import { WhyChooseUsSection } from '@/components/sections/why-choose-us'
import { PortfolioSection } from '@/components/sections/portfolio'
import { TechStackSection } from '@/components/sections/tech-stack'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { FAQSection } from '@/components/sections/faq'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FooterSection } from '@/components/sections/footer'

export default function HomePage() {
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
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </>
  )
}
