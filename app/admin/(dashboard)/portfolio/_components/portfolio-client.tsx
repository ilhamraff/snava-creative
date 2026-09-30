'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import {
  Briefcase,
  Edit2,
  ImageIcon,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { deletePortfolio, toggleFeatured } from '../actions'
import type { CategoryOption, PortfolioWithRelations } from '../types'

interface PortfolioClientProps {
  initialItems: PortfolioWithRelations[]
  categories: CategoryOption[]
}

export function PortfolioClient({ initialItems, categories }: PortfolioClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [onlyFeatured, setOnlyFeatured] = useState(false)
  const [deleteItem, setDeleteItem] = useState<PortfolioWithRelations | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = initialItems.filter((item) => {
    const normalizedSearch = search.toLowerCase()
    const matchesSearch =
      item.title.toLowerCase().includes(normalizedSearch) ||
      item.client?.toLowerCase().includes(normalizedSearch) ||
      item.slug.toLowerCase().includes(normalizedSearch)
    const matchesCategory =
      selectedCategory === 'all' || item.categoryId.toString() === selectedCategory
    const matchesFeatured = !onlyFeatured || item.isFeatured === true

    return matchesSearch && matchesCategory && matchesFeatured
  })

  function handleToggleFeatured(item: PortfolioWithRelations) {
    startTransition(async () => {
      const result = await toggleFeatured(item.id, item.isFeatured ?? false)
      if (result.success) {
        toast.success(
          item.isFeatured ? 'Dihapus dari Featured' : 'Ditambahkan ke Featured',
        )
      } else {
        toast.error(result.error ?? 'Gagal mengubah status featured')
      }
    })
  }

  function handleDelete() {
    if (!deleteItem) return

    startTransition(async () => {
      const result = await deletePortfolio(deleteItem.id)
      if (result.success) {
        toast.success('Portfolio berhasil dihapus')
        setDeleteItem(null)
      } else {
        toast.error(result.error ?? 'Gagal menghapus portfolio')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Portfolio</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola karya, studi kasus, dan galeri proyek Snava Creative.
          </p>
        </div>

        <Link
          href="/admin/portfolio/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Tambah Portfolio</span>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full min-w-0 flex-1 sm:min-w-50 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul, klien, slug..."
              aria-label="Cari portfolio"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filter kategori"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-auto"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOnlyFeatured((current) => !current)}
            aria-pressed={onlyFeatured}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition sm:w-auto ${
              onlyFeatured
                ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                onlyFeatured ? 'fill-indigo-400 text-indigo-400' : 'text-zinc-500'
              }`}
              aria-hidden="true"
            />
            <span>Featured</span>
          </button>
        </div>

        <div className="text-xs font-medium text-zinc-400">
          Total: <span className="text-zinc-200">{filtered.length}</span> item
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800/80 bg-zinc-950/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Proyek</th>
                <th className="px-5 py-3.5 font-semibold">Kategori</th>
                <th className="px-5 py-3.5 font-semibold">Klien / Tahun</th>
                <th className="px-5 py-3.5 text-center font-semibold">Featured</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                    <Briefcase className="mx-auto mb-2 h-8 w-8 stroke-1 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-400">
                      Tidak ada portfolio ditemukan
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {search || selectedCategory !== 'all' || onlyFeatured
                        ? 'Coba sesuaikan filter pencarian Anda.'
                        : 'Mulai dengan menambahkan portfolio baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const thumbnailUrl = item.thumbnail?.url || ''

                  return (
                    <tr key={item.id} className="group transition-colors hover:bg-zinc-900/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                            {thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumbnailUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : null}
                            <ImageIcon className="absolute -z-10 h-5 w-5 text-zinc-700" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 transition-colors group-hover:text-indigo-300">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-zinc-400">/{item.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                            {item.category?.name ?? 'Tanpa Kategori'}
                          </span>
                          {item.relatedServices?.length ? (
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {item.relatedServices.map((relation) => (
                                <span
                                  key={relation.id}
                                  className="rounded border border-indigo-500/20 bg-indigo-950/60 px-1.5 py-0.5 text-[10px] text-indigo-300"
                                >
                                  {relation.service?.title || 'Layanan'}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">
                        <div>{item.client || '—'}</div>
                        <div className="text-[11px] text-zinc-500">{item.year || '—'}</div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          disabled={isPending}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition ${
                            item.isFeatured
                              ? 'text-amber-400 hover:bg-amber-500/10'
                              : 'text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400'
                          }`}
                          aria-label={
                            item.isFeatured
                              ? `Hapus ${item.title} dari featured`
                              : `Jadikan ${item.title} featured`
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${item.isFeatured ? 'fill-amber-400' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/portfolio/${item.id}/edit`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                            aria-label={`Edit ${item.title}`}
                            title="Edit Portfolio"
                          >
                            <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                            aria-label={`Hapus ${item.title}`}
                            title="Hapus Portfolio"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
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

      {deleteItem ? (
        <div className="admin-dialog-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-portfolio-title"
          >
            <h2 id="delete-portfolio-title" className="text-base font-semibold text-zinc-100">
              Hapus Portfolio
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              Apakah Anda yakin ingin menghapus portfolio{' '}
              <strong className="font-semibold text-zinc-100">
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
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Hapus Portfolio
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
