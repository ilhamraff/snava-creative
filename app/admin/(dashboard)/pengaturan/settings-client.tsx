'use client'

import { useState, useTransition, useRef } from 'react'
import Image from 'next/image'
import {
  Globe,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  UploadCloud,
  ImageIcon,
  Check,
  ExternalLink,
  Save,
  Loader2,
  X,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  updateSiteSettingsAction,
  updateHeroSectionAction,
  uploadLogoAction,
} from './actions'

interface MediaItem {
  id: number
  url: string | null
  alt: string | null
  filename: string | null
}

interface SiteSettingsData {
  id: number
  siteName: string
  tagline: string | null
  logoId: number | null
  email: string | null
  phone: string | null
  whatsappNumber: string | null
  whatsappMessage: string | null
  address: string | null
  logo?: {
    id: number
    url: string | null
    alt: string | null
  } | null
}

interface HeroSectionData {
  id: number
  headline: string
  subheadline: string
  ctaPrimaryLabel: string
  ctaPrimaryUrl: string
  ctaSecondaryLabel: string
  ctaSecondaryUrl: string
}

interface SettingsClientProps {
  initialSiteSettings: SiteSettingsData | null
  initialHeroSection: HeroSectionData | null
  mediaList: MediaItem[]
}

export function SettingsClient({
  initialSiteSettings,
  initialHeroSection,
  mediaList,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'hero'>('general')

  // --- Site Settings Form State ---
  const [siteName, setSiteName] = useState(initialSiteSettings?.siteName || 'Snava Creative')
  const [tagline, setTagline] = useState(initialSiteSettings?.tagline || '')
  const [email, setEmail] = useState(initialSiteSettings?.email || '')
  const [phone, setPhone] = useState(initialSiteSettings?.phone || '')
  const [whatsappNumber, setWhatsappNumber] = useState(initialSiteSettings?.whatsappNumber || '628211983889')
  const [whatsappMessage, setWhatsappMessage] = useState(
    initialSiteSettings?.whatsappMessage ||
      'Halo Snava Creative, saya tertarik untuk konsultasi tentang project saya.'
  )
  const [address, setAddress] = useState(initialSiteSettings?.address || '')
  const [selectedLogoId, setSelectedLogoId] = useState<number | null>(
    initialSiteSettings?.logoId || null
  )
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    initialSiteSettings?.logo?.url || null
  )

  // --- Hero Section Form State ---
  const [headline, setHeadline] = useState(
    initialHeroSection?.headline || 'Crafting Brands, Preserving Moments'
  )
  const [subheadline, setSubheadline] = useState(
    initialHeroSection?.subheadline ||
      'Kami menyediakan layanan creative digital agency, visual branding, photo & video production profesional.'
  )
  const [ctaPrimaryLabel, setCtaPrimaryLabel] = useState(
    initialHeroSection?.ctaPrimaryLabel || 'Konsultasi Gratis'
  )
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(
    initialHeroSection?.ctaPrimaryUrl || '#whatsapp'
  )
  const [ctaSecondaryLabel, setCtaSecondaryLabel] = useState(
    initialHeroSection?.ctaSecondaryLabel || 'Jelajahi Portofolio'
  )
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(
    initialHeroSection?.ctaSecondaryUrl || '#portfolio'
  )

  // Loading & Modals
  const [isPendingSettings, startTransitionSettings] = useTransition()
  const [isPendingHero, startTransitionHero] = useTransition()
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [mediaSearch, setMediaSearch] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handlers for Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingLogo(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await uploadLogoAction(formData)
      if (res.success && res.mediaId && res.url) {
        setSelectedLogoId(res.mediaId)
        setLogoPreviewUrl(res.url)
        toast.success('Logo berhasil diunggah')
      } else {
        toast.error(res.error || 'Gagal mengunggah logo')
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat upload logo')
    } finally {
      setIsUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSelectMedia = (item: MediaItem) => {
    if (!item.url) return
    setSelectedLogoId(item.id)
    setLogoPreviewUrl(item.url)
    setIsMediaModalOpen(false)
    toast.success('Logo dipilih dari pustaka media')
  }

  const handleRemoveLogo = () => {
    setSelectedLogoId(null)
    setLogoPreviewUrl(null)
    toast.info('Logo dilepas (akan menggunakan teks atau fallback)')
  }

  // Submit Site Settings
  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault()

    startTransitionSettings(async () => {
      const formData = new FormData()
      formData.append('siteName', siteName)
      formData.append('tagline', tagline)
      formData.append('logoId', selectedLogoId ? selectedLogoId.toString() : '')
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('whatsappNumber', whatsappNumber)
      formData.append('whatsappMessage', whatsappMessage)
      formData.append('address', address)

      const res = await updateSiteSettingsAction(formData)
      if (res.success) {
        toast.success('Pengaturan umum situs berhasil disimpan!')
      } else {
        toast.error(res.error || 'Gagal menyimpan pengaturan situs')
      }
    })
  }

  // Submit Hero Section
  const handleSaveHeroSection = (e: React.FormEvent) => {
    e.preventDefault()

    startTransitionHero(async () => {
      const formData = new FormData()
      formData.append('headline', headline)
      formData.append('subheadline', subheadline)
      formData.append('ctaPrimaryLabel', ctaPrimaryLabel)
      formData.append('ctaPrimaryUrl', ctaPrimaryUrl)
      formData.append('ctaSecondaryLabel', ctaSecondaryLabel)
      formData.append('ctaSecondaryUrl', ctaSecondaryUrl)

      const res = await updateHeroSectionAction(formData)
      if (res.success) {
        toast.success('Pengaturan Hero Section berhasil disimpan!')
      } else {
        toast.error(res.error || 'Gagal menyimpan Hero Section')
      }
    })
  }

  // WhatsApp helper link
  const generatedWhatsAppLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        whatsappMessage || ''
      )}`
    : ''

  const filteredMedia = mediaList.filter(
    (m) =>
      Boolean(m.url) &&
      ((m.filename && m.filename.toLowerCase().includes(mediaSearch.toLowerCase())) ||
        (m.alt && m.alt.toLowerCase().includes(mediaSearch.toLowerCase())))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Pengaturan Situs
          </h1>
          <p className="text-sm text-zinc-400">
            Kelola identitas website, kontak bisnis, nomor WhatsApp, serta teks headline di halaman utama.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          Informasi Situs & Kontak
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'hero'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Hero Section Homepage
        </button>
      </div>

      {/* Tab 1: Informasi Situs & Kontak */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSiteSettings} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Form Fields */}
            <div className="space-y-6 lg:col-span-2">
              {/* Card 1: Identitas Brand */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-indigo-400" />
                  Identitas Brand & Situs
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Nama Situs / Brand <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      placeholder="e.g. Snava Creative"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Tagline / Slogan
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Creative Digital Agency & Visual Production"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Kontak & WhatsApp */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  Kontak Bisnis & WhatsApp
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-zinc-500" />
                          Email Bisnis
                        </span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hello@snavacreative.com"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-zinc-500" />
                          Telepon / No. Kantor
                        </span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08211983889"
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                        Nomor WhatsApp (Direct Chat)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="628211983889"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Gunakan format internasional tanpa spasi atau tanda plus (contoh: <strong>628211983889</strong>).
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Template Pesan Default WhatsApp
                    </label>
                    <textarea
                      rows={3}
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      placeholder="Halo Snava Creative, saya tertarik untuk konsultasi tentang project saya."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Pesan ini akan otomatis terisi ketika pengunjung mengklik tombol WhatsApp di website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        Alamat Fisik / Lokasi Kantor
                      </span>
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Bandung, Jawa Barat, Indonesia"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Logo & WhatsApp Preview */}
            <div className="space-y-6">
              {/* Logo Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-400" />
                  Logo Website
                </h3>

                {/* Preview Box */}
                <div className="relative mb-4 flex min-h-35 items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950/80 p-4">
                  {logoPreviewUrl ? (
                    <div className="relative flex flex-col items-center gap-2">
                      <div className="relative h-20 w-44">
                        <Image
                          src={logoPreviewUrl}
                          alt="Logo Snava"
                          fill
                          sizes="176px"
                          className="object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" /> Lepas Logo
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-zinc-600 mb-1.5" />
                      <p className="text-xs text-zinc-400">Belum ada logo terpilih</p>
                      <p className="text-[11px] text-zinc-600">
                        Default: logo file lokal atau teks
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload & Choose Buttons */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                        Mengunggah logo...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-3.5 w-3.5 text-zinc-400" />
                        Unggah Logo Baru
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-colors"
                  >
                    <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                    Pilih dari Media Library
                  </button>
                </div>
              </div>

              {/* WhatsApp Live Preview Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                  Pratinjau Link WhatsApp
                </h3>
                <p className="text-xs text-zinc-400 mb-3">
                  URL langsung yang akan dibuka pengguna saat mengklik tombol kontak:
                </p>

                {generatedWhatsAppLink ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-zinc-950 p-3 border border-zinc-800/80 font-mono text-xs text-emerald-400/90 break-all select-all">
                      {generatedWhatsAppLink}
                    </div>

                    <a
                      href={generatedWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Uji Buka Chat WhatsApp
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Masukkan nomor WhatsApp untuk melihat pratinjau link.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
            <span className="text-xs text-zinc-400">
              Perubahan pada pengaturan ini akan langsung diterapkan ke footer dan kontak situs.
            </span>

            <button
              type="submit"
              disabled={isPendingSettings}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPendingSettings ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Pengaturan Situs
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Hero Section */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHeroSection} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Hero Section Fields */}
            <div className="space-y-6 lg:col-span-2">
              {/* Card 1: Teks Utama */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Teks Headline & Subheadline
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Headline Utama <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="Crafting Brands, Preserving Moments"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Teks besar yang pertama kali dilihat oleh pengunjung website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Subheadline <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={subheadline}
                      onChange={(e) => setSubheadline(e.target.value)}
                      placeholder="Kami menyediakan layanan creative digital agency..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                    <p className="mt-1 text-xs text-zinc-500">
                      Deskripsi singkat pelengkap nilai utama agensi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Tombol CTA (Call to Action) */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-indigo-400" />
                  Tombol Aksi (Call To Action)
                </h2>

                <div className="space-y-6">
                  {/* CTA 1 */}
                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                        Tombol Utama (Primary CTA)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Label Tombol <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ctaPrimaryLabel}
                          onChange={(e) => setCtaPrimaryLabel(e.target.value)}
                          placeholder="Konsultasi Gratis"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Target URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ctaPrimaryUrl}
                          onChange={(e) => setCtaPrimaryUrl(e.target.value)}
                          placeholder="#whatsapp"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Gunakan <strong>#whatsapp</strong> agar tombol otomatis mengarahkan ke nomor WhatsApp dari pengaturan umum.
                    </p>
                  </div>

                  {/* CTA 2 */}
                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                        Tombol Kedua (Secondary CTA)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Label Tombol <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ctaSecondaryLabel}
                          onChange={(e) => setCtaSecondaryLabel(e.target.value)}
                          placeholder="Jelajahi Portofolio"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-400 mb-1">
                          Target URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ctaSecondaryUrl}
                          onChange={(e) => setCtaSecondaryUrl(e.target.value)}
                          placeholder="#portfolio"
                          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Live Preview on Homepage */}
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Pratinjau Tampilan Hero
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Simulasi bagaimana hero section akan terlihat di homepage website:
                </p>

                {/* Simulated Hero Card */}
                <div className="rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-900 to-black p-5 text-center shadow-inner">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-400 mb-3">
                    <Sparkles className="h-3 w-3" /> Creative Digital Agency
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight leading-snug line-clamp-2">
                    {headline || 'Headline Utama Website'}
                  </h4>

                  <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {subheadline || 'Subheadline penjelasan tentang agensi dan keunggulan visual.'}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm">
                      {ctaPrimaryLabel || 'Tombol 1'}
                    </span>
                    <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300">
                      {ctaSecondaryLabel || 'Tombol 2'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
            <span className="text-xs text-zinc-400">
              Perubahan pada hero section akan langsung tayang pada halaman beranda utama.
            </span>

            <button
              type="submit"
              disabled={isPendingHero}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPendingHero ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Hero Section
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Modal: Media Picker for Logo */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-semibold text-zinc-100">
                  Pilih Gambar dari Media Library
                </h3>
                <p className="text-xs text-zinc-400">
                  Pilih berkas logo atau ikon yang sudah pernah diunggah sebelumnya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                placeholder="Cari nama berkas..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-9 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Grid */}
            <div className="max-h-72 overflow-y-auto pr-1">
              {filteredMedia.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  Tidak ada media yang cocok dengan pencarian.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedLogoId === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectMedia(item)}
                        className={`group relative aspect-video overflow-hidden rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                            : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                        }`}
                      >
                        <Image
                          src={item.url!}
                          alt={item.alt || item.filename || 'Media Snava'}
                          fill
                          sizes="(max-width: 640px) 33vw, 25vw"
                          className="object-contain p-1.5"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/30">
                            <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 to-transparent p-1">
                          <p className="truncate text-[10px] text-zinc-300">
                            {item.filename || 'Media'}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setIsMediaModalOpen(false)}
                className="rounded-lg border border-zinc-800 bg-zinc-800/60 px-4 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
