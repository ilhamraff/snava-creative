import { db } from '@/lib/db'
import {
  services,
  servicesPackages,
  servicesPackagesFeatures,
  servicesProblems,
  servicesCapabilities,
  servicesFaqs,
} from '@/lib/db/schema'
import { eq, ne, and, asc } from 'drizzle-orm'
import { services as fallbackServices } from '@/lib/data/services'

/**
 * Fetch a single service by slug from Supabase Postgres via Drizzle ORM.
 */
export async function getServiceBySlug(slug: string): Promise<Record<string, any> | null> {
  try {
    const service = await db.query.services.findFirst({
      where: and(eq(services.slug, slug), eq(services.isActive, true)),
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
        problems: {
          orderBy: [asc(servicesProblems.order)],
        },
        capabilities: {
          orderBy: [asc(servicesCapabilities.order)],
        },
        faqs: {
          orderBy: [asc(servicesFaqs.order)],
        },
      },
    })

    if (service) {
      const heroImageUrl = service.heroImage?.url || undefined

      const mappedPackages = (service.packages || []).map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price ? Number(pkg.price) : null,
        billingPeriod: pkg.billingPeriod || '',
        description: pkg.description || '',
        isPopular: pkg.isPopular || false,
        isCustom: pkg.isCustom || false,
        features: (pkg.features || []).map((f) => ({
          name: f.name,
          included: f.included ?? true,
        })),
      }))

      const mappedProblems = (service.problems || []).map((p) => ({
        title: p.title,
        description: p.description,
      }))

      const mappedCapabilities = (service.capabilities || []).map((c) => ({
        title: c.title,
        description: c.description,
        icon: c.icon || undefined,
      }))

      const mappedFaqs = (service.faqs || []).map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))

      return {
        id: service.id.toString(),
        slug: service.slug,
        title: service.title,
        description: service.description || '',
        category: service.category,
        icon: service.icon,
        heroHeadline: service.heroHeadline,
        heroDescription: service.heroDescription,
        heroImage: heroImageUrl,
        hero: {
          headline: service.heroHeadline || service.title,
          description: service.heroDescription || service.description || '',
          image: heroImageUrl,
          ctaPrimaryLabel: 'Konsultasi Sekarang',
          ctaPrimaryUrl: '/#final-cta',
          ctaSecondaryLabel: 'Lihat Portfolio',
          ctaSecondaryUrl: '/portfolio',
        },
        packages: mappedPackages,
        capabilities: mappedCapabilities,
        problems: mappedProblems,
        faqs: mappedFaqs,
      }
    }

    // Check fallback services if not in database
    const fallback = fallbackServices.find((s) => s.slug === slug)
    return fallback ? { ...fallback, id: fallback.id || fallback.slug } : null
  } catch (error) {
    console.error('Error in getServiceBySlug, using fallback:', error)
    const fallback = fallbackServices.find((s) => s.slug === slug)
    return fallback ? { ...fallback, id: fallback.id || fallback.slug } : null
  }
}

/**
 * Fetch related services (excluding the current one).
 */
export async function getRelatedServices(currentSlug: string, limit = 3): Promise<any[]> {
  try {
    const related = await db.query.services.findMany({
      where: and(ne(services.slug, currentSlug), eq(services.isActive, true)),
      with: {
        heroImage: true,
      },
      limit,
    })

    if (related.length > 0) {
      return related.map((s) => ({
        id: s.id.toString(),
        slug: s.slug,
        title: s.title,
        description: s.description || '',
        icon: s.icon,
      }))
    }

    return fallbackServices.filter((s) => s.slug !== currentSlug).slice(0, limit)
  } catch {
    return fallbackServices.filter((s) => s.slug !== currentSlug).slice(0, limit)
  }
}
