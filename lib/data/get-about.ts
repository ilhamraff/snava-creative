import type { AboutData } from '@/lib/types'
import { aboutData as fallbackAbout } from '@/lib/data/about'

/**
 * Fetch About data.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns static fallback data.
 */
export async function getAboutData(): Promise<AboutData> {
  return fallbackAbout
}
