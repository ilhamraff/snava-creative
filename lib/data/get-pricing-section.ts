import { db } from '@/lib/db'

/**
 * Fetch Pricing Section global data from PostgreSQL via Drizzle ORM.
 */
export async function getPricingSectionData() {
  try {
    const row = await db.query.pricingSection.findFirst()

    if (!row) {
      return {
        headline: 'Layanan Populer',
        subheadline:
          'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
      }
    }

    return {
      headline: row.headline || 'Layanan Populer',
      subheadline:
        row.subheadline ||
        'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda.',
    }
  } catch (error) {
    console.error('Error in getPricingSectionData, using fallback:', error)
    return {
      headline: 'Layanan Populer',
      subheadline:
        'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
    }
  }
}
