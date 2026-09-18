/**
 * Fetch Pricing Section global data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getPricingSectionData() {
  return {
    headline: 'Engagement Models',
    subheadline: 'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda. Tidak ada biaya tersembunyi.',
  }
}
