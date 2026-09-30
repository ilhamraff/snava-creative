'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { ArrowLeft, Loader2, Save, Star } from 'lucide-react'
import { toast } from 'sonner'
import { createPortfolio, updatePortfolio } from '../actions'
import { PortfolioImageField } from './portfolio-image-field'
import { PortfolioRelatedServices } from './portfolio-related-services'
import type {
  CategoryOption,
  PortfolioWithRelations,
  ServiceOption,
} from '../types'

interface PortfolioFormProps {
  initialData?: PortfolioWithRelations
  categories: CategoryOption[]
  services: ServiceOption[]
}

const VALID_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]
const MAX_IMAGE_SIZE = 10 * 1024 * 1024

export function PortfolioForm({
  initialData,
  categories,
  services,
}: PortfolioFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEdit = Boolean(initialData)

  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || 0,
  )
  const [thumbnailId, setThumbnailId] = useState<number | undefined>(
    initialData?.thumbnailId,
  )
  const [imageUrl, setImageUrl] = useState(initialData?.thumbnail?.url || '')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(
    initialData?.thumbnail?.url ? 'url' : 'upload',
  )
  const [client, setClient] = useState(initialData?.client || '')
  const [year, setYear] = useState(
    initialData?.year || new Date().getFullYear().toString(),
  )
  const [description, setDescription] = useState(initialData?.description || '')
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? true,
  )
  const [relatedServiceIds, setRelatedServiceIds] = useState<number[]>(
    () =>
      initialData?.relatedServices
        ?.map((relation) => relation.servicesId)
        .filter((id): id is number => typeof id === 'number') || [],
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview)
    }
  }, [uploadPreview])

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEdit) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
      )
    }
  }

  function clearSelectedFile() {
    setSelectedImageFile(null)
    setUploadPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleImageModeChange(mode: 'upload' | 'url') {
    setImageMode(mode)
    if (mode === 'url') clearSelectedFile()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      toast.error('Format file harus berupa JPG, PNG, WebP, atau SVG')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error('Ukuran file maksimal 10MB')
      event.target.value = ''
      return
    }

    setSelectedImageFile(file)
    setUploadPreview(URL.createObjectURL(file))
    setThumbnailId(undefined)
    setImageUrl('')
  }

  function handleRemoveImage() {
    clearSelectedFile()
    setImageUrl('')
    setThumbnailId(undefined)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !slug.trim() || !categoryId) {
      toast.error('Judul, slug, dan kategori wajib diisi')
      return
    }

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        categoryId,
        thumbnailId,
        imageUrl:
          imageMode === 'url' && imageUrl.trim()
            ? imageUrl.trim()
            : undefined,
        client: client.trim() || undefined,
        year: year.trim() || undefined,
        description: description.trim() || undefined,
        isFeatured,
        relatedServiceIds,
      }

      const mediaFormData =
        imageMode === 'upload' && selectedImageFile
          ? new FormData()
          : undefined

      if (mediaFormData && selectedImageFile) {
        mediaFormData.append('file', selectedImageFile)
      }

      const result = initialData
        ? await updatePortfolio(initialData.id, payload, mediaFormData)
        : await createPortfolio(payload, mediaFormData)

      if (result.success) {
        toast.success(
          initialData
            ? 'Portfolio berhasil diperbarui'
            : 'Portfolio berhasil ditambahkan',
        )
        router.push('/admin/portfolio')
        router.refresh()
      } else {
        toast.error(result.error ?? 'Gagal menyimpan portfolio')
      }
    })
  }

  const previewUrl = uploadPreview || imageUrl

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Link
            href="/admin/portfolio"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
            aria-label="Kembali ke daftar portfolio"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="min-w-0">
            <h1 className="break-words text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
              {isEdit ? `Edit Portfolio: ${initialData?.title}` : 'Tambah Portfolio Baru'}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {isEdit
                ? 'Perbarui informasi proyek, thumbnail, dan layanan terkait.'
                : 'Lengkapi informasi proyek sebelum menambahkannya ke portfolio.'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !title.trim() || !slug.trim() || !categoryId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {isEdit ? 'Simpan Perubahan' : 'Buat Portfolio'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="space-y-5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 sm:p-6">
          <div className="border-b border-zinc-800/60 pb-4">
            <h2 className="text-sm font-semibold text-zinc-100">Informasi Proyek</h2>
            <p className="mt-1 text-[11px] text-zinc-500">
              Informasi utama yang ditampilkan pada daftar dan detail portfolio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="portfolio-title" className="mb-1.5 block text-xs font-medium text-zinc-300">
                Judul Proyek *
              </label>
              <input
                id="portfolio-title"
                type="text"
                required
                autoFocus
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Contoh: Brand Identity Snava"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label htmlFor="portfolio-slug" className="mb-1.5 block text-xs font-medium text-zinc-300">
                Slug URL *
              </label>
              <input
                id="portfolio-slug"
                type="text"
                required
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="brand-identity-snava"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="portfolio-category" className="mb-1.5 block text-xs font-medium text-zinc-300">
                Kategori *
              </label>
              <select
                id="portfolio-category"
                required
                value={categoryId}
                onChange={(event) => setCategoryId(Number(event.target.value))}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.length === 0 ? <option value="">Belum ada kategori</option> : null}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="portfolio-year" className="mb-1.5 block text-xs font-medium text-zinc-300">
                Tahun
              </label>
              <input
                id="portfolio-year"
                type="text"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2026"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="portfolio-client" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Klien
            </label>
            <input
              id="portfolio-client"
              type="text"
              value={client}
              onChange={(event) => setClient(event.target.value)}
              placeholder="Nama klien atau brand"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="portfolio-description" className="mb-1.5 block text-xs font-medium text-zinc-300">
              Deskripsi Proyek
            </label>
            <textarea
              id="portfolio-description"
              rows={8}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ceritakan tentang proyek, tujuan, proses, dan hasilnya..."
              className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(event) => setIsFeatured(event.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
            />
            <span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
                <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                Proyek Unggulan
              </span>
              <span className="mt-1 block text-[11px] text-zinc-500">
                Tampilkan proyek ini pada bagian portfolio unggulan.
              </span>
            </span>
          </label>
        </section>

        <div className="space-y-6">
          <PortfolioImageField
            imageMode={imageMode}
            onModeChange={handleImageModeChange}
            imageUrl={imageUrl}
            previewUrl={previewUrl}
            selectedFileName={selectedImageFile?.name}
            onUrlChange={(value) => {
              setImageUrl(value)
              setThumbnailId(undefined)
            }}
            onRemove={handleRemoveImage}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
          />

          <section className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5">
            <PortfolioRelatedServices
              services={services}
              selectedIds={relatedServiceIds}
              onChange={setRelatedServiceIds}
            />
          </section>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-zinc-400">
          {selectedImageFile
            ? 'Thumbnail akan diunggah setelah portfolio disimpan.'
            : 'Periksa kembali informasi portfolio sebelum menyimpan.'}
        </span>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <Link
            href="/admin/portfolio"
            className="flex-1 rounded-lg border border-zinc-800 px-4 py-2 text-center text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 sm:flex-none"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending || !title.trim() || !slug.trim() || !categoryId}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {isEdit ? 'Simpan Perubahan' : 'Buat Portfolio'}
          </button>
        </div>
      </div>
    </form>
  )
}
