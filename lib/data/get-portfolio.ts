import type { PortfolioItem } from '@/lib/types'
import {
  portfolioItems as fallbackItems,
  portfolioCategories as fallbackCategories,
} from '@/lib/data/portfolio'
import { db } from '@/lib/db'
import { portfolio } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface PortfolioDataResponse {
  categories: string[]
  items: PortfolioItem[]
}

/**
 * Fetch Portfolio data from Supabase Postgres via Drizzle ORM.
 * Falls back to static data if database is empty or connection fails.
 *
 * @param limit Batas maksimal item yang diambil. Default 100.
 * @param onlyFeatured Jika true, hanya mengambil portfolio yang di-set 'isFeatured'.
 */
export async function getPortfolioData(
  limit: number = 100,
  onlyFeatured: boolean = false
): Promise<PortfolioDataResponse> {
  try {
    const items = await db.query.portfolio.findMany({
      where: onlyFeatured ? eq(portfolio.isFeatured, true) : undefined,
      with: {
        category: true,
        thumbnail: true,
      },
      orderBy: [desc(portfolio.createdAt)],
      limit,
    })

    if (!items || items.length === 0) {
      return {
        categories: fallbackCategories,
        items: fallbackItems,
      }
    }

    const mappedItems: PortfolioItem[] = items.map((item) => ({
      title: item.title,
      slug: item.slug,
      category: item.category?.name || 'General',
      thumbnail:
        item.thumbnail?.url ||
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
      description: item.description || '',
      client: item.client || '',
      year: item.year || '',
    }))

    // Distinct category names for filtering tabs
    const categoriesSet = new Set<string>()
    mappedItems.forEach((it) => {
      if (it.category) categoriesSet.add(it.category)
    })
    const categories = ['All', ...Array.from(categoriesSet)]

    return {
      categories,
      items: mappedItems,
    }
  } catch (error) {
    console.error('Error fetching portfolio data from DB, using fallback:', error)
    return {
      categories: fallbackCategories,
      items: fallbackItems,
    }
  }
}

/**
 * Fetch Portfolio data by Service relationship.
 */
export async function getPortfolioByService(
  _serviceId: string,
  _limit: number = 6
): Promise<PortfolioItem[]> {
  const { items } = await getPortfolioData(_limit)
  return items.slice(0, _limit)
}
