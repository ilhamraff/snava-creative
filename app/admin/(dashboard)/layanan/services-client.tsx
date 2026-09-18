'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteService, toggleServiceStatus } from './actions'
import { renderServiceIcon } from './service-form'

export interface ServiceWithRelations {
  id: number
  title: string
  slug: string
  category: string | null
  description: string | null
  icon: string | null
  isActive: boolean | null
  sortOrder: string | null
  heroHeadline: string | null
  heroDescription: string | null
  heroImageId: number | null
  createdAt: Date | null
  updatedAt: Date | null
  heroImage?: {
    id: number
    url: string | null
    alt: string
  } | null
}

interface CategoryOption {
  id: number
  name: string
}

interface ServicesClientProps {
  initialItems: ServiceWithRelations[]
  categories: CategoryOption[]
}

export function ServicesClient({
  initialItems,
  categories,
}: ServicesClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [deleteItem, setDeleteItem] = useState<ServiceWithRelations | null>(null)

  // Filtered items
  const filtered = initialItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleToggleStatus = (item: ServiceWithRelations) => {
    startTransition(async () => {
      const res = await toggleServiceStatus(item.id, item.isActive ?? true)
      if (res.success) {
        toast.success(
          item.isActive
            ? 'Layanan dinonaktifkan'
            : 'Layanan diaktifkan'
        )
      } else {
        toast.error(res.error ?? 'Gagal mengubah status layanan')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return

    startTransition(async () => {
      const res = await deleteService(deleteItem.id)
      if (res.success) {
        toast.success('Layanan berhasil dihapus')
        setDeleteItem(null)
      } else {
        toast.error(res.error ?? 'Gagal menghapus layanan')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Layanan
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola paket layanan, penawaran, dan spesifikasi keahlian Snava Creative.
          </p>
        </div>

        <Link
          href="/admin/layanan/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Layanan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-50 max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul layanan, slug, deskripsi..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs font-medium text-zinc-400">
          Total: <span className="text-zinc-200">{filtered.length}</span> layanan
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800/80 bg-zinc-950/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Layanan</th>
                <th className="px-5 py-3.5 font-semibold">Kategori</th>
                <th className="px-5 py-3.5 font-semibold">Urutan</th>
                <th className="px-5 py-3.5 text-center font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Layers className="mx-auto mb-2 h-8 w-8 stroke-1 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-400">
                      Tidak ada layanan ditemukan
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {search || selectedCategory !== 'all'
                        ? 'Coba sesuaikan kata kunci pencarian Anda.'
                        : 'Mulai dengan menambahkan layanan baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-zinc-900/60"
                    >
                      {/* Service Info + Icon */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-indigo-400 group-hover:border-indigo-500/30 group-hover:bg-indigo-950/20 transition-colors">
                            {renderServiceIcon(item.icon, 'h-5 w-5')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate max-w-sm">
                              {item.description || `/${item.slug}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                          {item.category || 'Umum'}
                        </span>
                      </td>

                      {/* Sort Order */}
                      <td className="px-5 py-3.5 text-zinc-400">
                        <span className="font-mono text-[11px] text-zinc-300">
                          #{item.sortOrder || '1'}
                        </span>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          disabled={isPending}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                            item.isActive
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'border border-zinc-800 bg-zinc-950/60 text-zinc-500 hover:text-zinc-300'
                          }`}
                          title="Klik untuk mengubah status"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.isActive ? 'bg-emerald-400' : 'bg-zinc-600'
                            }`}
                          />
                          <span>{item.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/services/${item.slug}`}
                            target="_blank"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                            title="Buka Halaman Layanan di Web"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/layanan/${item.id}/edit`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                            title="Edit Layanan"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                            title="Hapus Layanan"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Hapus Layanan */}
      {deleteItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">
              Hapus Layanan
            </h3>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus layanan{' '}
              <strong className="text-white font-semibold">
                &ldquo;{deleteItem.title}&rdquo;
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteItem(null)}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Hapus Layanan
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
