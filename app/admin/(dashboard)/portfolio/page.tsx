import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { portfolio, categories } from '@/lib/db/schema'
import { desc, asc } from 'drizzle-orm'
import { PortfolioClient } from './_components/portfolio-client'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
  const [items, allCategories] = await Promise.all([
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
  ])

  return (
    <PortfolioClient
      initialItems={items}
      categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
