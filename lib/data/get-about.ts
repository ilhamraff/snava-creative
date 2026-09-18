import type { AboutData } from '@/lib/types'
import { aboutData as fallbackAbout } from '@/lib/data/about'
import { db } from '@/lib/db'

/**
 * Fetch About data from PostgreSQL via Drizzle ORM.
 * Falls back to static data if database is empty or connection fails.
 */
export async function getAboutData(): Promise<AboutData> {
  try {
    const row = await db.query.aboutPage.findFirst({
      with: {
        values: true,
      },
    })

    if (!row) {
      return fallbackAbout
    }

    const values =
      row.values && row.values.length > 0
        ? row.values.map((v) => ({
            icon: v.icon,
            title: v.title,
            description: v.description,
          }))
        : fallbackAbout.values

    return {
      title: row.title || fallbackAbout.title,
      description: row.description || fallbackAbout.description,
      vision: row.vision || fallbackAbout.vision,
      values,
      image: fallbackAbout.image,
    }
  } catch (error) {
    console.error('Error fetching about data from DB:', error)
    return fallbackAbout
  }
}
