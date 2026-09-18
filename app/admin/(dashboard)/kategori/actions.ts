'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, portfolio } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(100, 'Nama kategori maksimal 100 karakter'),
})

async function checkAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Sesi tidak valid atau tidak diizinkan.')
  }

  return user
}

export async function createCategory(name: string) {
  try {
    await checkAuth()

    const parse = categorySchema.safeParse({ name })
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Input tidak valid',
      }
    }

    await db.insert(categories).values({
      name: parse.data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath('/admin/kategori')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error in createCategory:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menambah kategori',
    }
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID kategori tidak valid' }
    }

    const parse = categorySchema.safeParse({ name })
    if (!parse.success) {
      return {
        success: false,
        error: parse.error.issues[0]?.message ?? 'Input tidak valid',
      }
    }

    await db
      .update(categories)
      .set({
        name: parse.data.name,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))

    revalidatePath('/admin/kategori')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error in updateCategory:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat memperbarui kategori',
    }
  }
}

export async function deleteCategory(id: number) {
  try {
    await checkAuth()

    if (!id || typeof id !== 'number') {
      return { success: false, error: 'ID kategori tidak valid' }
    }

    // Integrity check: pastikan tidak ada portfolio yang menggunakan kategori ini
    const usedByPortfolio = await db
      .select({ id: portfolio.id })
      .from(portfolio)
      .where(eq(portfolio.categoryId, id))
      .limit(1)

    if (usedByPortfolio.length > 0) {
      return {
        success: false,
        error:
          'Kategori ini masih digunakan oleh item portfolio. Hapus atau pindahkan relasi portfolio terlebih dahulu.',
      }
    }

    await db.delete(categories).where(eq(categories.id, id))

    revalidatePath('/admin/kategori')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteCategory:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menghapus kategori',
    }
  }
}
