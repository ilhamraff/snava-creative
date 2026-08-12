import { getPayloadClient } from '@/lib/payload'

export async function getServiceBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()
    const servicesRes = await (payload as any).find({
      collection: 'services',
      where: {
        slug: {
          equals: slug,
        },
        isActive: {
          equals: true,
        }
      },
      depth: 2, // To populate media in hero
      limit: 1,
    })

    if (!servicesRes.docs || servicesRes.docs.length === 0) {
      return null
    }

    const service = servicesRes.docs[0]
    
    // Process image URL if it exists
    let heroImage = null
    if (service.hero?.image) {
      if (typeof service.hero.image === 'object' && service.hero.image.url) {
        heroImage = service.hero.image.url
      } else if (typeof service.hero.image === 'string') {
        heroImage = service.hero.image
      }
    }

    return {
      ...service,
      hero: service.hero ? { ...service.hero, image: heroImage } : null,
    }
  } catch (error) {
    console.error(`Error fetching service with slug ${slug}:`, error)
    return null
  }
}

export async function getRelatedServices(currentSlug: string, limit = 3) {
  try {
    const payload = await getPayloadClient()
    const servicesRes = await (payload as any).find({
      collection: 'services',
      where: {
        slug: {
          not_equals: currentSlug,
        },
        isActive: {
          equals: true,
        }
      },
      limit: limit,
      sort: 'sortOrder', // You can also randomize this
    })

    return servicesRes.docs || []
  } catch (error) {
    console.error(`Error fetching related services for ${currentSlug}:`, error)
    return []
  }
}
