import type { Metadata } from 'next'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, services } from '@/lib/db/schema'
import { PortfolioForm } from '../_components/portfolio-form'

export const metadata: Metadata = {
  title: 'Tambah Portfolio Baru',
}

export const dynamic = 'force-dynamic'

export default async function CreatePortfolioPage() {
  const [allCategories, allServices] = await Promise.all([
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
    db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [asc(services.sortOrder)],
    }),
  ])

  return (
    <PortfolioForm
      categories={allCategories.map((category) => ({
        id: category.id,
        name: category.name,
      }))}
      services={allServices.map((service) => ({
        id: service.id,
        title: service.title,
      }))}
    />
  )
}
