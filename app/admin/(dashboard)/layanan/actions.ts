'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { services, media } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'

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

    await db.insert(services).values({
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
