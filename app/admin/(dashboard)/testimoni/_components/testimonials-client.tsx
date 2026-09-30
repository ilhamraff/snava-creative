'use client'

import React, { useState, useTransition } from 'react'
import {
  MessageSquareQuote,
  Plus,
  Search,
  Star,
  Edit2,
  Trash2,
  Loader2,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Testimonial } from '@/lib/db/schema'
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleFeaturedTestimonial,
  seedTestimonialsAction,
} from '../actions'

interface TestimonialsClientProps {
  initialItems: Testimonial[]
}

function getInitials(name: string) {
  if (!name) return 'KL'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatDate(date?: Date | string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function TestimonialsClient({ initialItems }: TestimonialsClientProps) {
  const [items, setItems] = useState<Testimonial[]>(initialItems)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [deleteItem, setDeleteItem] = useState<Testimonial | null>(null)

  // Form inputs state
  const [formName, setFormName] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formRating, setFormRating] = useState('5')
  const [formIsFeatured, setFormIsFeatured] = useState(true)

  // Transitions
  const [isPending, startTransition] = useTransition()

  // Keep successful local mutations until the server supplies a new snapshot.
  const [previousItems, setPreviousItems] = useState(initialItems)
  if (initialItems !== previousItems) {
    setPreviousItems(initialItems)
    setItems(initialItems)
  }

  const openCreateModal = () => {
    setEditingItem(null)
    setFormName('')
    setFormCompany('')
    setFormRole('')
    setFormContent('')
    setFormRating('5')
    setFormIsFeatured(true)
    setModalOpen(true)
  }

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item)
    setFormName(item.name)
    setFormCompany(item.company)
    setFormRole(item.role)
    setFormContent(item.content)
    setFormRating(item.rating || '5')
    setFormIsFeatured(item.isFeatured ?? true)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formCompany.trim() || !formRole.trim() || !formContent.trim()) {
      toast.error('Harap lengkapi semua kolom yang wajib diisi')
      return
    }

    startTransition(async () => {
      const payload = {
        name: formName.trim(),
        company: formCompany.trim(),
        role: formRole.trim(),
        content: formContent.trim(),
        rating: formRating,
        isFeatured: formIsFeatured,
      }

      if (editingItem) {
        const res = await updateTestimonial(editingItem.id, payload)
        if (res.success) {
          toast.success('Testimoni berhasil diperbarui')
          setItems((prev) =>
            prev.map((t) => (t.id === editingItem.id ? { ...t, ...payload } : t))
          )
          setModalOpen(false)
        } else {
          toast.error(res.error || 'Gagal memperbarui testimoni')
        }
      } else {
        const res = await createTestimonial(payload)
        if (res.success) {
          toast.success('Testimoni baru berhasil ditambahkan')
          setModalOpen(false)
        } else {
          toast.error(res.error || 'Gagal menambah testimoni')
        }
      }
    })
  }

  const handleToggleFeatured = (item: Testimonial) => {
    startTransition(async () => {
      const nextStatus = !item.isFeatured
      const res = await toggleFeaturedTestimonial(item.id, item.isFeatured ?? false)
      if (res.success) {
        setItems((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, isFeatured: nextStatus } : t))
        )
        toast.success(
          nextStatus
            ? 'Ditampilkan sebagai testimoni unggulan'
            : 'Dihapus dari status unggulan'
        )
      } else {
        toast.error(res.error || 'Gagal mengubah status')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return

    startTransition(async () => {
      const res = await deleteTestimonial(deleteItem.id)
      if (res.success) {
        toast.success('Testimoni berhasil dihapus')
        setItems((prev) => prev.filter((t) => t.id !== deleteItem.id))
        setDeleteItem(null)
      } else {
        toast.error(res.error || 'Gagal menghapus testimoni')
      }
    })
  }

  const handleSeed = () => {
    startTransition(async () => {
      const res = await seedTestimonialsAction()
      if (res.success) {
        toast.success(`Berhasil memuat ${res.count} testimoni awal`)
      } else {
        toast.error(res.error || 'Gagal memuat data awal')
      }
    })
  }

  // Filtered items
  const filteredItems = items.filter((item) => {
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)

    const matchesRating =
      ratingFilter === 'all' || Math.round(Number(item.rating || 5)).toString() === ratingFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'featured' && item.isFeatured === true) ||
      (statusFilter === 'standard' && item.isFeatured === false)

    return matchesSearch && matchesRating && matchesStatus
  })

  const featuredCount = items.filter((i) => i.isFeatured === true).length

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Testimoni
            </h1>
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
              {items.length} Testimoni
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              {featuredCount} Unggulan
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola ulasan dan rekomendasi dari klien untuk ditampilkan di website Snava Creative.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length === 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={handleSeed}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-900/50 transition disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Muat Data Awal</span>
            </button>
          )}

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Testimoni</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari nama klien, perusahaan, atau isi ulasan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Semua Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
              <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
              <option value="3">⭐⭐⭐ (3 Bintang)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Semua Status</option>
              <option value="featured">Hanya Unggulan (Featured)</option>
              <option value="standard">Standar (Non-Featured)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Table List */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-950/70 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Klien & Perusahaan</th>
                <th className="px-5 py-3.5 max-w-md">Isi Testimoni</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Unggulan</th>
                <th className="px-5 py-3.5">Waktu Dibuat</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquareQuote className="h-10 w-10 text-zinc-600 mb-2 stroke-1" />
                      <p className="text-sm font-medium text-zinc-300">
                        {search || ratingFilter !== 'all' || statusFilter !== 'all'
                          ? 'Tidak ada testimoni yang cocok dengan filter'
                          : 'Belum ada testimoni klien'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 max-w-xs">
                        {search || ratingFilter !== 'all' || statusFilter !== 'all'
                          ? 'Coba sesuaikan kata kunci pencarian Anda.'
                          : 'Klik "Tambah Testimoni" atau "Muat Data Awal" untuk mulai menambahkan ulasan.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const ratingNum = Math.round(Number(item.rating || 5))

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-zinc-900/60"
                    >
                      {/* Column 1: Client Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-950 to-zinc-900 border border-indigo-500/20 text-indigo-300 font-bold text-xs shadow-inner">
                            {getInitials(item.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-zinc-400 truncate max-w-xs mt-0.5">
                              {item.role} • <span className="text-zinc-300 font-medium">{item.company}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Testimonial Content */}
                      <td className="px-5 py-3.5 max-w-md">
                        <p className="line-clamp-2 text-zinc-300 text-xs leading-relaxed italic" title={item.content}>
                          &ldquo;{item.content}&rdquo;
                        </p>
                      </td>

                      {/* Column 3: Rating Stars */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < ratingNum
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-700'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-mono font-medium text-zinc-400 ml-1">
                            {item.rating || '5'}.0
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Featured Toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
                            item.isFeatured
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              : 'bg-zinc-950/60 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              item.isFeatured ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'
                            }`}
                          />
                          <span>{item.isFeatured ? 'Unggulan' : 'Standar'}</span>
                        </button>
                      </td>

                      {/* Column 5: Created Date */}
                      <td className="px-5 py-3.5 text-zinc-400 text-[11px]">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Column 6: Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                            title="Edit Testimoni"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition"
                            title="Hapus Testimoni"
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

      {/* MODAL: Tambah / Edit Testimoni */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  {editingItem ? 'Edit Testimoni Klien' : 'Tambah Testimoni Baru'}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {editingItem
                    ? 'Perbarui rincian ulasan atau data klien.'
                    : 'Tambahkan testimoni baru untuk ditampilkan di website.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Nama Klien & Perusahaan */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama Klien *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rina Wijaya"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Perusahaan / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kopi Nusantara"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Jabatan / Role & Rating */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Jabatan / Posisi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Founder & CEO"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Rating Kepuasan
                  </label>
                  <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star.toString())}
                        className="p-0.5 transition hover:scale-110"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            star <= Number(formRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-[11px] font-mono text-zinc-400 ml-2">
                      {formRating}.0 / 5
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Unggulan */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    Testimoni Unggulan (Featured)
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Tampilkan ulasan ini pada carousel testimonial homepage
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Isi Testimoni */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Isi Ulasan Testimoni *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan pengalaman atau ulasan klien tentang kerja sama dengan Snava Creative..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
                <div className="flex justify-between items-center mt-1 text-[10px] text-zinc-500">
                  <span>Dianjurkan antara 20 - 50 kata agar proporsional.</span>
                  <span>{formContent.length} karakter</span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-800/80 pt-4">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Testimoni'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/60 border border-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Hapus Testimoni
                </h3>
                <p className="text-xs text-zinc-400">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus ulasan dari{' '}
              <span className="font-semibold text-white">
                {deleteItem.name} ({deleteItem.company})
              </span>
              ? Ulasan ini akan hilang dari database dan tidak lagi ditampilkan di website.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-800/80 pt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteItem(null)}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 hover:bg-red-500 disabled:opacity-50 transition"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Hapus Testimoni</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
