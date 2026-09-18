import { redirect } from 'next/navigation'
import { desc, isNotNull } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { media, portfolio, services } from '@/lib/db/schema'
import { MediaClient, type MediaWithUsages } from './media-client'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // 1. Fetch all media items
  const mediaList = await db.query.media.findMany({
    orderBy: [desc(media.createdAt)],
  })

  // 2. Fetch usage references
  const portfolioThumbnails = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      thumbnailId: portfolio.thumbnailId,
    })
    .from(portfolio)
    .where(isNotNull(portfolio.thumbnailId))

  const serviceHeroes = await db
    .select({
      id: services.id,
      title: services.title,
      heroImageId: services.heroImageId,
    })
    .from(services)
    .where(isNotNull(services.heroImageId))

  // 3. Map usage into media items
  const items: MediaWithUsages[] = mediaList.map((m) => {
    const usedInPortfolios = portfolioThumbnails
      .filter((p) => p.thumbnailId === m.id)
      .map((p) => ({ id: p.id, title: p.title }))

    const usedInServices = serviceHeroes
      .filter((s) => s.heroImageId === m.id)
      .map((s) => ({ id: s.id, title: s.title }))

    return {
      id: m.id,
      alt: m.alt,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl,
      filename: m.filename,
      mimeType: m.mimeType,
      filesize: m.filesize,
      width: m.width,
      height: m.height,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      usedIn: {
        portfolios: usedInPortfolios,
        services: usedInServices,
      },
    }
  })

  return <MediaClient initialItems={items} />
}
