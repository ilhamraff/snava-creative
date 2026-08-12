import { getPayloadClient } from '@/lib/payload'

export async function getPricingSectionData() {
  try {
    const payload = await getPayloadClient()
    const pricingRes = await (payload as any).findGlobal({
      slug: 'pricing-section',
    })

    return pricingRes
  } catch (error) {
    console.error('Error fetching pricing section:', error)
    return {
      headline: 'Engagement Models',
      subheadline: 'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
    }
  }
}
