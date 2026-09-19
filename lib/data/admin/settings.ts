import 'server-only'

import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'

export async function getAdminSettings() {
  const [
    siteSettingsData,
    heroSectionData,
    aboutPageData,
    pricingSectionData,
    servicesSectionData,
    mediaList,
  ] = await Promise.all([
    db.query.siteSettings.findFirst({
      with: {
        logo: true,
        socialLinks: true,
      },
    }),
    db.query.heroSection.findFirst(),
    db.query.aboutPage.findFirst({
      with: {
        values: true,
      },
    }),
    db.query.pricingSection.findFirst(),
    db.query.servicesSection.findFirst(),
    db.query.media.findMany({
      orderBy: [desc(media.createdAt)],
      limit: 100,
    }),
  ])

  return {
    siteSettingsData,
    heroSectionData,
    aboutPageData,
    pricingSectionData,
    servicesSectionData,
    mediaList,
  }
}
