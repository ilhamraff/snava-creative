import type { Service } from '@/lib/types'
import { services as fallbackServices } from '@/lib/data/services'

export interface ServicesDataResponse {
  title: string
  description: string
  services: Service[]
}

/**
 * Fetch Services data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getServicesData(): Promise<ServicesDataResponse> {
  return {
    title: 'Our Services',
    description: 'From brand identity to video content, we help businesses stand out with purposeful design.',
    services: fallbackServices,
  }
}
