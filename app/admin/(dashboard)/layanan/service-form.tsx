'use client'

import {
  AlertTriangle,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  ImageIcon,
  Layout,
  Link as LinkIcon,
  Loader2,
  Search,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  createService,
  updateService,
  uploadServiceMediaAction,
} from './actions'
import { ServiceCapabilitiesFields } from './service-capabilities-fields'
import { ServiceFaqsFields } from './service-faqs-fields'
import { genId } from './service-form-utils'
import { ICON_OPTIONS } from './service-icons'
import { ServicePackagesFields } from './service-packages-fields'
import { ServiceProblemsFields } from './service-problems-fields'
import type {
  CapabilityState,
  FaqState,
  PackageState,
  ProblemState,
  ServiceWithRelations,
} from './types'

interface CategoryOption {
  id: number
  name: string
}

interface ServiceFormProps {
  initialData?: ServiceWithRelations
  categories: CategoryOption[]
}

export function ServiceForm({ initialData, categories }: ServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<
    'main' | 'packages' | 'problems' | 'capabilities' | 'faqs'
  >('main')

  const isEdit = !!initialData

  // 1. Form states - Main & Hero
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [category, setCategory] = useState(
    initialData?.category || categories[0]?.name || 'Branding'
  )
  const [description, setDescription] = useState(initialData?.description || '')
  const [icon, setIcon] = useState(initialData?.icon || 'Palette')
  const [iconSearch, setIconSearch] = useState('')

  const selectedIconOption = ICON_OPTIONS.find(
    (i) => i.name.toLowerCase() === (icon || '').toLowerCase()
  )

  const filteredIcons = ICON_OPTIONS.filter((item) => {
    const q = iconSearch.toLowerCase().trim()
    if (!q) return true
    return (
      item.label.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q)
    )
  })
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder || '1')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [heroHeadline, setHeroHeadline] = useState(initialData?.heroHeadline || '')
  const [heroDescription, setHeroDescription] = useState(
    initialData?.heroDescription || ''
  )
  const [heroImageId, setHeroImageId] = useState<number | undefined>(
    initialData?.heroImageId || undefined
  )
  const [imageUrl, setImageUrl] = useState(initialData?.heroImage?.url || '')
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(
    initialData?.heroImage?.url ? 'url' : 'upload'
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 2. Form states - Repeaters
  const [packages, setPackages] = useState<PackageState[]>(() => {
    if (!initialData?.packages) return []
    return initialData.packages.map((p) => ({
      id: p.id || genId('pkg'),
      name: p.name || '',
      price: p.price ? String(p.price) : '',
      billingPeriod: p.billingPeriod || '',
      description: p.description || '',
      isPopular: !!p.isPopular,
      isCustom: !!p.isCustom,
      features: (p.features || []).map((f) => ({
        id: f.id || genId('feat'),
        name: f.name || '',
        included: f.included ?? true,
      })),
    }))
  })

  const [problems, setProblems] = useState<ProblemState[]>(() => {
    if (!initialData?.problems) return []
    return initialData.problems.map((p) => ({
      id: p.id || genId('prob'),
      title: p.title || '',
      description: p.description || '',
    }))
  })

  const [capabilities, setCapabilities] = useState<CapabilityState[]>(() => {
    if (!initialData?.capabilities) return []
    return initialData.capabilities.map((c) => ({
      id: c.id || genId('cap'),
      title: c.title || '',
      description: c.description || '',
      icon: c.icon || '',
    }))
  })

  const [faqs, setFaqs] = useState<FaqState[]>(() => {
    if (!initialData?.faqs) return []
    return initialData.faqs.map((f) => ({
      id: f.id || genId('faq'),
      question: f.question || '',
      answer: f.answer || '',
    }))
  })

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!isEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setSlug(generated)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localPreview = URL.createObjectURL(file)
    setUploadPreview(localPreview)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadServiceMediaAction(formData)
      if (res.success && res.url && res.mediaId) {
        setHeroImageId(res.mediaId)
        setImageUrl(res.url)
        setUploadPreview(null)
        toast.success('Gambar hero berhasil diunggah ke Supabase Storage')
      } else {
        setUploadPreview(null)
        toast.error(res.error || 'Gagal mengunggah gambar')
      }
    } catch {
      setUploadPreview(null)
      toast.error('Terjadi kesalahan saat mengunggah gambar')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !slug.trim()) {
      toast.error('Nama layanan dan Slug URL wajib diisi')
      return
    }

    if (isUploading) {
      toast.info('Mohon tunggu hingga proses unggah gambar selesai')
      return
    }

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim() || undefined,
        description: description.trim() || undefined,
        icon,
        isActive,
        sortOrder: sortOrder.trim() || '1',
        heroHeadline: heroHeadline.trim() || undefined,
        heroDescription: heroDescription.trim() || undefined,
        heroImageId,
        imageUrl:
          imageMode === 'url' && imageUrl && !imageUrl.startsWith('blob:')
            ? imageUrl.trim()
            : undefined,
        packages: packages
          .filter((p) => p.name.trim().length > 0)
          .map((p) => ({
            id: p.id,
            name: p.name.trim(),
            price: p.isCustom ? null : p.price ? Number(p.price) : null,
            billingPeriod: p.billingPeriod.trim() || null,
            description: p.description.trim() || null,
            isPopular: p.isPopular,
            isCustom: p.isCustom,
            features: p.features
              .filter((f) => f.name.trim().length > 0)
              .map((f) => ({
                id: f.id,
                name: f.name.trim(),
                included: f.included,
              })),
          })),
        problems: problems
          .filter((p) => p.title.trim().length > 0)
          .map((p) => ({
            id: p.id,
            title: p.title.trim(),
            description: p.description.trim(),
          })),
        capabilities: capabilities
          .filter((c) => c.title.trim().length > 0)
          .map((c) => ({
            id: c.id,
            title: c.title.trim(),
            description: c.description.trim(),
            icon: c.icon.trim() || undefined,
          })),
        faqs: faqs
          .filter((f) => f.question.trim().length > 0)
          .map((f) => ({
            id: f.id,
            question: f.question.trim(),
            answer: f.answer.trim(),
          })),
      }

      const res = isEdit
        ? await updateService(initialData.id, payload)
        : await createService(payload)

      if (res.success) {
        toast.success(
          isEdit
            ? 'Layanan dan relasi berhasil diperbarui'
            : 'Layanan baru berhasil dibuat'
        )
        router.push('/admin/layanan')
      } else {
        toast.error(res.error ?? 'Gagal menyimpan layanan')
      }
    })
  }

  const tabsConfig = [
    { id: 'main' as const, label: 'Informasi Utama & Hero', icon: Layout },
    {
      id: 'packages' as const,
      label: 'Paket Harga',
      icon: CreditCard,
      count: packages.length,
    },
    {
      id: 'problems' as const,
      label: 'Tantangan Klien',
      icon: AlertTriangle,
      count: problems.length,
    },
    {
      id: 'capabilities' as const,
      label: 'Solusi & Kapabilitas',
      icon: Zap,
      count: capabilities.length,
    },
    {
      id: 'faqs' as const,
      label: 'FAQ Layanan',
      icon: HelpCircle,
      count: faqs.length,
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header with Back Link and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/layanan"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            title="Kembali ke Daftar Layanan"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {isEdit ? `Edit Layanan: ${initialData.title}` : 'Tambah Layanan Baru'}
            </h1>
            <p className="text-xs text-zinc-400">
              {isEdit
                ? 'Perbarui konfigurasi, paket harga, tantangan, kapabilitas, dan FAQ layanan.'
                : 'Buat layanan baru lengkap dengan paket harga dan detail untuk website.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/layanan"
            className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending || isUploading || !title.trim() || !slug.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {isPending || isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            <span>{isEdit ? 'Simpan Perubahan' : 'Buat Layanan'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800/80 pb-3">
        {tabsConfig.map((tab) => {
          const IconComp = tab.icon
          const isCurrent = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                isCurrent
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <IconComp
                className={`h-3.5 w-3.5 ${
                  isCurrent ? 'text-indigo-400' : 'text-zinc-500'
                }`}
              />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono leading-none ${
                    tab.count > 0
                      ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                      : 'bg-zinc-800/80 text-zinc-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: INFORMASI UTAMA & HERO */}
      {activeTab === 'main' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (Main Content - 2 cols on lg) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Card: Informasi Dasar */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm space-y-4">
              <h2 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800/60 pb-3">
                Informasi Utama Layanan
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Nama Layanan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Social Media Management"
                    value={title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="social-media-management"
                    value={slug || ''}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Akan diakses melalui{' '}
                    <code className="text-zinc-400">
                      /services/{slug || 'nama-layanan'}
                    </code>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Deskripsi Singkat Layanan
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat yang tampil pada kartu layanan di homepage website..."
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Card: Halaman Publik Layanan */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">
                  Konten Halaman Detail Layanan
                </h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Informasi ini akan ditampilkan di bagian banner atas halaman detail layanan publik.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-zinc-800/60">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Build a Stronger Presence on Social Media"
                    value={heroHeadline || ''}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Hero Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Uraian mendalam mengenai value proposition, solusi, dan pendekatan layanan Anda..."
                    value={heroDescription || ''}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Settings & Media - 1 col on lg) */}
          <div className="space-y-6">
            {/* Card: Status & Metadata */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm space-y-4">
              <h2 className="text-sm font-semibold text-zinc-100 border-b border-zinc-800/60 pb-3">
                Pengaturan & Status
              </h2>

              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    Status Publikasi
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Tampilkan di website publik
                  </div>
                </div>
                <input
                  id="service-active-toggle"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Kategori Layanan
                </label>
                <select
                  value={category || ''}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nomor Urut Tampil
                </label>
                <input
                  type="text"
                  placeholder="1"
                  value={sortOrder || ''}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <p className="mt-1 text-[10px] text-zinc-500">
                  Angka lebih kecil tampil lebih awal pada daftar.
                </p>
              </div>
            </div>

            {/* Card: Ikon Layanan */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-100">
                    Ikon Layanan
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Visual sesuai jenis layanan
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-indigo-500/15 px-2.5 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/20 shrink-0">
                  {selectedIconOption ? (
                    <>
                      <selectedIconOption.icon className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="truncate max-w-32.5">
                        {selectedIconOption.label}
                      </span>
                    </>
                  ) : (
                    <span>{icon}</span>
                  )}
                </div>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari label ikon..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-8 pr-7 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                />
                {iconSearch && (
                  <button
                    type="button"
                    onClick={() => setIconSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Icon Options Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 scrollbar-thin [scrollbar-color:#3f3f46_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent">
                {filteredIcons.length > 0 ? (
                  filteredIcons.map((item) => {
                    const IconComp = item.icon
                    const isSelected = icon === item.name
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIcon(item.name)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/50 text-indigo-300 ring-1 ring-indigo-500/30 shadow-sm'
                            : 'border-zinc-800/80 bg-zinc-950/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60 hover:text-zinc-200'
                        }`}
                        title={`${item.label} (${item.name})`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${
                            isSelected
                              ? 'bg-indigo-600/30 text-indigo-300'
                              : 'bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[11px] font-medium leading-tight truncate ${
                              isSelected
                                ? 'text-indigo-200 font-semibold'
                                : 'text-zinc-200'
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="text-[9px] text-zinc-500 truncate font-mono">
                            {item.name}
                          </p>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="col-span-2 py-6 text-center text-xs text-zinc-500">
                    Tidak ada ikon untuk &ldquo;{iconSearch}&rdquo;
                  </div>
                )}
              </div>
            </div>

            {/* Card: Hero Banner Image */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                <h2 className="text-sm font-semibold text-zinc-100">
                  Banner Hero
                </h2>
                <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer ${
                      imageMode === 'upload'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <UploadCloud className="h-3 w-3" />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer ${
                      imageMode === 'url'
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span>URL</span>
                  </button>
                </div>
              </div>

              {imageMode === 'upload' ? (
                <div key="service-form-upload-box">
                  <input
                    key="service-form-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                  />
                  <p className="mt-1 text-[10px] text-zinc-500">
                    Mendukung PNG, JPG, WebP. Tersimpan di Supabase Storage.
                  </p>
                </div>
              ) : (
                <div key="service-form-url-box">
                  <input
                    key="service-form-url-input"
                    type="url"
                    placeholder="https://... URL gambar"
                    value={imageUrl || ''}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              )}

              {/* Live Image Preview */}
              {uploadPreview || imageUrl ? (
                <div className="relative mt-2 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden">
                  <div className="h-32 w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={uploadPreview || imageUrl}
                      alt="Hero Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2 border-t border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 truncate max-w-45">
                      {isUploading
                        ? 'Sedang mengunggah ke Storage...'
                        : imageUrl || 'Gambar siap'}
                    </span>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => {
                        setImageUrl('')
                        setUploadPreview(null)
                        setHeroImageId(undefined)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 disabled:opacity-50 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 py-6 text-center text-zinc-500">
                  <ImageIcon className="h-6 w-6 stroke-1 text-zinc-600 mb-1" />
                  <span className="text-[11px]">Belum ada banner hero</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAKET HARGA (PACKAGES & FEATURES REPEATER) */}
      {activeTab === 'packages' && (
        <ServicePackagesFields packages={packages} setPackages={setPackages} />
      )}

      {/* TAB 3: TANTANGAN KLIEN (PROBLEMS REPEATER) */}
      {activeTab === 'problems' && (
        <ServiceProblemsFields problems={problems} setProblems={setProblems} />
      )}

      {/* TAB 4: SOLUSI & KAPABILITAS (CAPABILITIES REPEATER) */}
      {activeTab === 'capabilities' && (
        <ServiceCapabilitiesFields capabilities={capabilities} setCapabilities={setCapabilities} />
      )}

      {/* TAB 5: FAQ LAYANAN (FAQS REPEATER) */}
      {activeTab === 'faqs' && (
        <ServiceFaqsFields faqs={faqs} setFaqs={setFaqs} />
      )}

      {/* Floating or Bottom Save Bar */}
      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
        <span className="text-xs text-zinc-500">
          Semua tab akan tersimpan bersamaan saat Anda menekan tombol simpan.
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/layanan"
            className="rounded-lg border border-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending || isUploading || !title.trim() || !slug.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
          >
            {isPending || isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            <span>{isEdit ? 'Simpan Perubahan' : 'Buat Layanan'}</span>
          </button>
        </div>
      </div>
    </form>
  )
}
