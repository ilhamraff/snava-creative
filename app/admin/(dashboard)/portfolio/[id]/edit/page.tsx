import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, portfolio, portfolioRels, services } from '@/lib/db/schema'
import { PortfolioForm } from '../../_components/portfolio-form'

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: EditPortfolioPageProps): Promise<Metadata> {
  const { id } = await params
  const portfolioId = Number(id)

  if (!Number.isInteger(portfolioId)) return { title: 'Edit Portfolio' }

  const item = await db.query.portfolio.findFirst({
    where: eq(portfolio.id, portfolioId),
    columns: { title: true },
  })

  return {
    title: item ? `Edit Portfolio: ${item.title}` : 'Edit Portfolio',
  }
}

export default async function EditPortfolioPage({
  params,
}: EditPortfolioPageProps) {
  const { id } = await params
  const portfolioId = Number(id)

  if (!Number.isInteger(portfolioId)) notFound()

  const [item, allCategories, allServices] = await Promise.all([
    db.query.portfolio.findFirst({
      where: eq(portfolio.id, portfolioId),
      with: {
        category: true,
        thumbnail: true,
        relatedServices: {
          with: { service: true },
          orderBy: [asc(portfolioRels.order)],
        },
      },
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
    db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [asc(services.sortOrder)],
    }),
  ])

  if (!item) notFound()

  return (
    <PortfolioForm
      initialData={item}
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
