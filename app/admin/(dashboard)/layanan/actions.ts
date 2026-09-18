'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  services,
  media,
  servicesPackages,
  servicesPackagesFeatures,
  servicesProblems,
  servicesCapabilities,
  servicesFaqs,
} from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'

export interface ServicePackageFeatureInput {
  id?: string
  name: string
  included?: boolean
}

export interface ServicePackageInput {
  id?: string
  name: string
  price?: number | string | null
  billingPeriod?: string | null
  description?: string | null
  isPopular?: boolean
  isCustom?: boolean
  features?: ServicePackageFeatureInput[]
}

export interface ServiceProblemInput {
  id?: string
  title: string
  description: string
}

export interface ServiceCapabilityInput {
  id?: string
  title: string
  description: string
  icon?: string
}

export interface ServiceFaqInput {
  id?: string
  question: string
  answer: string
}

const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Judul minimal 2 karakter')
    .max(255, 'Judul maksimal 255 karakter'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug minimal 2 karakter')
    .max(255, 'Slug maksimal 255 karakter'),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  icon: z.string().trim().default('Layers'),
  isActive: z.boolean().default(true),
  sortOrder: z.string().trim().default('1'),
  heroHeadline: z.string().trim().optional(),
  heroDescription: z.string().trim().optional(),
  heroImageId: z.coerce.number().int().positive().optional(),
  imageUrl: z.string().trim().optional(),
})

async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Sesi tidak valid atau tidak diizinkan.')
  }

  return { user, supabase }
}

/**
 * Server Action untuk mengunggah file hero image ke Supabase Storage (bucket 'media')
 */
