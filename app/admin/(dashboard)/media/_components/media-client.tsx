'use client'

import React, { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import {
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Info,
  Loader2,
  FileImage,
  Layers,
  Briefcase,
  AlertTriangle,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  uploadMediaAction,
  updateMediaAltAction,
  deleteMediaAction,
} from '../actions'

import type { MediaWithUsages } from '../types'

type MediaSort = 'newest' | 'oldest' | 'size' | 'name'

interface MediaClientProps {
  initialItems: MediaWithUsages[]
}

function formatBytes(bytes?: string | number | null) {
  if (!bytes) return '—'
  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes
  if (isNaN(num) || num === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(num) / Math.log(k))
  return `${parseFloat((num / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatDate(date?: Date | string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getFormatBadge(mimeType?: string | null, filename?: string | null) {
  const mime = (mimeType || '').toLowerCase()
  const name = (filename || '').toLowerCase()

  if (mime.includes('png') || name.endsWith('.png')) return 'PNG'
  if (mime.includes('jpeg') || mime.includes('jpg') || name.endsWith('.jpg') || name.endsWith('.jpeg'))
    return 'JPG'
  if (mime.includes('webp') || name.endsWith('.webp')) return 'WEBP'
  if (mime.includes('svg') || name.endsWith('.svg')) return 'SVG'
  if (mime.includes('gif') || name.endsWith('.gif')) return 'GIF'
  return 'FILE'
}

export function MediaClient({ initialItems }: MediaClientProps) {
  const [items, setItems] = useState<MediaWithUsages[]>(initialItems)
  const [search, setSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState<string>('all')
  const [usageFilter, setUsageFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<MediaSort>('newest')

  // Modals & Drawers
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<MediaWithUsages | null>(null)
  const [deleteItem, setDeleteItem] = useState<MediaWithUsages | null>(null)

  // Alt Text Edit in Detail Modal
  const [editAlt, setEditAlt] = useState('')

  // Transitions & Upload
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Keep successful local mutations until the server supplies a new snapshot.
  const [previousItems, setPreviousItems] = useState(initialItems)
  if (initialItems !== previousItems) {
    setPreviousItems(initialItems)
    setItems(initialItems)
  }

  const copyToClipboard = (url: string | null, id: number) => {
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('URL gambar berhasil disalin ke clipboard')
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev))
    }, 2000)
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()
    Array.from(files).forEach((f) => formData.append('files', f))

    try {
      const res = await uploadMediaAction(formData)
      if (res.success) {
        toast.success(`Berhasil mengunggah ${res.count || 1} berkas media`)
        setUploadOpen(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        toast.error(res.error || 'Gagal mengunggah berkas')
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah berkas')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdateAlt = (id: number) => {
    if (!editAlt.trim()) return

    startTransition(async () => {
      const res = await updateMediaAltAction(id, editAlt.trim())
      if (res.success) {
        toast.success('Alt text berhasil diperbarui')
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, alt: editAlt.trim() } : item
          )
        )
        if (detailItem && detailItem.id === id) {
          setDetailItem((prev) => (prev ? { ...prev, alt: editAlt.trim() } : null))
        }
      } else {
        toast.error(res.error || 'Gagal memperbarui Alt text')
      }
    })
  }

  const handleDelete = () => {
    if (!deleteItem) return

    startTransition(async () => {
      const res = await deleteMediaAction(deleteItem.id)
      if (res.success) {
        toast.success('Berkas media berhasil dihapus')
        setItems((prev) => prev.filter((item) => item.id !== deleteItem.id))
        setDeleteItem(null)
        if (detailItem?.id === deleteItem.id) {
          setDetailItem(null)
        }
      } else {
        toast.error(res.error || 'Gagal menghapus berkas')
      }
    })
  }

  // Filter & Sorting
  const filteredItems = items
    .filter((item) => {
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (item.filename && item.filename.toLowerCase().includes(q)) ||
        (item.alt && item.alt.toLowerCase().includes(q))

      const badge = getFormatBadge(item.mimeType, item.filename)
      const matchesFormat =
        formatFilter === 'all' ||
        badge.toLowerCase() === formatFilter.toLowerCase()

      const isUsed =
        item.usedIn.portfolios.length > 0 || item.usedIn.services.length > 0
      const matchesUsage =
        usageFilter === 'all' ||
        (usageFilter === 'used' && isUsed) ||
        (usageFilter === 'unused' && !isUsed)

      return matchesSearch && matchesFormat && matchesUsage
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeB - timeA
      }
      if (sortBy === 'oldest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeA - timeB
      }
      if (sortBy === 'name') {
        return (a.alt || a.filename || '').localeCompare(b.alt || b.filename || '')
      }
      if (sortBy === 'size') {
        const sizeA = a.filesize ? parseFloat(a.filesize) : 0
        const sizeB = b.filesize ? parseFloat(b.filesize) : 0
        return sizeB - sizeA
      }
      return 0
    })

  const totalUsedCount = items.filter(
    (i) => i.usedIn.portfolios.length > 0 || i.usedIn.services.length > 0
  ).length

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Media Library
            </h1>
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
              {items.length} Berkas
            </span>
            <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-400">
              {totalUsedCount} Digunakan
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Daftar seluruh berkas aset visual dan media website Snava Creative.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari nama berkas atau alt text..."
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
            {/* Format Filter */}
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Semua Format</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG / JPEG</option>
              <option value="webp">WebP</option>
              <option value="svg">SVG</option>
            </select>

            {/* Usage Filter */}
            <select
              value={usageFilter}
              onChange={(e) => setUsageFilter(e.target.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">Semua Penggunaan</option>
              <option value="used">Sedang Digunakan</option>
              <option value="unused">Belum Dipakai</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as MediaSort)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="size">Ukuran Terbesar</option>
              <option value="name">Nama (A-Z)</option>
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
                <th className="px-5 py-3.5">Pratinjau & Berkas</th>
                <th className="px-5 py-3.5">Format & Ukuran</th>
                <th className="px-5 py-3.5">Status Penggunaan</th>
                <th className="px-5 py-3.5">Waktu Unggah</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileImage className="h-10 w-10 text-zinc-600 mb-2 stroke-1" />
                      <p className="text-sm font-medium text-zinc-300">
                        {search || formatFilter !== 'all' || usageFilter !== 'all'
                          ? 'Tidak ada berkas yang cocok dengan filter'
                          : 'Belum ada berkas media'}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 max-w-xs">
                        {search || formatFilter !== 'all' || usageFilter !== 'all'
                          ? 'Coba ubah kata kunci pencarian atau reset filter format berkas.'
                          : 'Klik tombol "Upload Media" untuk mengunggah gambar ke Supabase Storage.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const badge = getFormatBadge(item.mimeType, item.filename)
                  const isCopied = copiedId === item.id
                  const usedPortfoliosCount = item.usedIn.portfolios.length
                  const usedServicesCount = item.usedIn.services.length
                  const isUsed = usedPortfoliosCount > 0 || usedServicesCount > 0

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-zinc-900/60"
                    >
                      {/* Column 1: Thumbnail & File Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          {/* Thumbnail Box */}
                          <div
                            onClick={() => {
                              setDetailItem(item)
                              setEditAlt(item.alt || '')
                            }}
                            className="relative flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 group-hover:border-zinc-700 transition"
                          >
                            {item.url ? (
                              <img
                                src={item.thumbnailUrl || item.url}
                                alt={item.alt || 'Media thumbnail'}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <FileImage className="h-5 w-5 text-zinc-600" />
                            )}
                          </div>

                          {/* File Details */}
                          <div className="min-w-0 flex-1">
                            <div
                              onClick={() => {
                                setDetailItem(item)
                                setEditAlt(item.alt || '')
                              }}
                              className="font-medium text-zinc-100 hover:text-indigo-400 cursor-pointer truncate max-w-xs transition-colors"
                              title={item.alt || item.filename || ''}
                            >
                              {item.alt || item.filename || 'Tanpa Nama'}
                            </div>
                            <div
                              className="text-[11px] text-zinc-500 font-mono truncate max-w-xs mt-0.5"
                              title={item.filename || ''}
                            >
                              {item.filename || '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Format & Size */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-300">
                            {badge}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {formatBytes(item.filesize)}
                          </span>
                        </div>
                      </td>

                      {/* Column 3: Usage Status */}
                      <td className="px-5 py-3.5">
                        {isUsed ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {usedPortfoliosCount > 0 && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300"
                                title={`Digunakan di: ${item.usedIn.portfolios.map((p) => p.title).join(', ')}`}
                              >
                                <Briefcase className="h-2.5 w-2.5" />
                                <span>Portfolio ({usedPortfoliosCount})</span>
                              </span>
                            )}
                            {usedServicesCount > 0 && (
                              <span
                                className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                                title={`Digunakan di: ${item.usedIn.services.map((s) => s.title).join(', ')}`}
                              >
                                <Layers className="h-2.5 w-2.5" />
                                <span>Layanan ({usedServicesCount})</span>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-zinc-800/80 bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-500">
                            Belum Digunakan
                          </span>
                        )}
                      </td>

                      {/* Column 4: Created Date */}
                      <td className="px-5 py-3.5 text-zinc-400 text-[11px]">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Column 5: Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Copy URL */}
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.url, item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                            title="Salin URL Gambar"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => {
                              setDetailItem(item)
                              setEditAlt(item.alt || '')
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition"
                            title="Lihat Detail & Edit Alt"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteItem(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-950/40 hover:text-red-400 transition"
                            title="Hapus Media"
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

      {/* MODAL 1: Upload Media */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Unggah Berkas Media
                </h3>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Tersimpan langsung ke Supabase Storage (bucket media).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  handleFileUpload(e.dataTransfer.files)
                }}
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-center transition hover:border-indigo-500/50 hover:bg-zinc-950 cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-xs font-medium text-zinc-200">
                      Sedang mengunggah ke Supabase Storage...
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Mohon tunggu beberapa saat.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-950/30 transition-all">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-xs font-medium text-zinc-200">
                      Tarik & lepas berkas ke sini, atau{' '}
                      <span className="text-indigo-400 underline underline-offset-2">
                        pilih berkas
                      </span>
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Mendukung PNG, JPG, WebP, GIF, SVG (Maksimal 10MB per berkas).
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-800/80 pt-4">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setUploadOpen(false)}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail & Edit Alt Text */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Detail Berkas Media
                </h3>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Pratinjau resolusi penuh dan metadata berkas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {/* Image Preview */}
              <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
                {detailItem.url ? (
                  <img
                    src={detailItem.url}
                    alt={detailItem.alt || 'Media full preview'}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FileImage className="h-12 w-12 text-zinc-600" />
                )}
              </div>

              {/* Alt Text Inline Editor */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
                <label className="block text-xs font-medium text-zinc-300">
                  Deskripsi / Alt Text (SEO & Aksesibilitas)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    placeholder="Contoh: Banner Hero Snava Creative"
                    className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    disabled={isPending || editAlt === detailItem.alt}
                    onClick={() => handleUpdateAlt(detailItem.id)}
                    className="rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition disabled:opacity-50"
                  >
                    Simpan Alt
                  </button>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[11px] text-zinc-500">Nama Berkas</span>
                  <p className="font-mono text-zinc-200 truncate" title={detailItem.filename || ''}>
                    {detailItem.filename || '—'}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[11px] text-zinc-500">Ukuran & Format</span>
                  <p className="font-mono text-zinc-200">
                    {formatBytes(detailItem.filesize)} ({getFormatBadge(detailItem.mimeType, detailItem.filename)})
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[11px] text-zinc-500">Waktu Diunggah</span>
                  <p className="text-zinc-200">{formatDate(detailItem.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[11px] text-zinc-500">Tipe MIME</span>
                  <p className="font-mono text-zinc-200">{detailItem.mimeType || 'image/*'}</p>
                </div>
              </div>

              {/* Usage List */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <span className="text-xs font-semibold text-zinc-200">
                  Status Penggunaan Konten
                </span>
                {detailItem.usedIn.portfolios.length === 0 &&
                detailItem.usedIn.services.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    Berkas ini belum digunakan pada modul Layanan maupun Portfolio.
                  </p>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {detailItem.usedIn.portfolios.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs text-indigo-300 bg-indigo-950/30 border border-indigo-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Portfolio: {p.title}</span>
                        </span>
                        <Link
                          href="/admin/portfolio"
                          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                    {detailItem.usedIn.services.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Layanan: {s.title}</span>
                        </span>
                        <Link
                          href={`/admin/layanan/${s.id}/edit`}
                          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
                        >
                          <span>Buka</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteItem(detailItem)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-900/40 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Berkas</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(detailItem.url, detailItem.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition"
                >
                  {copiedId === detailItem.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>URL Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin URL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-100 hover:bg-zinc-700 transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {deleteItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/60 border border-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Konfirmasi Hapus Media
                </h3>
                <p className="text-xs text-zinc-400">
                  Tindakan ini permanen dan tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            {/* Check if in use */}
            {deleteItem.usedIn.portfolios.length > 0 ||
            deleteItem.usedIn.services.length > 0 ? (
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/30 p-3.5 text-xs text-amber-200 space-y-2">
                <p className="font-semibold text-amber-300">
                  ⚠️ Peringatan: Berkas sedang aktif digunakan!
                </p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Berkas ini sedang digunakan oleh:
                </p>
                <ul className="list-disc list-inside text-[11px] text-amber-200 space-y-0.5">
                  {deleteItem.usedIn.portfolios.map((p) => (
                    <li key={p.id}>Portfolio: &ldquo;{p.title}&rdquo;</li>
                  ))}
                  {deleteItem.usedIn.services.map((s) => (
                    <li key={s.id}>Layanan: &ldquo;{s.title}&rdquo;</li>
                  ))}
                </ul>
                <p className="text-[10px] text-amber-400 pt-1">
                  Demi mencegah gambar rusak di website publik, Anda disarankan mengganti gambar terlebih dahulu pada modul terkait sebelum menghapusnya.
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas{' '}
                <span className="font-semibold text-zinc-200">
                  &ldquo;{deleteItem.alt || deleteItem.filename}&rdquo;
                </span>
                ? Berkas akan dihapus secara permanen dari Supabase Storage dan database.
              </p>
            )}

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
                disabled={
                  isPending ||
                  deleteItem.usedIn.portfolios.length > 0 ||
                  deleteItem.usedIn.services.length > 0
                }
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-600/25 hover:bg-red-500 disabled:opacity-50 transition"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                <span>Hapus Berkas</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
