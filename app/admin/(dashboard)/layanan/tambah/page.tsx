import React from 'react'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'
import { ServiceForm } from '../_components/service-form'

export const metadata: Metadata = {
  title: 'Tambah Layanan Baru',
}

export default async function CreateServicePage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: [asc(categories.name)],
  })

  return (
    <ServiceForm
      categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