export async function uploadServiceMediaAction(formData: FormData) {
  try {
    const { supabase } = await checkAuth()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return { success: false, error: 'Pilih file gambar yang valid' }
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Ukuran file maksimal 10MB' }
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Format file harus berupa gambar (JPG, PNG, WebP, SVG)' }
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `service_${Date.now()}_${cleanName}`
    const storagePath = `media/${uniqueFilename}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return { success: false, error: `Gagal upload gambar: ${uploadError.message}` }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(storagePath)

    const [createdMedia] = await db
      .insert(media)
      .values({
        alt: file.name.replace(/\.[^/.]+$/, ''),
        url: publicUrl,
        thumbnailUrl: publicUrl,
        filename: uniqueFilename,
        mimeType: file.type,
        filesize: file.size.toString(),
        prefix: 'media',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: media.id, url: media.url })

    revalidatePath('/admin/layanan')
    revalidatePath('/admin/media')

    return {
      success: true,
      mediaId: createdMedia.id,
      url: createdMedia.url,
    }
  } catch (error) {
    console.error('Error in uploadServiceMediaAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengunggah file',
    }
  }
}

export async function createService(formData: {
  title: string
  slug: string
  category?: string
  description?: string
  icon?: string
  isActive?: boolean
  sortOrder?: string
  heroHeadline?: string
  heroDescription?: string
  heroImageId?: number
  imageUrl?: string
  packages?: ServicePackageInput[]
  problems?: ServiceProblemInput[]
  capabilities?: ServiceCapabilityInput[]
  faqs?: ServiceFaqInput[]
}) {
  try {
    await checkAuth()

    const parse = serviceSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const {
      title,
      slug,
      category,
      description,
      icon,
      isActive,
      sortOrder,
      heroHeadline,
      heroDescription,
      imageUrl,
    } = parse.data
    let targetImageId = parse.data.heroImageId

    if (
      imageUrl &&
      !imageUrl.startsWith('blob:') &&
      imageUrl.trim().length > 0 &&
      !targetImageId
    ) {
      const uniqueFilename = `${slug}-hero-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`
      const [createdMedia] = await db
        .insert(media)
        .values({
          alt: title,
          url: imageUrl.trim(),
          thumbnailUrl: imageUrl.trim(),
          filename: uniqueFilename,
          mimeType: 'image/jpeg',
          prefix: 'media',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: media.id })

      if (createdMedia) {
        targetImageId = createdMedia.id
      }
    }

    const [inserted] = await db
      .insert(services)
      .values({
        title,
        slug,
        category: category || null,
        description: description || null,
        icon: icon || 'Layers',
        isActive: isActive ?? true,
        sortOrder: sortOrder || '1',
        heroHeadline: heroHeadline || null,
        heroDescription: heroDescription || null,
        heroImageId: targetImageId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: services.id })

    if (inserted) {
      const serviceId = inserted.id

      // 1. Problems
      if (formData.problems && formData.problems.length > 0) {
        const validProblems = formData.problems.filter((p) => p.title.trim())
        if (validProblems.length > 0) {
          await db.insert(servicesProblems).values(
            validProblems.map((p, idx) => ({
              order: idx + 1,
              parentId: serviceId,
              id: p.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
              title: p.title.trim(),
              description: p.description.trim(),
            }))
          )
        }
      }

      // 2. Capabilities
      if (formData.capabilities && formData.capabilities.length > 0) {
        const validCaps = formData.capabilities.filter((c) => c.title.trim())
        if (validCaps.length > 0) {
          await db.insert(servicesCapabilities).values(
            validCaps.map((c, idx) => ({
              order: idx + 1,
              parentId: serviceId,
              id: c.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
              title: c.title.trim(),
              description: c.description.trim(),
              icon: c.icon?.trim() || null,
            }))
          )
        }
      }

      // 3. FAQs
      if (formData.faqs && formData.faqs.length > 0) {
        const validFaqs = formData.faqs.filter((f) => f.question.trim())
        if (validFaqs.length > 0) {
          await db.insert(servicesFaqs).values(
            validFaqs.map((f, idx) => ({
              order: idx + 1,
              parentId: serviceId,
              id: f.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
              question: f.question.trim(),
              answer: f.answer.trim(),
            }))
          )
        }
      }

      // 4. Packages & Features
      if (formData.packages && formData.packages.length > 0) {
        const validPkgs = formData.packages.filter((p) => p.name.trim())
        for (let i = 0; i < validPkgs.length; i++) {
          const pkg = validPkgs[i]
          const pkgId = pkg.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24)

          await db.insert(servicesPackages).values({
            order: i + 1,
            parentId: serviceId,
            id: pkgId,
            name: pkg.name.trim(),
            price: pkg.price ? pkg.price.toString() : null,
            billingPeriod: pkg.billingPeriod?.trim() || null,
            description: pkg.description?.trim() || null,
            isPopular: pkg.isPopular ?? false,
            isCustom: pkg.isCustom ?? false,
          })

          if (pkg.features && pkg.features.length > 0) {
            const validFeatures = pkg.features.filter((f) => f.name.trim())
            if (validFeatures.length > 0) {
              await db.insert(servicesPackagesFeatures).values(
                validFeatures.map((f, fIdx) => ({
                  order: fIdx + 1,
                  parentId: pkgId,
                  id: f.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
                  name: f.name.trim(),
                  included: f.included ?? true,
                }))
              )
            }
          }
        }
      }
    }

    revalidatePath('/admin/layanan')
    revalidatePath('/admin')
    revalidatePath('/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in createService:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menambah layanan',
    }
  }
}

export async function updateService(
  id: number,
  formData: {
    title: string
    slug: string
    category?: string
    description?: string
    icon?: string
    isActive?: boolean
    sortOrder?: string
    heroHeadline?: string
    heroDescription?: string
    heroImageId?: number
    imageUrl?: string
    packages?: ServicePackageInput[]
    problems?: ServiceProblemInput[]
    capabilities?: ServiceCapabilityInput[]
    faqs?: ServiceFaqInput[]
  }
) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID layanan tidak valid' }
    }

    const parse = serviceSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const {
      title,
      slug,
      category,
      description,
      icon,
      isActive,
      sortOrder,
      heroHeadline,
      heroDescription,
      imageUrl,
    } = parse.data
    let targetImageId = parse.data.heroImageId

    if (
      imageUrl &&
      !imageUrl.startsWith('blob:') &&
      imageUrl.trim().length > 0 &&
      !targetImageId
    ) {
      const uniqueFilename = `${slug}-hero-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`
      const [createdMedia] = await db
        .insert(media)
        .values({
          alt: title,
          url: imageUrl.trim(),
          thumbnailUrl: imageUrl.trim(),
          filename: uniqueFilename,
          mimeType: 'image/jpeg',
          prefix: 'media',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: media.id })

      if (createdMedia) {
        targetImageId = createdMedia.id
      }
    }

    const updateValues: Record<string, any> = {
      title,
      slug,
      category: category || null,
      description: description || null,
      icon: icon || 'Layers',
      isActive: isActive ?? true,
      sortOrder: sortOrder || '1',
      heroHeadline: heroHeadline || null,
      heroDescription: heroDescription || null,
      updatedAt: new Date(),
    }

    if (targetImageId !== undefined) {
      updateValues.heroImageId = targetImageId
    }

    await db.update(services).set(updateValues).where(eq(services.id, id))

    // 1. Problems
    if (formData.problems !== undefined) {
      await db.delete(servicesProblems).where(eq(servicesProblems.parentId, id))
      const validProblems = formData.problems.filter((p) => p.title.trim())
      if (validProblems.length > 0) {
        await db.insert(servicesProblems).values(
          validProblems.map((p, idx) => ({
            order: idx + 1,
            parentId: id,
            id: p.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
            title: p.title.trim(),
            description: p.description.trim(),
          }))
        )
      }
    }

    // 2. Capabilities
    if (formData.capabilities !== undefined) {
      await db.delete(servicesCapabilities).where(eq(servicesCapabilities.parentId, id))
      const validCaps = formData.capabilities.filter((c) => c.title.trim())
      if (validCaps.length > 0) {
        await db.insert(servicesCapabilities).values(
          validCaps.map((c, idx) => ({
            order: idx + 1,
            parentId: id,
            id: c.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
            title: c.title.trim(),
            description: c.description.trim(),
            icon: c.icon?.trim() || null,
          }))
        )
      }
    }

    // 3. FAQs
    if (formData.faqs !== undefined) {
      await db.delete(servicesFaqs).where(eq(servicesFaqs.parentId, id))
      const validFaqs = formData.faqs.filter((f) => f.question.trim())
      if (validFaqs.length > 0) {
        await db.insert(servicesFaqs).values(
          validFaqs.map((f, idx) => ({
            order: idx + 1,
            parentId: id,
            id: f.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
            question: f.question.trim(),
            answer: f.answer.trim(),
          }))
        )
      }
    }

    // 4. Packages & Features
    if (formData.packages !== undefined) {
      const existingPkgs = await db
        .select({ id: servicesPackages.id })
        .from(servicesPackages)
        .where(eq(servicesPackages.parentId, id))

      for (const p of existingPkgs) {
        await db
          .delete(servicesPackagesFeatures)
          .where(eq(servicesPackagesFeatures.parentId, p.id))
      }
      await db.delete(servicesPackages).where(eq(servicesPackages.parentId, id))

      const validPkgs = formData.packages.filter((p) => p.name.trim())
      for (let i = 0; i < validPkgs.length; i++) {
        const pkg = validPkgs[i]
        const pkgId = pkg.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24)

        await db.insert(servicesPackages).values({
          order: i + 1,
          parentId: id,
          id: pkgId,
          name: pkg.name.trim(),
          price: pkg.price ? pkg.price.toString() : null,
          billingPeriod: pkg.billingPeriod?.trim() || null,
          description: pkg.description?.trim() || null,
          isPopular: pkg.isPopular ?? false,
          isCustom: pkg.isCustom ?? false,
        })

        if (pkg.features && pkg.features.length > 0) {
          const validFeatures = pkg.features.filter((f) => f.name.trim())
          if (validFeatures.length > 0) {
            await db.insert(servicesPackagesFeatures).values(
              validFeatures.map((f, fIdx) => ({
                order: fIdx + 1,
                parentId: pkgId,
                id: f.id || crypto.randomUUID().replace(/-/g, '').slice(0, 24),
                name: f.name.trim(),
                included: f.included ?? true,
              }))
            )
          }
        }
      }
    }

    revalidatePath('/admin/layanan')
    revalidatePath('/admin')
    revalidatePath('/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in updateService:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui layanan',
    }
  }
}


export async function toggleServiceStatus(id: number, currentStatus: boolean) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID layanan tidak valid' }
    }

    await db
      .update(services)
      .set({
        isActive: !currentStatus,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))

    revalidatePath('/admin/layanan')
    revalidatePath('/admin')
    revalidatePath('/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in toggleServiceStatus:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengubah status layanan',
    }
  }
}

export async function deleteService(id: number) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID layanan tidak valid' }
    }

    await db.delete(services).where(eq(services.id, id))

    revalidatePath('/admin/layanan')
    revalidatePath('/admin')
    revalidatePath('/services')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteService:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghapus layanan',
    }
  }
}
