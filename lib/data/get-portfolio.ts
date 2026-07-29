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
 * 1. Fetches all Categories to build dynamic filter tabs.
 * 2. Fetches up to 6 Portfolio items where isFeatured is true.
 * 3. Falls back to static data if CMS is empty or unavailable.
 */
export async function getPortfolioData(): Promise<PortfolioDataResponse> {
  try {
    const payload = await getPayloadClient()

    // Fetch Categories
    const categoriesRes = await (payload as any).find({
      collection: 'categories',
      limit: 100,
    })
    const cmsCategories = categoriesRes.docs.map((c: any) => c.name)

    // Fetch Featured Portfolios
    const portfolioRes = await (payload as any).find({
      collection: 'portfolio',
      where: {
        isFeatured: {
          equals: true,
        },
      },
      limit: 6,
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

    // Always ensure "Semua" is the first category tab
    return {
      categories: ['Semua', ...cmsCategories],
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
