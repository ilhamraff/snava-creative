import { getPortfolioData } from '@/lib/data/get-portfolio'
import { PortfolioSection } from './portfolio'

/**
 * Server Component wrapper that fetches Portfolio items and Categories
 * from Payload CMS, then passes them as props to the client PortfolioSection.
 */
export async function PortfolioSectionServer() {
  const { categories, items } = await getPortfolioData()
  return <PortfolioSection categories={categories} items={items} />
}
