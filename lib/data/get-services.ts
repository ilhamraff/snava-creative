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

    const servicesCollection = await (payload as any).find({
      collection: 'services',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: 'sortOrder',
      limit: 100,
    })

    if (!servicesRes || !servicesRes.title) {
      return defaultResponse
    }

    const cmsServices: Service[] = (servicesCollection.docs || []).map((item: any, index: number) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      category: item.category,
      description: item.description,
      icon: item.icon,
      order: item.sortOrder || index + 1,
      isActive: item.isActive,
      packages: item.packages || [],
    }))

    return {
      title: servicesRes.title,
      description: servicesRes.description,
      services: cmsServices.length > 0 ? cmsServices : fallbackServices,
    }
  } catch (error) {
    console.error('Error fetching services:', error)
    return defaultResponse
  }
}
