'use client'

import {
  Layers,
  Loader2,
  Save,
  Sparkles,
} from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateSectionTextsAction } from './actions'

import type { PricingSectionData, ServicesSectionData } from './types'

interface Props {
  active: boolean
  initialPricingSection: PricingSectionData | null
  initialServicesSection: ServicesSectionData | null
}

export function SectionsSettingsForm({ active, initialPricingSection, initialServicesSection }: Props) {
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

  const [isPendingSections, startTransitionSections] = useTransition()

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

  // Keep the form mounted so switching tabs preserves unsaved values.
  if (!active) return null

  return (
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
  )
}
