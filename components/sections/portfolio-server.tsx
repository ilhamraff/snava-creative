import { getPortfolioData } from '@/lib/data/get-portfolio'
import { PortfolioSection } from './portfolio'

interface PortfolioSectionServerProps {
  limit?: number
  onlyFeatured?: boolean
  showViewAll?: boolean
  hideHeader?: boolean
}

/**
 * Server Component wrapper that fetches Portfolio data from Payload CMS
 * and passes it down to the client component.
 */
export async function PortfolioSectionServer({ 
  limit = 100, 
  onlyFeatured = false, 
  showViewAll = false,
  hideHeader = false
}: PortfolioSectionServerProps = {}) {
  const { categories, items } = await getPortfolioData(limit, onlyFeatured)
  return <PortfolioSection categories={categories} items={items} showViewAll={showViewAll} hideHeader={hideHeader} />
}
