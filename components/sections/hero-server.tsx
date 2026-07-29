import { getHeroData } from '@/lib/data/get-hero'
import { HeroSection } from './hero'

/**
 * Server Component wrapper that fetches Hero data from Payload CMS
 * and passes it down to the client component.
 */
export async function HeroSectionServer() {
  const data = await getHeroData()
  return <HeroSection data={data} />
}
