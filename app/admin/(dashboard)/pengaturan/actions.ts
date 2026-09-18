'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { siteSettings, heroSection, media } from '@/lib/db/schema'
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
 * Update General Site Settings (Row 1)
 */
export async function updateSiteSettingsAction(formData: FormData) {
  try {
    await checkAuth()

    const siteName = (formData.get('siteName') as string)?.trim()
    const tagline = (formData.get('tagline') as string)?.trim() || null
    const logoIdRaw = formData.get('logoId') as string
    const logoId = logoIdRaw && !isNaN(parseInt(logoIdRaw)) && parseInt(logoIdRaw) > 0 
      ? parseInt(logoIdRaw) 
      : null
    const email = (formData.get('email') as string)?.trim() || null
    const phone = (formData.get('phone') as string)?.trim() || null
    const whatsappNumber = (formData.get('whatsappNumber') as string)?.trim() || null
    const whatsappMessage = (formData.get('whatsappMessage') as string)?.trim() || null
    const address = (formData.get('address') as string)?.trim() || null

    if (!siteName) {
      return { success: false, error: 'Nama situs (Site Name) wajib diisi.' }
    }

    // Check if row 1 exists
    const existing = await db.query.siteSettings.findFirst()

    if (existing) {
      await db
        .update(siteSettings)
        .set({
          siteName,
          tagline,
          logoId,
          email,
          phone,
          whatsappNumber,
          whatsappMessage,
          address,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, existing.id))
    } else {
      await db.insert(siteSettings).values({
        id: 1,
        siteName,
        tagline,
        logoId,
        email,
        phone,
        whatsappNumber,
        whatsappMessage,
        address,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    revalidatePath('/admin/pengaturan')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error: any) {
    console.error('Error updating site settings:', error)
    return {
      success: false,
      error: error.message || 'Gagal menyimpan pengaturan situs.',
    }
  }
}

/**
 * Update Hero Section (Row 1)
 */
export async function updateHeroSectionAction(formData: FormData) {
  try {
    await checkAuth()

    const headline = (formData.get('headline') as string)?.trim()
    const subheadline = (formData.get('subheadline') as string)?.trim()
    const ctaPrimaryLabel = (formData.get('ctaPrimaryLabel') as string)?.trim()
    const ctaPrimaryUrl = (formData.get('ctaPrimaryUrl') as string)?.trim()
    const ctaSecondaryLabel = (formData.get('ctaSecondaryLabel') as string)?.trim()
    const ctaSecondaryUrl = (formData.get('ctaSecondaryUrl') as string)?.trim()

    if (!headline || !subheadline) {
      return { success: false, error: 'Headline dan Subheadline wajib diisi.' }
    }
    if (!ctaPrimaryLabel || !ctaPrimaryUrl) {
      return { success: false, error: 'Tombol utama (Label & URL) wajib diisi.' }
    }
    if (!ctaSecondaryLabel || !ctaSecondaryUrl) {
      return { success: false, error: 'Tombol sekunder (Label & URL) wajib diisi.' }
    }

    const existing = await db.query.heroSection.findFirst()

    if (existing) {
      await db
        .update(heroSection)
        .set({
          headline,
          subheadline,
          ctaPrimaryLabel,
          ctaPrimaryUrl,
          ctaSecondaryLabel,
          ctaSecondaryUrl,
          updatedAt: new Date(),
        })
        .where(eq(heroSection.id, existing.id))
    } else {
      await db.insert(heroSection).values({
        id: 1,
        headline,
        subheadline,
        ctaPrimaryLabel,
        ctaPrimaryUrl,
        ctaSecondaryLabel,
        ctaSecondaryUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    revalidatePath('/admin/pengaturan')
    revalidatePath('/', 'page')

    return { success: true }
  } catch (error: any) {
    console.error('Error updating hero section:', error)
    return {
      success: false,
      error: error.message || 'Gagal menyimpan pengaturan hero section.',
    }
  }
}

/**
 * Quick Logo Upload Action directly to Supabase Storage
 */
export async function uploadLogoAction(formData: FormData) {
  try {
    const { supabase } = await checkAuth()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return { success: false, error: 'Tidak ada berkas logo yang dipilih.' }
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Format logo harus berupa JPG, PNG, WebP, atau SVG.',
      }
    }

    const maxSizeBytes = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: 'Ukuran berkas logo tidak boleh melebihi 5MB.',
      }
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueFilename = `logo_${Date.now()}_${cleanName}`
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
      return {
        success: false,
        error: `Gagal upload ke storage: ${uploadError.message}`,
      }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('media').getPublicUrl(storagePath)

    const [createdMedia] = await db
      .insert(media)
      .values({
        alt: 'Logo Snava Creative',
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

    revalidatePath('/admin/pengaturan')
    revalidatePath('/admin/media')

    return {
      success: true,
      mediaId: createdMedia.id,
      url: createdMedia.url,
    }
  } catch (error: any) {
    console.error('Error uploading logo:', error)
    return {
      success: false,
      error: error.message || 'Gagal mengunggah logo.',
    }
  }
}
