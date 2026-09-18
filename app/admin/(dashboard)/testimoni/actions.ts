'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'

const testimonialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama klien minimal 2 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  company: z
    .string()
    .trim()
    .min(2, 'Nama perusahaan minimal 2 karakter')
    .max(255, 'Nama perusahaan maksimal 255 karakter'),
  role: z
    .string()
    .trim()
    .min(2, 'Jabatan minimal 2 karakter')
    .max(255, 'Jabatan maksimal 255 karakter'),
  content: z
    .string()
    .trim()
    .min(10, 'Isi ulasan minimal 10 karakter')
    .max(2000, 'Isi ulasan maksimal 2000 karakter'),
  rating: z.string().trim().default('5'),
  isFeatured: z.boolean().default(true),
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
 * Buat testimoni baru
 */
export async function createTestimonial(formData: {
  name: string
  company: string
  role: string
  content: string
  rating?: string
  isFeatured?: boolean
}) {
  try {
    await checkAuth()

    const parse = testimonialSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const { name, company, role, content, rating, isFeatured } = parse.data

    await db.insert(testimonials).values({
      name,
      company,
      role,
      content,
      rating: rating || '5',
      isFeatured: isFeatured ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath('/admin/testimoni')
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in createTestimonial:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menambah testimoni',
    }
  }
}

/**
 * Perbarui testimoni yang ada
 */
export async function updateTestimonial(
  id: number,
  formData: {
    name: string
    company: string
    role: string
    content: string
    rating?: string
    isFeatured?: boolean
  }
) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID testimoni tidak valid' }
    }

    const parse = testimonialSchema.safeParse(formData)
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Data input tidak valid',
      }
    }

    const { name, company, role, content, rating, isFeatured } = parse.data

    await db
      .update(testimonials)
      .set({
        name,
        company,
        role,
        content,
        rating: rating || '5',
        isFeatured: isFeatured ?? true,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))

    revalidatePath('/admin/testimoni')
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in updateTestimonial:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui testimoni',
    }
  }
}

/**
 * Quick toggle status featured / unggulan
 */
export async function toggleFeaturedTestimonial(id: number, currentStatus: boolean) {
  try {
    await checkAuth()

    await db
      .update(testimonials)
      .set({
        isFeatured: !currentStatus,
        updatedAt: new Date(),
      })
      .where(eq(testimonials.id, id))

    revalidatePath('/admin/testimoni')
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in toggleFeaturedTestimonial:', error)
    return {
      success: false,
      error: 'Gagal mengubah status unggulan',
    }
  }
}

/**
 * Hapus testimoni dari database
 */
export async function deleteTestimonial(id: number) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID testimoni tidak valid' }
    }

    await db.delete(testimonials).where(eq(testimonials.id, id))

    revalidatePath('/admin/testimoni')
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteTestimonial:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghapus testimoni',
    }
  }
}

/**
 * Seed data contoh jika tabel testimoni masih kosong
 */
export async function seedTestimonialsAction() {
  try {
    await checkAuth()

    const existing = await db.query.testimonials.findMany({ limit: 1 })
    if (existing.length > 0) {
      return {
        success: false,
        error: 'Tabel testimoni sudah memiliki data.',
      }
    }

    for (const item of fallbackTestimonials) {
      await db.insert(testimonials).values({
        name: item.name,
        company: item.company,
        role: item.role,
        content: item.content,
        rating: (item.rating || 5).toString(),
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    revalidatePath('/admin/testimoni')
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, count: fallbackTestimonials.length }
  } catch (error) {
    console.error('Error in seedTestimonialsAction:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Gagal memuat data awal testimoni',
    }
  }
}
