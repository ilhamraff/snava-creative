'use client'

import { Check } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

interface Props {
  services: { id: number; title: string }[]
  selectedIds: number[]
  onChange: Dispatch<SetStateAction<number[]>>
}

export function PortfolioRelatedServices({ services, selectedIds: formRelatedServiceIds, onChange: setFormRelatedServiceIds }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-zinc-300">
          Layanan Terkait (Tampilkan di Halaman Layanan)
        </label>
        {formRelatedServiceIds.length > 0 && (
          <span className="text-[10px] text-indigo-400 font-medium">
            {formRelatedServiceIds.length} layanan dipilih
          </span>
        )}
      </div>
      <p className="text-[11px] text-zinc-500">
        Pilih layanan yang berkaitan agar portfolio ini tampil pada galeri hasil karya di halaman layanan tersebut.
      </p>
      <div className="flex flex-wrap gap-2 pt-0.5">
        {services.length > 0 ? (
          services.map((srv) => {
            const isSelected = formRelatedServiceIds.includes(srv.id)
            return (
              <button
                key={srv.id}
                type="button"
                onClick={() => {
                  setFormRelatedServiceIds((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== srv.id)
                      : [...prev, srv.id]
                  )
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'border border-zinc-700 bg-zinc-900'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[2.5]" />}
                </span>
                <span>{srv.title}</span>
              </button>
            )
          })
        ) : (
          <p className="text-xs text-zinc-500 italic">
            Belum ada layanan yang aktif.
          </p>
        )}
      </div>
    </div>

  )
}
