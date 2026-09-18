'use client'

import React, { useState, useTransition, useRef } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Star,
  Briefcase,
  UploadCloud,
  ImageIcon,
  Link as LinkIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  toggleFeatured,
  uploadMediaAction,
} from './actions'

export interface PortfolioWithRelations {
  id: number
  title: string
  slug: string
  categoryId: number
  thumbnailId: number
  description: string | null
  client: string | null
  year: string | null
  isFeatured: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
  category?: {
    id: number
    name: string
  } | null
  thumbnail?: {
    id: number
    url: string | null
    alt: string
  } | null
}

interface CategoryOption {
  id: number
  name: string
}

interface PortfolioClientProps {
  initialItems: PortfolioWithRelations[]
  categories: CategoryOption[]
}

export function PortfolioClient({
  initialItems,
  categories,
}: PortfolioClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  // Modal states
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<PortfolioWithRelations | null>(null)
  const [deleteItem, setDeleteItem] = useState<PortfolioWithRelations | null>(null)

  // Image mode: 'upload' or 'url'
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')

  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formCategoryId, setFormCategoryId] = useState<number>(
    categories[0]?.id || 1
  )
  const [formThumbnailId, setFormThumbnailId] = useState<number | undefined>()
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formClient, setFormClient] = useState('')
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString())
  const [formDescription, setFormDescription] = useState('')
  const [formIsFeatured, setFormIsFeatured] = useState(true)

  const createFileInputRef = useRef<HTMLInputElement | null>(null)
  const editFileInputRef = useRef<HTMLInputElement | null>(null)

  // Auto-slugify generator
  const handleTitleChange = (val: string, isEdit = false) => {
    setFormTitle(val)
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setFormSlug(generated)
    }
  }

  const resetForm = () => {
    setFormTitle('')
    setFormSlug('')
    setFormCategoryId(categories[0]?.id || 1)
    setFormThumbnailId(undefined)
    setFormImageUrl('')
    setFormClient('')
    setFormYear(new Date().getFullYear().toString())
    setFormDescription('')
    setFormIsFeatured(true)
    setImageMode('upload')
    if (createFileInputRef.current) {
      createFileInputRef.current.value = ''
    }
    if (editFileInputRef.current) {
      editFileInputRef.current.value = ''
    }
  }

  const openEditModal = (item: PortfolioWithRelations) => {
    setEditItem(item)
    setFormTitle(item.title)
    setFormSlug(item.slug)
    setFormCategoryId(item.categoryId)
    setFormThumbnailId(item.thumbnailId)
    setFormImageUrl(item.thumbnail?.url || '')
    setFormClient(item.client || '')
    setFormYear(item.year || new Date().getFullYear().toString())
    setFormDescription(item.description || '')
    setFormIsFeatured(item.isFeatured ?? true)
    setImageMode(item.thumbnail?.url ? 'url' : 'upload')
  }

  // Handle local file selection and upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file)
    setFormImageUrl(localPreview)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadMediaAction(formData)
      if (res.success && res.url && res.mediaId) {
        setFormThumbnailId(res.mediaId)
        setFormImageUrl(res.url)
        toast.success('Gambar berhasil diunggah ke Supabase Storage')
      } else {
        toast.error(res.error || 'Gagal mengunggah file')
      }
    } catch (err) {
      toast.error('Terjadi kesalahan saat mengunggah gambar')
    } finally {
      setIsUploading(false)
    }
  }

  // Filtered items
  const filtered = initialItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.client && item.client.toLowerCase().includes(search.toLowerCase())) ||
      item.slug.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || item.categoryId.toString() === selectedCategory

    const matchesFeatured = !onlyFeatured || item.isFeatured === true

    return matchesSearch && matchesCategory && matchesFeatured
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formSlug.trim()) return

    startTransition(async () => {
      const res = await createPortfolio({
        title: formTitle.trim(),
        slug: formSlug.trim(),
        categoryId: formCategoryId,
        thumbnailId: formThumbnailId,
        imageUrl: formImageUrl.trim() || undefined,
        client: formClient.trim() || undefined,
        year: formYear.trim() || undefined,
        description: formDescription.trim() || undefined,
        isFeatured: formIsFeatured,
      })

      if (res.success) {
        toast.success('Portfolio berhasil ditambahkan')
        resetForm()
        setCreateOpen(false)
      } else {
        toast.error(res.error ?? 'Gagal menambah portfolio')
      }
    })
  }

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem || !formTitle.trim() || !formSlug.trim()) return

    startTransition(async () => {
      const res = await updatePortfolio(editItem.id, {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        categoryId: formCategoryId,
        thumbnailId: formThumbnailId,
        imageUrl: formImageUrl.trim() || undefined,
        client: formClient.trim() || undefined,
        year: formYear.trim() || undefined,
        description: formDescription.trim() || undefined,
        isFeatured: formIsFeatured,
      })

      if (res.success) {
        toast.success('Portfolio berhasil diperbarui')
        setEditItem(null)
      } else {
        toast.error(res.error ?? 'Gagal memperbarui portfolio')
      }
    })
  }

  const handleToggleFeatured = (item: PortfolioWithRelations) => {
    startTransition(async () => {
      const res = await toggleFeatured(item.id, item.isFeatured ?? false)
      if (res.success) {
        toast.success(
          item.isFeatured
            ? 'Dihapus dari Featured'
            : 'Ditambahkan ke Featured'
        )
      } else {
        toast.error(res.error ?? 'Gagal mengubah status featured')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return

    startTransition(async () => {
      const res = await deletePortfolio(deleteItem.id)
      if (res.success) {
        toast.success('Portfolio berhasil dihapus')
        setDeleteItem(null)
      } else {
        toast.error(res.error ?? 'Gagal menghapus portfolio')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Portfolio
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Kelola karya, studi kasus, dan galeri proyek Snava Creative.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm()
            setCreateOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Portfolio</span>
        </button>
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
              placeholder="Cari judul, klien, slug..."
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Featured Toggle Filter */}
          <button
            type="button"
            onClick={() => setOnlyFeatured((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${
              onlyFeatured
                ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Star
              className={`h-3.5 w-3.5 ${
                onlyFeatured ? 'fill-indigo-400 text-indigo-400' : 'text-zinc-500'
              }`}
            />
            <span>Featured</span>
          </button>
        </div>

        <div className="text-xs font-medium text-zinc-400">
          Total: <span className="text-zinc-200">{filtered.length}</span> item
        </div>
      </div>

      {/* Table Card */}
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
                  const thumbUrl = item.thumbnail?.url || ''

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-zinc-900/60"
                    >
                      {/* Project info + Thumbnail with fallback */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                            {thumbUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={thumbUrl}
                                alt={item.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // Graceful fallback if image URL fails to load
                                  ;(e.currentTarget as HTMLElement).style.display = 'none'
                                }}
                              />
                            ) : null}
                            <ImageIcon className="absolute -z-10 h-5 w-5 text-zinc-700" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                              {item.title}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <span>/{item.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300">
                          {item.category?.name ?? 'Tanpa Kategori'}
                        </span>
                      </td>

                      {/* Client & Year */}
                      <td className="px-5 py-3.5 text-zinc-400">
                        <div>{item.client || '—'}</div>
                        <div className="text-[11px] text-zinc-500">
                          {item.year || '—'}
                        </div>
                      </td>

                      {/* Featured Star Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item)}
                          disabled={isPending}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition ${
                            item.isFeatured
                              ? 'text-amber-400 hover:bg-amber-500/10'
                              : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800'
                          }`}
                          title={
                            item.isFeatured
                              ? 'Status: Featured (Klik untuk ubah)'
                              : 'Status: Standar (Klik untuk jadikan featured)'
                          }
                        >
                          <Star
                            className={`h-4 w-4 ${
                              item.isFeatured ? 'fill-amber-400' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                            title="Edit Portfolio"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                            title="Hapus Portfolio"
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

      {/* Modal: Tambah Portfolio */}
      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">
                Tambah Portfolio Baru
              </h3>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-md text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Contoh: Brand Identity Snava"
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value, false)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="brand-identity-snava"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Klien
                </label>
                <input
                  type="text"
                  placeholder="Nama klien atau brand"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Image Input Section: File Upload or URL */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">Gambar Thumbnail</span>
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                        imageMode === 'upload'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <UploadCloud className="h-3 w-3" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                        imageMode === 'url'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>URL Gambar</span>
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div key="create-upload-box">
                    <input
                      key="create-file-input"
                      ref={createFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Mendukung PNG, JPG, WebP (Maksimal 10MB). File langsung disimpan ke Supabase Storage.
                    </p>
                  </div>
                ) : (
                  <div key="create-url-box">
                    <input
                      key="create-url-input"
                      type="url"
                      placeholder="https://images.unsplash.com/... atau URL gambar"
                      value={formImageUrl || ''}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                )}

                {/* Live Preview */}
                {formImageUrl ? (
                  <div className="relative mt-2 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formImageUrl}
                        alt="Thumbnail Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                            <span>Mengunggah ke Supabase Storage...</span>
                          </>
                        ) : (
                          <span>Gambar siap disimpan</span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {formImageUrl}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan tentang proyek ini..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="featured-check"
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="featured-check"
                  className="text-xs font-medium text-zinc-300 cursor-pointer"
                >
                  Tampilkan sebagai Proyek Unggulan (Featured)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    isUploading ||
                    !formTitle.trim() ||
                    !formSlug.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPending || isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Simpan Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: Edit Portfolio */}
      {editItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">
                Edit Portfolio
              </h3>
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="rounded-md text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value, true)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Tahun
                  </label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Klien
                </label>
                <input
                  type="text"
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Image Input Section: File Upload or URL */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300">Gambar Thumbnail</span>
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                        imageMode === 'upload'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <UploadCloud className="h-3 w-3" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded ${
                        imageMode === 'url'
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <LinkIcon className="h-3 w-3" />
                      <span>URL Gambar</span>
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div key="edit-upload-box">
                    <input
                      key="edit-file-input"
                      ref={editFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleFileUpload}
                      className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Ganti gambar dengan mengunggah file baru ke Supabase Storage.
                    </p>
                  </div>
                ) : (
                  <div key="edit-url-box">
                    <input
                      key="edit-url-input"
                      type="url"
                      placeholder="https://images.unsplash.com/... atau URL gambar"
                      value={formImageUrl || ''}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                )}

                {/* Live Preview */}
                {formImageUrl ? (
                  <div className="relative mt-2 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formImageUrl}
                        alt="Thumbnail Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                            <span>Mengunggah ke Supabase Storage...</span>
                          </>
                        ) : (
                          <span>Gambar aktif</span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                        {formImageUrl}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Deskripsi Proyek
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="edit-featured-check"
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="edit-featured-check"
                  className="text-xs font-medium text-zinc-300 cursor-pointer"
                >
                  Tampilkan sebagai Proyek Unggulan (Featured)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    isUploading ||
                    !formTitle.trim() ||
                    !formSlug.trim()
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPending || isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Perbarui Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: Hapus Portfolio */}
      {deleteItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white">
              Hapus Portfolio
            </h3>
            <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus portfolio{' '}
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
                Hapus Portfolio
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
