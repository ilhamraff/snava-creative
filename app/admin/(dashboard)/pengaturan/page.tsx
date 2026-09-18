import { redirect } from 'next/navigation'
import { desc } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'
import { SettingsClient } from './settings-client'

export const dynamic = 'force-dynamic'

export default async function PengaturanPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch current site settings with logo & social links
  const siteSettingsData = await db.query.siteSettings.findFirst({
    with: {
      logo: true,
      socialLinks: true,
    },
  })

  // Fetch hero section
  const heroSectionData = await db.query.heroSection.findFirst()

  // Fetch about page with values
  const aboutPageData = await db.query.aboutPage.findFirst({
    with: {
      values: true,
    },
  })

  // Fetch pricing section
  const pricingSectionData = await db.query.pricingSection.findFirst()

  // Fetch services section
  const servicesSectionData = await db.query.servicesSection.findFirst()

  // Fetch media library items for logo picker
  const mediaList = await db.query.media.findMany({
    orderBy: [desc(media.createdAt)],
    limit: 100,
  })

  return (
    <SettingsClient
      initialSiteSettings={
        siteSettingsData
          ? {
              id: siteSettingsData.id,
              siteName: siteSettingsData.siteName,
              tagline: siteSettingsData.tagline,
              logoId: siteSettingsData.logoId,
              email: siteSettingsData.email,
              phone: siteSettingsData.phone,
              whatsappNumber: siteSettingsData.whatsappNumber,
              whatsappMessage: siteSettingsData.whatsappMessage,
              address: siteSettingsData.address,
              logo: siteSettingsData.logo
                ? {
                    id: siteSettingsData.logo.id,
                    url: siteSettingsData.logo.url,
                    alt: siteSettingsData.logo.alt,
                  }
                : null,
              socialLinks: siteSettingsData.socialLinks
                ? siteSettingsData.socialLinks.map((sl) => ({
                    id: sl.id,
                    platform: sl.platform,
                    url: sl.url,
                  }))
                : [],
            }
          : null
      }
      initialHeroSection={heroSectionData || null}
      initialAboutPage={
        aboutPageData
          ? {
              id: aboutPageData.id,
              title: aboutPageData.title,
              description: aboutPageData.description,
              vision: aboutPageData.vision,
              values: aboutPageData.values
                ? aboutPageData.values.map((v) => ({
                    id: v.id,
                    icon: v.icon,
                    title: v.title,
                    description: v.description,
                  }))
                : [],
            }
          : null
      }
      initialPricingSection={pricingSectionData || null}
      initialServicesSection={servicesSectionData || null}
      mediaList={mediaList.map((m) => ({
        id: m.id,
        url: m.url,
        alt: m.alt,
        filename: m.filename,
      }))}
    />
  )
}
