'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { media, portfolio, services, siteSettings } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'

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
 * Upload single or multiple files to Supabase Storage (bucket 'media')
 * and record them in PostgreSQL 'media' table.
 */
export async function uploadMediaAction(formData: FormData) {
  try {
    const { supabase } = await checkAuth()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      // Check if single 'file' was passed
      const singleFile = formData.get('file') as File | null
      if (singleFile && singleFile.size > 0) {
        files.push(singleFile)
      }
    }

    if (files.length === 0) {
      return { success: false, error: 'Tidak ada berkas yang dipilih' }
    }

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
    ]
    const maxSizeBytes = 10 * 1024 * 1024 // 10MB

    const uploadedItems = []

    for (const file of files) {
      if (file.size === 0) continue

      if (file.size > maxSizeBytes) {
        return {
          success: false,
          error: `Berkas "${file.name}" melebihi batas ukuran maksimal 10MB`,
        }
      }

      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: `Format berkas "${file.name}" tidak didukung. Harap unggah format JPG, PNG, WebP, GIF, atau SVG.`,
        }
      }

      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const uniqueFilename = `media_${Date.now()}_${cleanName}`
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
        return {
          success: false,
          error: `Gagal mengunggah "${file.name}": ${uploadError.message}`,
        }
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('media').getPublicUrl(storagePath)

      const alt = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')

      const [created] = await db
        .insert(media)
        .values({
          alt: alt.trim() || 'Media Snava',
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

      if (created) {
        uploadedItems.push(created)
      }
    }

    revalidatePath('/admin/media')
    revalidatePath('/admin')
    return { success: true, count: uploadedItems.length }
  } catch (error) {
    console.error('Error in uploadMediaAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengunggah berkas',
    }
  }
}

/**
 * Update alt text for media item
 */
export async function updateMediaAltAction(id: number, alt: string) {
  try {
    await checkAuth()

    const trimmedAlt = alt.trim()
    if (!trimmedAlt) {
      return { success: false, error: 'Alt text tidak boleh kosong' }
    }

    await db
      .update(media)
      .set({
        alt: trimmedAlt,
        updatedAt: new Date(),
      })
      .where(eq(media.id, id))

    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Error in updateMediaAltAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui Alt text',
    }
  }
}

/**
 * Delete media item with foreign key protection check
 */
export async function deleteMediaAction(id: number) {
  try {
    const { supabase } = await checkAuth()

    // 1. Check if used by Portfolio
    const usedInPortfolio = await db
      .select({ id: portfolio.id, title: portfolio.title })
      .from(portfolio)
      .where(eq(portfolio.thumbnailId, id))

    // 2. Check if used by Services
    const usedInServices = await db
      .select({ id: services.id, title: services.title })
      .from(services)
      .where(eq(services.heroImageId, id))

    // 3. Check if used by Site Settings (Logo)
    const usedInSiteSettings = await db
      .select({ id: siteSettings.id, siteName: siteSettings.siteName })
      .from(siteSettings)
      .where(eq(siteSettings.logoId, id))

    const usages: string[] = []
    if (usedInPortfolio.length > 0) {
      usages.push(
        `Portfolio: ${usedInPortfolio.map((p) => `"${p.title}"`).join(', ')}`
      )
    }
    if (usedInServices.length > 0) {
      usages.push(
        `Layanan: ${usedInServices.map((s) => `"${s.title}"`).join(', ')}`
      )
    }
    if (usedInSiteSettings.length > 0) {
      usages.push('Logo Utama Website')
    }

    if (usages.length > 0) {
      return {
        success: false,
        isUsed: true,
        error: `Berkas ini tidak dapat dihapus karena sedang aktif digunakan pada:\n• ${usages.join('\n• ')}`,
      }
    }

    // Find the media record to get storage filename
    const [mediaItem] = await db
      .select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1)

    if (!mediaItem) {
      return { success: false, error: 'Berkas media tidak ditemukan' }
    }

    // Delete from Supabase Storage if filename exists
    if (mediaItem.filename) {
      const storagePath = `media/${mediaItem.filename}`
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([storagePath])

      if (storageError) {
        console.warn('Storage deletion warning (might already be deleted):', storageError.message)
      }
    }

    // Delete from database
    await db.delete(media).where(eq(media.id, id))

    revalidatePath('/admin/media')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteMediaAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus berkas media',
    }
  }
}
