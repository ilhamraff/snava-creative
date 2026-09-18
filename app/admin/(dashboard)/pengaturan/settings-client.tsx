'use client'

import React, { useState, useTransition, useRef } from 'react'
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
  Save,
  Loader2,
  X,
  Search,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  Info,
  Layers,
  Target,
  Lightbulb,
  Handshake,
  Zap,
  Heart,
  Shield,
  Star,
  Rocket,
  Users,
  Trophy,
  Palette,
  Code,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  updateSiteSettingsAction,
  updateHeroSectionAction,
  uploadLogoAction,
  updateSocialLinksAction,
  updateAboutPageAction,
  updateSectionTextsAction,
} from './actions'

interface MediaItem {
  id: number
  url: string | null
  alt: string | null
  filename: string | null
}

interface SocialLinkItem {
  id?: string
  platform: string
  url: string
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
  socialLinks?: SocialLinkItem[]
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

interface AboutValueItem {
  id?: string
  icon: string
  title: string
  description: string
}

interface AboutPageData {
  id: number
  title: string
  description: string
  vision: string | null
  values?: AboutValueItem[]
}

interface PricingSectionData {
  id: number
  headline: string
  subheadline: string
}

interface ServicesSectionData {
  id: number
  title: string
  description: string
}

interface SettingsClientProps {
  initialSiteSettings: SiteSettingsData | null
  initialHeroSection: HeroSectionData | null
  initialAboutPage: AboutPageData | null
  initialPricingSection: PricingSectionData | null
  initialServicesSection: ServicesSectionData | null
  mediaList: MediaItem[]
}

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

const VALUE_ICONS: Record<string, React.ElementType> = {
  Target,
  Lightbulb,
  Handshake,
  Zap,
  Heart,
  Shield,
  Star,
  Rocket,
  Users,
  Trophy,
  Palette,
  Code,
}

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

  // --- Tab 2: Hero Section Form State ---
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

  // --- Tab 3: About Page Form State (Point 2) ---
  const [aboutTitle, setAboutTitle] = useState(
    initialAboutPage?.title || 'Tentang Snava Creative'
  )
  const [aboutDescription, setAboutDescription] = useState(
    initialAboutPage?.description ||
      'Berbasis di Bandung Barat, Snava Creative menghadirkan solusi kreatif dalam branding, desain, website, fotografi, videografi, dan dokumentasi.'
  )
  const [aboutVision, setAboutVision] = useState(
    initialAboutPage?.vision || '"Your Complete Creative Partner"'
  )
  const [aboutValues, setAboutValues] = useState<AboutValueItem[]>(
    initialAboutPage?.values && initialAboutPage.values.length > 0
      ? initialAboutPage.values
      : [
          { icon: 'Target', title: 'Purposeful', description: 'Every creative decision starts with a clear purpose.' },
          { icon: 'Lightbulb', title: 'Strategic', description: 'We turn creative ideas into solutions with a clear strategy.' },
          { icon: 'Handshake', title: 'Collaborative', description: 'We work with you, not just for you, to bring ideas to life.' },
          { icon: 'Zap', title: 'One-Stop Solution', description: 'Everything you need, all in one creative partner.' },
        ]
  )

  // --- Tab 4: Section Texts Form State (Point 2) ---
  const [servicesTitle, setServicesTitle] = useState(
    initialServicesSection?.title || 'Layanan Kami'
  )
  const [servicesDescription, setServicesDescription] = useState(
    initialServicesSection?.description ||
      'Mulai dari identitas merek hingga konten video, kami membantu bisnis Anda tampil beda melalui desain yang berkelas dan bermakna.'
  )
  const [pricingHeadline, setPricingHeadline] = useState(
    initialPricingSection?.headline || 'Layanan Populer'
  )
  const [pricingSubheadline, setPricingSubheadline] = useState(
    initialPricingSection?.subheadline ||
      'Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda.'
  )

