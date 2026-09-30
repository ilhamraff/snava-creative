'use client'

import React, { useState, useTransition } from 'react'
import { Plus, Search, Edit2, Trash2, X, Loader2, AlertTriangle, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { createCategory, updateCategory, deleteCategory } from '../actions'

export interface CategoryWithCount {
  id: number
  name: string
  createdAt: Date | null
  updatedAt: Date | null
  portfolioCount: number
}

interface CategoryClientProps {
  initialCategories: CategoryWithCount[]
}

export function CategoryClient({ initialCategories }: CategoryClientProps) {
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()

  // Modal states
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const [editItem, setEditItem] = useState<CategoryWithCount | null>(null)
  const [editName, setEditName] = useState('')

  const [deleteItem, setDeleteItem] = useState<CategoryWithCount | null>(null)

  // Filtered categories by search query
  const filtered = initialCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    startTransition(async () => {
      const res = await createCategory(newName.trim())
      if (res.success) {
        toast.success('Kategori berhasil ditambahkan')
        setNewName('')
        setCreateOpen(false)
      } else {
        toast.error(res.error ?? 'Gagal menambah kategori')
      }
    })
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem || !editName.trim()) return

    startTransition(async () => {
      const res = await updateCategory(editItem.id, editName.trim())
      if (res.success) {
        toast.success('Kategori berhasil diperbarui')
        setEditItem(null)
      } else {
        toast.error(res.error ?? 'Gagal memperbarui kategori')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return

    startTransition(async () => {
      const res = await deleteCategory(deleteItem.id)
      if (res.success) {
        toast.success('Kategori berhasil dihapus')
        setDeleteItem(null)
      } else {
        toast.error(res.error ?? 'Gagal menghapus kategori')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Kategori</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola kategori untuk pengelompokan portofolio dan layanan Snava Creative.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="text-xs font-medium text-zinc-400">
          Total: <span className="text-zinc-200">{filtered.length}</span> kategori
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800/80 bg-zinc-950/40 text-[11px] uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Nama Kategori</th>
                <th className="px-5 py-3.5 font-semibold">Portfolio Terkait</th>
                <th className="px-5 py-3.5 font-semibold">Dibuat Pada</th>
                <th className="px-5 py-3.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-zinc-500">
                    <Layers className="mx-auto mb-2 h-8 w-8 stroke-1 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-400">Tidak ada kategori ditemukan</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {search ? 'Coba ubah kata kunci pencarian Anda.' : 'Mulai dengan menambahkan kategori baru.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((cat) => {
                  const dateStr = cat.createdAt
                    ? new Date(cat.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—'

                  return (
                    <tr
                      key={cat.id}
                      className="group transition-colors hover:bg-zinc-900/60"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                          {cat.name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                          {cat.portfolioCount} item
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-400">
                        {dateStr}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditItem(cat)
                              setEditName(cat.name)
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                            title="Edit Kategori"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteItem(cat)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                            title="Hapus Kategori"
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

      {/* Modal: Tambah Kategori */}
      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Tambah Kategori Baru</h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-md text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label htmlFor="cat-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nama Kategori
                </label>
                <input
                  id="cat-name"
                  type="text"
                  autoFocus
                  required
                  placeholder="Contoh: Branding, Motion, dll"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || !newName.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: Edit Kategori */}
      {editItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Edit Kategori</h3>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="rounded-md text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div>
                <label htmlFor="edit-cat-name" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nama Kategori
                </label>
                <input
                  id="edit-cat-name"
                  type="text"
                  autoFocus
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending || !editName.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Perbarui
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: Hapus Kategori */}
      {deleteItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Hapus Kategori</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus kategori{' '}
              <strong className="text-white font-semibold">&ldquo;{deleteItem.name}&rdquo;</strong>?
            </p>

            {deleteItem.portfolioCount > 0 ? (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                ⚠️ Kategori ini memiliki <strong>{deleteItem.portfolioCount} item portfolio</strong> terkait. Anda harus menghapus atau memindahkan relasi portfolio tersebut sebelum dapat menghapus kategori ini.
              </div>
            ) : null}

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
                disabled={isPending || deleteItem.portfolioCount > 0}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Hapus Kategori
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
