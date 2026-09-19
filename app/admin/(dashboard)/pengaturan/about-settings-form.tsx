'use client'

import {
  Code,
  Handshake,
  Heart,
  Info,
  Lightbulb,
  Loader2,
  Palette,
  Plus,
  Rocket,
  Save,
  Shield,
  Star,
  Target,
  Trash2,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updateAboutPageAction } from './actions'

import type { AboutPageData, AboutValueItem } from './types'

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

interface Props {
  active: boolean
  initialAboutPage: AboutPageData | null
}

export function AboutSettingsForm({ active, initialAboutPage }: Props) {
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

  const [isPendingAbout, startTransitionAbout] = useTransition()

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

  // Keep the form mounted so switching tabs preserves unsaved values.
  if (!active) return null

  return (
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
  )
}
