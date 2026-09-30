'use client'

import {
  ExternalLink,
  Loader2,
  Save,
  Sparkles,
} from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateHeroSectionAction } from '../actions'

import type { HeroSectionData } from '../types'

interface Props {
  active: boolean
  initialHeroSection: HeroSectionData | null
}

export function HeroSettingsForm({ active, initialHeroSection }: Props) {
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

  const [isPendingHero, startTransitionHero] = useTransition()

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

  // Keep the form mounted so switching tabs preserves unsaved values.
  if (!active) return null

  return (
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

            <div className="admin-dark-preview rounded-xl border border-zinc-800 bg-linear-to-b from-zinc-900 to-black p-5 text-center shadow-inner">
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
  )
}
