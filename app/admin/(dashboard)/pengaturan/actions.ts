'use server'

import { getErrorMessage } from '@/lib/utils/error'

import { requireAdminSession } from '@/lib/admin/auth'
import { db } from '@/lib/db'
import {
  aboutPage,
  aboutPageValues,
  heroSection,
  media,
  pricingSection,
  servicesSection,
  siteSettings,
  siteSettingsSocialLinks,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

/**
 * Update General Site Settings (Row 1)
 */
export async function updateSiteSettingsAction(formData: FormData) {
  try {
    await requireAdminSession()

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
  } catch (error) {
    console.error('Error updating site settings:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal menyimpan pengaturan situs.'),
    }
  }
}

/**
 * Update Hero Section (Row 1)
 */
export async function updateHeroSectionAction(formData: FormData) {
  try {
    await requireAdminSession()

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
  } catch (error) {
    console.error('Error updating hero section:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal menyimpan pengaturan hero section.'),
    }
  }
}

/**
 * Quick Logo Upload Action directly to Supabase Storage
 */
export async function uploadLogoAction(formData: FormData) {
  try {
    const { supabase } = await requireAdminSession()
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
  } catch (error) {
    console.error('Error uploading logo:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal mengunggah logo.'),
    }
  }
}

/**
 * Update Social Links for Site Settings
 */
export async function updateSocialLinksAction(
  links: Array<{ platform: string; url: string }>
) {
  try {
    await requireAdminSession()

    const existing = await db.query.siteSettings.findFirst()
    const parentId = existing ? existing.id : 1

    if (!existing) {
      await db.insert(siteSettings).values({
        id: 1,
        siteName: 'Snava Creative',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Delete current social links for parent
    await db
      .delete(siteSettingsSocialLinks)
      .where(eq(siteSettingsSocialLinks.parentId, parentId))

    // Insert new valid links
    const validLinks = links.filter((l) => l.platform && l.url?.trim())
    if (validLinks.length > 0) {
      await db.insert(siteSettingsSocialLinks).values(
        validLinks.map((l, index) => ({
          order: index + 1,
          parentId,
          id: crypto.randomUUID().replace(/-/g, '').slice(0, 24),
          platform: l.platform as typeof siteSettingsSocialLinks.$inferInsert.platform,
          url: l.url.trim(),
        }))
      )
    }

    revalidatePath('/admin/pengaturan')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    console.error('Error updating social links:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal menyimpan link media sosial.'),
    }
  }
}

/**
 * Update About Page & Values
 */
export async function updateAboutPageAction(
  formData: FormData,
  values: Array<{ icon: string; title: string; description: string }>
) {
  try {
    await requireAdminSession()

    const title = (formData.get('title') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const vision = (formData.get('vision') as string)?.trim() || null

    if (!title || !description) {
      return { success: false, error: 'Judul dan Deskripsi Tentang Kami wajib diisi.' }
    }

    const existing = await db.query.aboutPage.findFirst()
    const parentId = existing ? existing.id : 1

    if (existing) {
      await db
        .update(aboutPage)
        .set({
          title,
          description,
          vision,
          updatedAt: new Date(),
        })
        .where(eq(aboutPage.id, existing.id))
    } else {
      await db.insert(aboutPage).values({
        id: 1,
        title,
        description,
        vision,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Replace values
    await db.delete(aboutPageValues).where(eq(aboutPageValues.parentId, parentId))

    const validValues = values.filter((v) => v.title?.trim() && v.description?.trim())
    if (validValues.length > 0) {
      await db.insert(aboutPageValues).values(
        validValues.map((v, index) => ({
          order: index + 1,
          parentId,
          id: crypto.randomUUID().replace(/-/g, '').slice(0, 24),
          icon: (v.icon || 'Target') as typeof aboutPageValues.$inferInsert.icon,
          title: v.title.trim(),
          description: v.description.trim(),
        }))
      )
    }

    revalidatePath('/admin/pengaturan')
    revalidatePath('/', 'page')

    return { success: true }
  } catch (error) {
    console.error('Error updating about page:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal menyimpan data Tentang Kami.'),
    }
  }
}

/**
 * Update Section Texts (Services Section & Pricing Section)
 */
export async function updateSectionTextsAction(formData: FormData) {
  try {
    await requireAdminSession()

    const servicesTitle = (formData.get('servicesTitle') as string)?.trim()
    const servicesDescription = (formData.get('servicesDescription') as string)?.trim()
    const pricingHeadline = (formData.get('pricingHeadline') as string)?.trim()
    const pricingSubheadline = (formData.get('pricingSubheadline') as string)?.trim()

    if (!servicesTitle || !servicesDescription) {
      return {
        success: false,
        error: 'Judul dan Deskripsi Seksi Layanan wajib diisi.',
      }
    }

    if (!pricingHeadline || !pricingSubheadline) {
      return {
        success: false,
        error: 'Headline dan Subheadline Seksi Harga wajib diisi.',
      }
    }

    // Update Services Section
    const existingServicesSection = await db.query.servicesSection.findFirst()
    if (existingServicesSection) {
      await db
        .update(servicesSection)
        .set({
          title: servicesTitle,
          description: servicesDescription,
          updatedAt: new Date(),
        })
        .where(eq(servicesSection.id, existingServicesSection.id))
    } else {
      await db.insert(servicesSection).values({
        id: 1,
        title: servicesTitle,
        description: servicesDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    // Update Pricing Section
    const existingPricingSection = await db.query.pricingSection.findFirst()
    if (existingPricingSection) {
      await db
        .update(pricingSection)
        .set({
          headline: pricingHeadline,
          subheadline: pricingSubheadline,
          updatedAt: new Date(),
        })
        .where(eq(pricingSection.id, existingPricingSection.id))
    } else {
      await db.insert(pricingSection).values({
        id: 1,
        headline: pricingHeadline,
        subheadline: pricingSubheadline,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    revalidatePath('/admin/pengaturan')
    revalidatePath('/', 'page')
    revalidatePath('/services', 'page')
    revalidatePath('/pricing', 'page')

    return { success: true }
  } catch (error) {
    console.error('Error updating section texts:', error)
    return {
      success: false,
      error: getErrorMessage(error, 'Gagal menyimpan teks seksi beranda.'),
    }
  }
}
