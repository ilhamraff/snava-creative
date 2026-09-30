'use client'

import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Plus,
  Trash2,
  XCircle,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { genId, moveItem } from '../_lib/service-form-utils'
import type { PackageFeatureState, PackageState } from '../types'

interface Props {
  packages: PackageState[]
  setPackages: Dispatch<SetStateAction<PackageState[]>>
}

export function ServicePackagesFields({ packages, setPackages }: Props) {
  // Repeater helpers - Packages
  const addPackage = () => {
    setPackages((prev) => [
      ...prev,
      {
        id: genId('pkg'),
        name: '',
        price: '',
        billingPeriod: '/bulan',
        description: '',
        isPopular: false,
        isCustom: false,
        features: [
          { id: genId('feat'), name: '', included: true },
          { id: genId('feat'), name: '', included: true },
        ],
      },
    ])
  }

  const updatePackage = (id: string, partial: Partial<PackageState>) => {
    setPackages((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    )
  }

  const removePackage = (id: string) => {
    setPackages((prev) => prev.filter((item) => item.id !== id))
  }

  const addPackageFeature = (pkgId: string) => {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === pkgId
          ? {
              ...p,
              features: [
                ...p.features,
                { id: genId('feat'), name: '', included: true },
              ],
            }
          : p
      )
    )
  }

  const updatePackageFeature = (
    pkgId: string,
    featId: string,
    partial: Partial<PackageFeatureState>
  ) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p
        return {
          ...p,
          features: p.features.map((f) =>
            f.id === featId ? { ...f, ...partial } : f
          ),
        }
      })
    )
  }

  const removePackageFeature = (pkgId: string, featId: string) => {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== pkgId) return p
        return {
          ...p,
          features: p.features.filter((f) => f.id !== featId),
        }
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Paket Harga & Layanan ({packages.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Konfigurasikan paket harga, fitur checklist, dan status rekomendasi untuk layanan ini.
          </p>
        </div>
        <button
          type="button"
          onClick={addPackage}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-600 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Paket</span>
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
          <h3 className="text-sm font-medium text-zinc-300">
            Belum ada paket harga
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Layanan ini belum memiliki paket harga. Klik tombol di bawah untuk menambahkan opsi paket.
          </p>
          <button
            type="button"
            onClick={addPackage}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Buat Paket Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`rounded-xl border transition-all p-5 ${
                pkg.isPopular
                  ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/20 to-zinc-900/60 ring-1 ring-indigo-500/20'
                  : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-300 font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {pkg.name.trim() || `Paket #${idx + 1}`}
                  </span>
                  {pkg.isPopular && (
                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                      Populer / Rekomendasi
                    </span>
                  )}
                  {pkg.isCustom && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                      Harga Kustom
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Geser Naik"
                    disabled={idx === 0}
                    onClick={() =>
                      setPackages((prev) => moveItem(prev, idx, 'up'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Geser Turun"
                    disabled={idx === packages.length - 1}
                    onClick={() =>
                      setPackages((prev) => moveItem(prev, idx, 'down'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Hapus Paket"
                    onClick={() => removePackage(pkg.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Nama Paket *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Basic, Starter, Pro"
                    value={pkg.name}
                    onChange={(e) =>
                      updatePackage(pkg.id, { name: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Harga (Rp) {pkg.isCustom && '(Nonaktif)'}
                  </label>
                  <input
                    type="number"
                    disabled={pkg.isCustom}
                    placeholder="Contoh: 1500000"
                    value={pkg.price}
                    onChange={(e) =>
                      updatePackage(pkg.id, { price: e.target.value })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Periode / Skema Tagihan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: /bulan, per project"
                    value={pkg.billingPeriod}
                    onChange={(e) =>
                      updatePackage(pkg.id, {
                        billingPeriod: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description & Flags */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Deskripsi Paket
                  </label>
                  <input
                    type="text"
                    placeholder="Cocok untuk startup dan bisnis baru yang butuh identitas dasar..."
                    value={pkg.description}
                    onChange={(e) =>
                      updatePackage(pkg.id, {
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-4 sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pkg.isPopular}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          isPopular: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-zinc-300">
                      Rekomendasi / Populer
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pkg.isCustom}
                      onChange={(e) =>
                        updatePackage(pkg.id, {
                          isCustom: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs text-zinc-300">
                      Harga Kustom
                    </span>
                  </label>
                </div>
              </div>

              {/* Features Checklist Section */}
              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Fitur & Cakupan ({pkg.features.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => addPackageFeature(pkg.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Fitur</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {pkg.features.map((feat) => (
                    <div
                      key={feat.id}
                      className="flex items-center gap-2"
                    >
                      <button
                        type="button"
                        title={
                          feat.included
                            ? 'Termasuk dalam paket (klik untuk ubah)'
                            : 'Tidak termasuk (klik untuk ubah)'
                        }
                        onClick={() =>
                          updatePackageFeature(pkg.id, feat.id, {
                            included: !feat.included,
                          })
                        }
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded transition cursor-pointer ${
                          feat.included
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {feat.included ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <input
                        type="text"
                        placeholder="Contoh: Revisi Desain 3x, Format Vector AI & EPS"
                        value={feat.name}
                        onChange={(e) =>
                          updatePackageFeature(pkg.id, feat.id, {
                            name: e.target.value,
                          })
                        }
                        className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        title="Hapus Fitur"
                        onClick={() =>
                          removePackageFeature(pkg.id, feat.id)
                        }
                        className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              type="button"
              onClick={addPackage}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-3 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900/40 transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Paket Harga Baru</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
