import { MetadataRoute } from 'next'
import { getServicesData } from '@/lib/data/get-services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.snavacreative.id'

  let servicesUrls: MetadataRoute.Sitemap = []

  try {
    const servicesData = await getServicesData()
    servicesUrls = servicesData.services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching services for sitemap:', error)
  }

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    ...servicesUrls,
  ]
}
