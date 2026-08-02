import type { Service } from '@/lib/types'
import { services as fallbackServices } from '@/lib/data/services'
import { getPayloadClient } from '@/lib/payload'

export interface ServicesDataResponse {
  title: string
  description: string
  services: Service[]
}

/**
 * Fetch Services data from Payload CMS with fallback to static data.
 */
export async function getServicesData(): Promise<ServicesDataResponse> {
  const defaultResponse = {
    title: 'Our Services',
    description: 'From brand identity to video content, we help businesses stand out with purposeful design.',
    services: fallbackServices,
  }

  try {
    const payload = await getPayloadClient()
    const servicesRes = await (payload as any).findGlobal({
      slug: 'services-section',
    })

    if (!servicesRes || !servicesRes.title) {
      return defaultResponse
    }

    const cmsServices: Service[] = (servicesRes.services || []).map((item: any, index: number) => ({
      title: item.title,
      description: item.description,
      icon: item.icon,
      order: index + 1, // Urutan berdasarkan urutan array di Payload
    }))

    return {
      title: servicesRes.title,
      description: servicesRes.description,
      services: cmsServices.length > 0 ? cmsServices : fallbackServices,
    }
  } catch (error) {
    return defaultResponse
  }
}
