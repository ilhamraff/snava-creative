import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { categories, portfolio } from '@/lib/db/schema'
import { eq, sql, desc } from 'drizzle-orm'
import { CategoryClient, type CategoryWithCount } from './_components/category-client'

export const metadata: Metadata = {
  title: 'Kategori',
}

export default async function AdminCategoriesPage() {
  // Query categories with aggregated count of linked portfolio items
  const data: CategoryWithCount[] = await db
    .select({
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      portfolioCount: sql<number>`count(${portfolio.id})::int`,
    })
    .from(categories)
    .leftJoin(portfolio, eq(portfolio.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(desc(categories.createdAt))

  return <CategoryClient initialCategories={data} />
}
