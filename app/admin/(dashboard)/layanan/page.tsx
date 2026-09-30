import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { services, categories } from '@/lib/db/schema'
import { desc, asc } from 'drizzle-orm'
import { ServicesClient } from './_components/services-client'

export const metadata: Metadata = {
  title: 'Layanan',
}

export default async function AdminServicesPage() {
  // Parallel query for services and category list
  const [items, allCategories] = await Promise.all([
    db.query.services.findMany({
      with: {
        heroImage: true,
      },
      orderBy: [asc(services.sortOrder), desc(services.createdAt)],
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
  ])

  return (
    <ServicesClient
      initialItems={items}
      categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
