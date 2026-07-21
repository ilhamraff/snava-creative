import { PricingSection } from '@/components/pricing/pricing-section'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FAQSection } from '@/components/sections/faq'
import { FooterSection } from '@/components/sections/footer'
import { pricingSectionData, pricingPlans } from '@/lib/data/pricing'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Harga & Layanan — Snava Creative',
  description: 'Pilih paket layanan kreatif yang sesuai dengan skala bisnis Anda. Transparan tanpa biaya tersembunyi.',
}

export default function PricingPage() {
  return (
    <>
      <div className="pt-16"> {/* Spacer for fixed navbar */}
        <PricingSection 
          data={pricingSectionData} 
          plans={pricingPlans} 
        />
      </div>
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </>
  )
}
