'use client'

import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { genId, moveItem } from '../_lib/service-form-utils'
import type { ProblemState } from '../types'

interface Props {
  problems: ProblemState[]
  setProblems: Dispatch<SetStateAction<ProblemState[]>>
}

export function ServiceProblemsFields({ problems, setProblems }: Props) {
  // Repeater helpers - Problems
  const addProblem = () => {
    setProblems((prev) => [
      ...prev,
      { id: genId('prob'), title: '', description: '' },
    ])
  }

  const updateProblem = (id: string, partial: Partial<ProblemState>) => {
    setProblems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    )
  }

  const removeProblem = (id: string) => {
    setProblems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">
            Tantangan Klien / Problem Section ({problems.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Tampilkan pain point utama calon klien sebelum menawarkan solusi dari layanan Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={addProblem}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-600 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Masalah</span>
        </button>
      </div>

      {problems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
          <h3 className="text-sm font-medium text-zinc-300">
            Belum ada poin tantangan klien
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Tambahkan pain point atau masalah yang sering dialami calon klien di industri ini.
          </p>
          <button
            type="button"
            onClick={addProblem}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Masalah Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {problems.map((prob, idx) => (
            <div
              key={prob.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {prob.title.trim() || `Tantangan #${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Geser Naik"
                    disabled={idx === 0}
                    onClick={() =>
                      setProblems((prev) => moveItem(prev, idx, 'up'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Geser Turun"
                    disabled={idx === problems.length - 1}
                    onClick={() =>
                      setProblems((prev) => moveItem(prev, idx, 'down'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Hapus Tantangan"
                    onClick={() => removeProblem(prob.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Judul Tantangan / Masalah *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Identitas Visual yang Tidak Konsisten"
                  value={prob.title}
                  onChange={(e) =>
                    updateProblem(prob.id, { title: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Uraian Masalah / Dampak
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan bagaimana masalah ini merugikan bisnis calon klien..."
                  value={prob.description}
                  onChange={(e) =>
                    updateProblem(prob.id, {
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addProblem}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-3 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900/40 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Tantangan Baru</span>
          </button>
        </div>
      )}
    </div>
  )
}
