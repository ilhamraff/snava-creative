'use server'

import { revalidatePath } from 'next/cache'
import { testimonialSchema, type TestimonialInput } from '@/lib/schemas/testimonial'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testimonials } from '@/lib/db/schema'
import { requireAdminSession } from '@/lib/admin/auth'
import { testimonials as fallbackTestimonials } from '@/lib/data/testimonials'

/**
 * Buat testimoni baru
 */
export async function createTestimonial(formData: TestimonialInput) {
  try {
    await requireAdminSession()

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
  formData: TestimonialInput
) {
  try {
    await requireAdminSession()

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
    await requireAdminSession()

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
    await requireAdminSession()

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
    await requireAdminSession()

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
