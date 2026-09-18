import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { portfolio, categories, services } from '@/lib/db/schema'
import { desc, asc, eq } from 'drizzle-orm'
import { PortfolioClient } from './portfolio-client'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
  // Parallel fetching portfolio items with relations, categories, and services
  const [items, allCategories, allServices] = await Promise.all([
    db.query.portfolio.findMany({
      with: {
        category: true,
        thumbnail: true,
        relatedServices: {
          with: {
            service: true,
          },
        },
      },
      orderBy: [desc(portfolio.createdAt)],
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
    db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [asc(services.sortOrder)],
    }),
  ])

  return (
    <PortfolioClient
      initialItems={items}
      categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
      services={allServices.map((s) => ({ id: s.id, title: s.title }))}
    />
  )
}
