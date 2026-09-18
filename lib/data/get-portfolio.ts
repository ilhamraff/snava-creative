import type { PortfolioItem } from '@/lib/types'
import {
  portfolioItems as fallbackItems,
  portfolioCategories as fallbackCategories,
} from '@/lib/data/portfolio'

export interface PortfolioDataResponse {
  categories: string[]
  items: PortfolioItem[]
}

/**
 * Fetch Portfolio data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 *
 * @param limit Batas maksimal item yang diambil. Default 100.
 * @param onlyFeatured Jika true, hanya mengambil portfolio yang di-set 'isFeatured'.
 */
export async function getPortfolioData(
  limit: number = 100,
  onlyFeatured: boolean = false
): Promise<PortfolioDataResponse> {
  return {
    categories: fallbackCategories,
    items: fallbackItems,
  }
}

/**
 * Fetch Portfolio data by Service relationship.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 */
export async function getPortfolioByService(serviceId: string, limit: number = 6): Promise<PortfolioItem[]> {
  return []
}
