import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { portfolio, categories } from '@/lib/db/schema'
import { desc, asc } from 'drizzle-orm'
import { PortfolioClient } from './portfolio-client'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default async function AdminPortfolioPage() {
  // Parallel fetching portfolio items with relations + categories list
  const [items, allCategories] = await Promise.all([
    db.query.portfolio.findMany({
      with: {
        category: true,
        thumbnail: true,
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
