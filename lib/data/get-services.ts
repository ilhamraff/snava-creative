import type { Service } from '@/lib/types'
import { services as fallbackServices } from '@/lib/data/services'
import { db } from '@/lib/db'
import {
  services,
  servicesPackages,
  servicesPackagesFeatures,
} from '@/lib/db/schema'
import { eq, asc, desc } from 'drizzle-orm'

export interface ServicesDataResponse {
  title: string
  description: string
  services: Service[]
}

/**
 * Fetch Services data from Supabase Postgres via Drizzle ORM.
 * Falls back to static services if database is empty or connection fails.
 */
export async function getServicesData(): Promise<ServicesDataResponse> {
  try {
    const [dbServices, sectionRow] = await Promise.all([
      db.query.services.findMany({
        where: eq(services.isActive, true),
        with: {
          heroImage: true,
          packages: {
            with: {
              features: {
                orderBy: [asc(servicesPackagesFeatures.order)],
              },
            },
            orderBy: [asc(servicesPackages.order)],
          },
        },
        orderBy: [asc(services.sortOrder), desc(services.createdAt)],
      }),
      db.query.servicesSection.findFirst(),
    ])

    const title = sectionRow?.title || 'Layanan Kami'
    const description =
      sectionRow?.description ||
      'Mulai dari identitas merek hingga konten video, kami membantu bisnis Anda tampil beda melalui desain yang berkelas dan bermakna.'

    if (!dbServices || dbServices.length === 0) {
      return {
        title,
        description,
        services: fallbackServices,
      }
    }

    const mapped: Service[] = dbServices.map((s) => ({
      id: s.id.toString(),
      slug: s.slug,
      title: s.title,
      category: s.category || undefined,
      description: s.description || '',
      icon: s.icon || 'Layers',
      order: parseInt(s.sortOrder || '1', 10),
      isActive: s.isActive ?? true,
      heroHeadline: s.heroHeadline || undefined,
      heroDescription: s.heroDescription || undefined,
      heroImage: s.heroImage?.url || undefined,
      packages: (s.packages || []).map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        serviceCategory: s.title,
        price: pkg.isCustom ? 'Custom' : (pkg.price ? Number(pkg.price) : null),
        billingPeriod: pkg.billingPeriod || '',
        description: pkg.description || '',
        isPopular: pkg.isPopular || false,
        isCustom: pkg.isCustom || false,
        badge: pkg.isPopular ? 'Most Popular' : pkg.isCustom ? 'Custom' : undefined,
        features: (pkg.features || []).map((f) => ({
          name: f.name,
          included: f.included ?? true,
        })),
      })),
    }))

    return {
      title,
      description,
      services: mapped,
    }
  } catch (error) {
    console.error('Error in getServicesData, using fallback:', error)
    return {
      title: 'Layanan Kami',
      description:
        'Mulai dari identitas merek hingga konten video, kami membantu bisnis Anda tampil beda melalui desain yang berkelas dan bermakna.',
      services: fallbackServices,
    }
  }
}
