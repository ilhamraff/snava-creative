'use server'

import { revalidatePath } from 'next/cache'
import { portfolioSchema, type PortfolioInput } from '@/lib/schemas/portfolio'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { portfolio, media, portfolioRels } from '@/lib/db/schema'
import { requireAdminSession } from '@/lib/admin/auth'

/**
 * Server Action untuk mengunggah file gambar ke Supabase Storage (bucket 'media')
 * dan mencatatnya ke tabel media.
 */
export async function uploadMediaAction(formData: FormData) {
  try {
    const { supabase } = await requireAdminSession()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return { success: false, error: 'Pilih file gambar yang valid' }
    }

    // Validasi ukuran (maks 10MB) dan tipe mime
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Ukuran file maksimal 10MB' }
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Format file harus berupa gambar (JPG, PNG, WebP, SVG)' }
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `portfolio_${Date.now()}_${cleanName}`
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

    // Catat ke tabel media
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

    revalidatePath('/admin/portfolio')
    revalidatePath('/admin/media')

    return {
      success: true,
      mediaId: createdMedia.id,
      url: createdMedia.url,
    }
  } catch (error) {
    console.error('Error in uploadMediaAction:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengunggah file',
    }
  }
}

export async function createPortfolio(formData: PortfolioInput) {
  try {
    await requireAdminSession()

    const parse = portfolioSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const {
      title,
      slug,
      categoryId,
      description,
      client,
      year,
      isFeatured,
      imageUrl,
    } = parse.data
    let targetThumbnailId = parse.data.thumbnailId

    // Jika user memberikan URL gambar baru
    if (
      imageUrl &&
      !imageUrl.startsWith('blob:') &&
      imageUrl.trim().length > 0 &&
      !targetThumbnailId
    ) {
      const uniqueFilename = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`
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
        targetThumbnailId = createdMedia.id
      }
    }

    // Pastikan ada thumbnailId
    if (!targetThumbnailId) {
      const fallbackMedia = await db.select({ id: media.id }).from(media).limit(1)
      if (fallbackMedia.length > 0) {
        targetThumbnailId = fallbackMedia[0].id
      } else {
        const [defaultMedia] = await db
          .insert(media)
          .values({
            alt: title,
            url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&q=80',
            filename: `${slug}-default-${Date.now()}.jpg`,
            mimeType: 'image/jpeg',
            prefix: 'media',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning({ id: media.id })
        targetThumbnailId = defaultMedia.id
      }
    }

    const [inserted] = await db
      .insert(portfolio)
      .values({
        title,
        slug,
        categoryId,
        thumbnailId: targetThumbnailId,
        description: description || null,
        client: client || null,
        year: year || new Date().getFullYear().toString(),
        isFeatured: isFeatured ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: portfolio.id })

    if (inserted && formData.relatedServiceIds && formData.relatedServiceIds.length > 0) {
      await db.insert(portfolioRels).values(
        formData.relatedServiceIds.map((srvId, idx) => ({
          order: idx + 1,
          parentId: inserted.id,
          path: 'relatedServices',
          servicesId: srvId,
        }))
      )
    }

    revalidatePath('/admin/portfolio')
    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in createPortfolio:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menambah portfolio',
    }
  }
}

export async function updatePortfolio(
  id: number,
  formData: PortfolioInput
) {
  try {
    await requireAdminSession()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID portfolio tidak valid' }
    }

    const parse = portfolioSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const {
      title,
      slug,
      categoryId,
      description,
      client,
      year,
      isFeatured,
      imageUrl,
    } = parse.data
    let targetThumbnailId = parse.data.thumbnailId

    if (
      imageUrl &&
      !imageUrl.startsWith('blob:') &&
      imageUrl.trim().length > 0 &&
      !targetThumbnailId
    ) {
      const uniqueFilename = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.jpg`
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
        targetThumbnailId = createdMedia.id
      }
    }

    const updateValues: Partial<typeof portfolio.$inferInsert> = {
      title,
      slug,
      categoryId,
      description: description || null,
      client: client || null,
      year: year || null,
      isFeatured: isFeatured ?? true,
      updatedAt: new Date(),
    }

    if (targetThumbnailId) {
      updateValues.thumbnailId = targetThumbnailId
    }

    await db.update(portfolio).set(updateValues).where(eq(portfolio.id, id))

    if (formData.relatedServiceIds !== undefined) {
      await db.delete(portfolioRels).where(eq(portfolioRels.parentId, id))
      if (formData.relatedServiceIds.length > 0) {
        await db.insert(portfolioRels).values(
          formData.relatedServiceIds.map((srvId, idx) => ({
            order: idx + 1,
            parentId: id,
            path: 'relatedServices',
            servicesId: srvId,
          }))
        )
      }
    }

    revalidatePath('/admin/portfolio')
    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in updatePortfolio:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui portfolio',
    }
  }
}

export async function toggleFeatured(id: number, currentStatus: boolean) {
  try {
    await requireAdminSession()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID portfolio tidak valid' }
    }

    await db
      .update(portfolio)
      .set({
        isFeatured: !currentStatus,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, id))

    revalidatePath('/admin/portfolio')
    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in toggleFeatured:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengubah status featured',
    }
  }
}

export async function deletePortfolio(id: number) {
  try {
    await requireAdminSession()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID portfolio tidak valid' }
    }

    await db.delete(portfolio).where(eq(portfolio.id, id))

    revalidatePath('/admin/portfolio')
    revalidatePath('/admin')
    revalidatePath('/portfolio')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deletePortfolio:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghapus portfolio',
    }
  }
}