  // Transitions & Modals
  const [isPendingSettings, startTransitionSettings] = useTransition()
  const [isPendingHero, startTransitionHero] = useTransition()
  const [isPendingAbout, startTransitionAbout] = useTransition()
  const [isPendingSections, startTransitionSections] = useTransition()
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

  // --- Handlers for Values Repeater (About Page) ---
  const handleAddAboutValue = () => {
    if (aboutValues.length >= 6) {
      toast.warning('Maksimal 6 poin nilai dapat ditambahkan.')
      return
    }
    setAboutValues((prev) => [
      ...prev,
      { icon: 'Target', title: 'Nilai Baru', description: 'Deskripsi nilai ini.' },
    ])
  }

  const handleRemoveAboutValue = (index: number) => {
    setAboutValues((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAboutValueChange = (
    index: number,
    field: 'icon' | 'title' | 'description',
    value: string
  ) => {
    setAboutValues((prev) => {
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

  const handleSaveAboutPage = (e: React.FormEvent) => {
    e.preventDefault()

    startTransitionAbout(async () => {
      const formData = new FormData()
      formData.append('title', aboutTitle)
      formData.append('description', aboutDescription)
      formData.append('vision', aboutVision)

      const res = await updateAboutPageAction(formData, aboutValues)
      if (res.success) {
        toast.success('Data Tentang Kami (About Page) berhasil disimpan!')
      } else {
        toast.error(res.error || 'Gagal menyimpan data Tentang Kami')
      }
    })
  }

  const handleSaveSectionTexts = (e: React.FormEvent) => {
    e.preventDefault()

    startTransitionSections(async () => {
      const formData = new FormData()
      formData.append('servicesTitle', servicesTitle)
      formData.append('servicesDescription', servicesDescription)
      formData.append('pricingHeadline', pricingHeadline)
      formData.append('pricingSubheadline', pricingSubheadline)

      const res = await updateSectionTextsAction(formData)
      if (res.success) {
        toast.success('Teks Seksi Layanan & Seksi Harga berhasil disimpan!')
      } else {
        toast.error(res.error || 'Gagal menyimpan teks seksi beranda')
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
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHeroSection} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
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
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-indigo-400" />
                  Tombol Aksi (Call To Action)
                </h2>

                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      Tombol Utama (Primary CTA)
                    </span>

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
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Tombol Kedua (Secondary CTA)
                    </span>

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

            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Pratinjau Tampilan Hero
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Simulasi tampilan hero section di halaman beranda:
                </p>

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

      {/* ========================================================
          Tab 3: Tentang Kami / About (Point 2)
          ======================================================== */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAboutPage} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h2 className="text-base font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4 text-indigo-400" />
                  Teks Seksi Tentang Kami
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Judul Section <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={aboutTitle}
                      onChange={(e) => setAboutTitle(e.target.value)}
                      placeholder="Tentang Snava Creative"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Visi / Tagline Agensi
                    </label>
                    <input
                      type="text"
                      value={aboutVision}
                      onChange={(e) => setAboutVision(e.target.value)}
                      placeholder='"Your Complete Creative Partner"'
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                      Deskripsi Profil Agensi <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={aboutDescription}
                      onChange={(e) => setAboutDescription(e.target.value)}
                      placeholder="Berbasis di Bandung Barat, Snava Creative menghadirkan solusi kreatif..."
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Values Repeater */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-400" />
                      Poin Nilai Agensi (Values)
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Maksimal 6 poin pilar nilai atau keunggulan yang ditampilkan pada section About.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAboutValue}
                    disabled={aboutValues.length >= 6}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Nilai
                  </button>
                </div>

                <div className="space-y-4">
                  {aboutValues.map((val, idx) => {
                    const IconComp = VALUE_ICONS[val.icon] || Target
                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-semibold text-zinc-300">
                              Pilar Nilai #{idx + 1}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveAboutValue(idx)}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Hapus pilar ini"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Pilih Ikon
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-indigo-400">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <select
                                value={val.icon}
                                onChange={(e) => handleAboutValueChange(idx, 'icon', e.target.value)}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                              >
                                {Object.keys(VALUE_ICONS).map((iconKey) => (
                                  <option key={iconKey} value={iconKey}>
                                    {iconKey}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                              Judul Pilar Nilai
                            </label>
                            <input
                              type="text"
                              value={val.title}
                              onChange={(e) => handleAboutValueChange(idx, 'title', e.target.value)}
                              placeholder="e.g. Purposeful, Strategic"
                              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                            Deskripsi Nilai
                          </label>
                          <input
                            type="text"
                            value={val.description}
                            onChange={(e) => handleAboutValueChange(idx, 'description', e.target.value)}
                            placeholder="Penjelasan singkat prinsip ini..."
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right 1 Col Preview */}
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-indigo-400" />
                  Pratinjau Seksi Tentang Kami
                </h3>
                <p className="text-xs text-zinc-400 mb-4">
                  Simulasi tampilan card dan pilar nilai di halaman beranda:
                </p>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4">
                  {aboutVision && (
                    <div className="inline-block rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 text-[11px] font-medium text-indigo-400">
                      {aboutVision}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-white">{aboutTitle || 'Tentang Kami'}</h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-4">
                      {aboutDescription || 'Deskripsi profil agensi akan tampil di sini.'}
                    </p>
                  </div>

                  <div className="border-t border-zinc-800/80 pt-3">
                    <p className="text-[11px] font-semibold text-zinc-400 mb-2">Nilai Inti:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {aboutValues.slice(0, 4).map((val, i) => {
                        const IconComp = VALUE_ICONS[val.icon] || Target
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 rounded-lg bg-zinc-900 p-2 border border-zinc-800/60"
                          >
                            <IconComp className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                            <span className="truncate text-[11px] font-medium text-zinc-200">
                              {val.title || 'Nilai'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
            <span className="text-xs text-zinc-400">
              Perubahan pada profil agensi dan pilar nilai akan langsung tayang pada seksi About di beranda.
            </span>

            <button
              type="submit"
              disabled={isPendingAbout}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPendingAbout ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Tentang Kami
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================
          Tab 4: Teks Seksi Beranda (Point 2)
          ======================================================== */}
      {activeTab === 'sections' && (
        <form onSubmit={handleSaveSectionTexts} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Seksi Layanan */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Layers className="h-4 w-4 text-indigo-400" />
                <h2 className="text-base font-semibold text-zinc-100">
                  Teks Seksi Layanan (Services Section)
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Teks judul dan paragraf pengantar yang muncul di atas daftar kartu layanan pada halaman beranda dan halaman /services.
              </p>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Judul Seksi Layanan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={servicesTitle}
                  onChange={(e) => setServicesTitle(e.target.value)}
                  placeholder="Layanan Kami"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Deskripsi Pengantar <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={servicesDescription}
                  onChange={(e) => setServicesDescription(e.target.value)}
                  placeholder="Mulai dari identitas merek hingga konten video, kami membantu bisnis Anda..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Seksi Harga */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-zinc-100">
                  Teks Seksi Harga (Pricing Section)
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Teks judul dan subheadline yang muncul di atas tabel paket harga pada halaman beranda dan halaman /pricing.
              </p>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Headline Seksi Harga <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={pricingHeadline}
                  onChange={(e) => setPricingHeadline(e.target.value)}
                  placeholder="Layanan Populer"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                  Subheadline Pengantar <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={pricingSubheadline}
                  onChange={(e) => setPricingSubheadline(e.target.value)}
                  placeholder="Pilih paket layanan yang sesuai dengan skala bisnis dan kebutuhan spesifik Anda..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
            <span className="text-xs text-zinc-400">
              Perubahan pada teks pengantar ini akan langsung diperbarui di beranda, /services, dan /pricing.
            </span>

            <button
              type="submit"
              disabled={isPendingSections}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPendingSections ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Teks Seksi
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
