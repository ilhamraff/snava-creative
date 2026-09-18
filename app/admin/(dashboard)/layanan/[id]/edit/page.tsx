import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import {
  services,
  categories,
  servicesPackages,
  servicesPackagesFeatures,
  servicesProblems,
  servicesCapabilities,
  servicesFaqs,
} from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { ServiceForm } from '../../service-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const service = await db.query.services.findFirst({
    where: eq(services.id, Number(id)),
  })

  return {
    title: service ? `Edit Layanan: ${service.title}` : 'Edit Layanan',
  }
}

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params
  const serviceId = Number(id)

  if (isNaN(serviceId)) {
    notFound()
  }

  const [service, allCategories] = await Promise.all([
    db.query.services.findFirst({
      where: eq(services.id, serviceId),
      with: {
        heroImage: true,
        packages: {
          with: {
            features: {
              orderBy: [asc(servicesPackagesFeatures.order)],
            },
          },
          orderBy: [asc(servicesPackages.order)],
        },
        problems: {
          orderBy: [asc(servicesProblems.order)],
        },
        capabilities: {
          orderBy: [asc(servicesCapabilities.order)],
        },
        faqs: {
          orderBy: [asc(servicesFaqs.order)],
        },
      },
    }),
    db.query.categories.findMany({
      orderBy: [asc(categories.name)],
    }),
  ])

  if (!service) {
    notFound()
  }

  return (
    <ServiceForm
      initialData={service}
      categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
    />
  )
}
