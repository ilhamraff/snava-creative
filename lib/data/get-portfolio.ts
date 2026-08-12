import type { PortfolioItem } from '@/lib/types'
import {
  portfolioItems as fallbackItems,
  portfolioCategories as fallbackCategories,
} from '@/lib/data/portfolio'
import { getPayloadClient } from '@/lib/payload'

export interface PortfolioDataResponse {
  categories: string[]
  items: PortfolioItem[]
}

/**
 * Fetch Portfolio data from Payload CMS with fallback to static data.
 *
 * @param limit Batas maksimal item yang diambil. Default 100.
 * @param onlyFeatured Jika true, hanya mengambil portfolio yang di-set 'isFeatured'.
 */
export async function getPortfolioData(
  limit: number = 100,
  onlyFeatured: boolean = false
): Promise<PortfolioDataResponse> {
  try {
    const payload = await getPayloadClient()

    // Fetch Categories
    const categoriesRes = await (payload as any).find({
      collection: 'categories',
      limit: 100,
    })
    const cmsCategories = categoriesRes.docs.map((c: any) => c.name)

    // Build query constraints
    const whereClause: any = {}
    if (onlyFeatured) {
      whereClause.isFeatured = { equals: true }
    }

    // Fetch Portfolios
    const portfolioRes = await (payload as any).find({
      collection: 'portfolio',
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      limit: limit,
      depth: 1, // To automatically populate the related Category and Media objects
      sort: '-createdAt',
    })

    // Transform CMS data to our frontend shape
    const cmsItems: PortfolioItem[] = portfolioRes.docs.map((item: any) => {
      // Determine category string (fallback to 'Uncategorized' if missing)
      const categoryName =
        typeof item.category === 'object' && item.category !== null
          ? item.category.name
          : 'Uncategorized'

      // Determine thumbnail URL (media object or string fallback)
      let thumbnailUrl = ''
      if (item.thumbnail) {
        if (typeof item.thumbnail === 'object' && item.thumbnail.url) {
          thumbnailUrl = item.thumbnail.url
        } else if (typeof item.thumbnail === 'string') {
          thumbnailUrl = item.thumbnail
        }
      }

      return {
        title: item.title,
        slug: item.slug,
        category: categoryName,
        thumbnail: thumbnailUrl,
        description: item.description || '',
        client: item.client || '',
        year: item.year || '',
      }
    })

    // If both are empty, it means CMS is empty. Use fallback.
    if (cmsCategories.length === 0 && cmsItems.length === 0) {
      return {
        categories: fallbackCategories,
        items: fallbackItems,
      }
    }

    // Always ensure "All" is the first category tab
    return {
      categories: ['All', ...cmsCategories],
      items: cmsItems,
    }
  } catch (error) {
    // If Payload is down, use static fallback silently
    return {
      categories: fallbackCategories,
      items: fallbackItems,
    }
  }
}

/**
 * Fetch Portfolio data by Service relationship.
 */
export async function getPortfolioByService(serviceId: string, limit: number = 6): Promise<PortfolioItem[]> {
  try {
    const payload = await getPayloadClient()

    const portfolioRes = await (payload as any).find({
      collection: 'portfolio',
      where: {
        relatedServices: {
          contains: serviceId, // Check if the serviceId is in the relatedServices array
        }
      },
      limit: limit,
      depth: 1, // To automatically populate the related Category and Media objects
      sort: '-createdAt',
    })

    const cmsItems: PortfolioItem[] = portfolioRes.docs.map((item: any) => {
      const categoryName =
        typeof item.category === 'object' && item.category !== null
          ? item.category.name
          : 'Uncategorized'

      let thumbnailUrl = ''
      if (item.thumbnail) {
        if (typeof item.thumbnail === 'object' && item.thumbnail.url) {
          thumbnailUrl = item.thumbnail.url
        } else if (typeof item.thumbnail === 'string') {
          thumbnailUrl = item.thumbnail
        }
      }

      return {
        title: item.title,
        slug: item.slug,
        category: categoryName,
        thumbnail: thumbnailUrl,
        description: item.description || '',
        client: item.client || '',
        year: item.year || '',
      }
    })

    return cmsItems
  } catch (error) {
    console.error(`Error fetching portfolio for service ${serviceId}:`, error)
    return []
  }
}
