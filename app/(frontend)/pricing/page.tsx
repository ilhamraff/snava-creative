import { PricingSection } from '@/components/pricing/pricing-section'
import { FinalCTASection } from '@/components/sections/final-cta'
import { FAQSection } from '@/components/sections/faq'
import { FooterSectionServer } from '@/components/sections/footer-server'
import { pricingSectionData, pricingPlans as fallbackPricingPlans } from '@/lib/data/pricing'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Harga & Layanan — Snava Creative',
  description: 'Pilih paket layanan kreatif yang sesuai dengan skala bisnis Anda. Transparan tanpa biaya tersembunyi.',
}

import { getServicesData } from '@/lib/data/get-services'
import { getPricingSectionData } from '@/lib/data/get-pricing-section'
import { PricingPlan } from '@/lib/types'

export default async function PricingPage() {
  const [servicesData, pricingGlobal] = await Promise.all([
    getServicesData(),
    getPricingSectionData()
  ])
  
  // Transform packages into PricingPlan array
  let plans: PricingPlan[] = servicesData.services.flatMap(service => 
    (service.packages || []).map(pkg => ({
      ...pkg,
      serviceCategory: service.title
    }))
  )

  if (plans.length === 0) {
    plans = fallbackPricingPlans
  }

  const sectionData = {
    headline: pricingGlobal.headline || pricingSectionData.headline || 'Engagement Models',
    subheadline: pricingGlobal.subheadline || pricingSectionData.subheadline || 'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
    defaultCategory: plans[0]?.serviceCategory || servicesData.services[0]?.title
  }

  return (
    <>
      <div className="pt-16"> {/* Spacer for fixed navbar */}
        <PricingSection 
          data={sectionData} 
          plans={plans} 
        />
      </div>
      <FAQSection />
      <FinalCTASection />
      <FooterSectionServer />
    </>
  )
}
