'use client'

import { getErrorMessage } from '@/lib/utils/error'

import {
  CheckCircle2,
  ExternalLink,
  Globe,
  ImageIcon,
  Info,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Save,
  Search,
  Share2,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  updateSiteSettingsAction,
  updateSocialLinksAction,
  uploadLogoAction,
} from '../actions'

import { AboutSettingsForm } from './about-settings-form'
import { HeroSettingsForm } from './hero-settings-form'
import { SectionsSettingsForm } from './sections-settings-form'
import type { MediaItem, SettingsClientProps, SocialLinkItem } from '../types'

const PLATFORM_OPTIONS = [
  'Instagram',
  'LinkedIn',
  'Behance',
  'Dribbble',
  'YouTube',
  'Twitter',
  'Facebook',
  'GitHub',
  'TikTok',
  'Pinterest',
  'WhatsApp',
  'Telegram',
  'Threads',
]

export function SettingsClient({
  initialSiteSettings,
  initialHeroSection,
  initialAboutPage,
  initialPricingSection,
  initialServicesSection,
  mediaList,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'hero' | 'about' | 'sections'>('general')

  // --- Tab 1: Site Settings Form State ---
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

  // Social Links State (Point 1)
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(
    initialSiteSettings?.socialLinks && initialSiteSettings.socialLinks.length > 0
      ? initialSiteSettings.socialLinks
      : [
          { platform: 'Instagram', url: 'https://instagram.com/snavacreative' },
          { platform: 'TikTok', url: 'https://www.tiktok.com/@snavacreative' },
        ]
  )

  // Transitions & Modals
  const [isPendingSettings, startTransitionSettings] = useTransition()
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const [mediaSearch, setMediaSearch] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- Handlers for Logo ---
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
    } catch (err) {
      toast.error(getErrorMessage(err, 'Terjadi kesalahan saat upload logo'))
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

  // --- Handlers for Social Links Repeater ---
  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: 'Instagram', url: 'https://' }])
  }

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialLinks((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  // --- Submit Handlers ---
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
      const resSocial = await updateSocialLinksAction(socialLinks)

      if (res.success && resSocial.success) {
        toast.success('Pengaturan umum dan media sosial berhasil disimpan!')
      } else {
        toast.error(res.error || resSocial.error || 'Gagal menyimpan pengaturan situs')
      }
    })
  }

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
            Pengaturan Situs & Konten
          </h1>
          <p className="text-sm text-zinc-400">
            Kelola identitas website, kontak, media sosial, headline hero, tentang kami, serta teks pengantar seksi beranda.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
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
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'hero'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Hero Section Homepage
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('about')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'about'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Info className="h-4 w-4" />
          Tentang Kami (About)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
            activeTab === 'sections'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          Teks Seksi Beranda
        </button>
      </div>

      {/* ========================================================
          Tab 1: Informasi Situs, Kontak & Media Sosial
          ======================================================== */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveSiteSettings} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left 2 Cols */}
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
                      placeholder="Bandung Barat, Jawa Barat, Indonesia"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Media Sosial (Point 1) */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-sky-400" />
                      Link Media Sosial
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Daftar akun media sosial resmi yang akan ditampilkan pada footer situs.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddSocialLink}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Akun
                  </button>
                </div>

                <div className="space-y-3">
                  {socialLinks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                      Belum ada link media sosial. Klik &quot;Tambah Akun&quot; untuk menambahkan.
                    </div>
                  ) : (
                    socialLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/60 sm:flex-row sm:items-center"
                      >
                        <div className="w-full sm:w-44">
                          <select
                            value={link.platform}
                            onChange={(e) => handleSocialLinkChange(idx, 'platform', e.target.value)}
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                          >
                            {PLATFORM_OPTIONS.map((plat) => (
                              <option key={plat} value={plat}>
                                {plat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1">
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleSocialLinkChange(idx, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none font-mono"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(idx)}
                          className="self-end sm:self-center p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Hapus tautan ini"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col */}
            <div className="space-y-6">
              {/* Logo Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-400" />
                  Logo Website
                </h3>

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
                      <p className="text-[11px] text-zinc-600">Default: logo file lokal atau teks</p>
                    </div>
                  )}
                </div>

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

          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
            <span className="text-xs text-zinc-400">
              Perubahan pada identitas, kontak, dan link media sosial akan langsung diterapkan ke footer website.
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

      {/* ========================================================
          Tab 2: Hero Section
          ======================================================== */}
      <HeroSettingsForm active={activeTab === 'hero'} initialHeroSection={initialHeroSection} />

      {/* ========================================================
          Tab 3: Tentang Kami / About (Point 2)
          ======================================================== */}
      <AboutSettingsForm active={activeTab === 'about'} initialAboutPage={initialAboutPage} />

      {/* ========================================================
          Tab 4: Teks Seksi Beranda (Point 2)
          ======================================================== */}
      <SectionsSettingsForm active={activeTab === 'sections'} initialPricingSection={initialPricingSection} initialServicesSection={initialServicesSection} />

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
