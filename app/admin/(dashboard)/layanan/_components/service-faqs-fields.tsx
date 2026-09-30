'use client'

import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  Trash2,
} from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { genId, moveItem } from '../_lib/service-form-utils'
import type { FaqState } from '../types'

interface Props {
  faqs: FaqState[]
  setFaqs: Dispatch<SetStateAction<FaqState[]>>
}

export function ServiceFaqsFields({ faqs, setFaqs }: Props) {
  // Repeater helpers - FAQs
  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      { id: genId('faq'), question: '', answer: '' },
    ])
  }

  const updateFaq = (id: string, partial: Partial<FaqState>) => {
    setFaqs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...partial } : item))
    )
  }

  const removeFaq = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">
            FAQ Layanan ({faqs.length})
          </h2>
          <p className="text-xs text-zinc-400">
            Daftar tanya-jawab spesifik untuk layanan ini guna menjawab keraguan calon klien.
          </p>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-600 transition cursor-pointer sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah FAQ</span>
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-center sm:p-12">
          <HelpCircle className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
          <h3 className="text-sm font-medium text-zinc-300">
            Belum ada FAQ untuk layanan ini
          </h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Tambahkan pertanyaan yang sering diajukan klien mengenai alur kerja, revisi, atau durasi.
          </p>
          <button
            type="button"
            onClick={addFaq}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Pertanyaan Pertama</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {faq.question.trim() || `Pertanyaan #${idx + 1}`}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Geser Naik"
                    disabled={idx === 0}
                    onClick={() =>
                      setFaqs((prev) => moveItem(prev, idx, 'up'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Geser Turun"
                    disabled={idx === faqs.length - 1}
                    onClick={() =>
                      setFaqs((prev) => moveItem(prev, idx, 'down'))
                    }
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Hapus FAQ"
                    onClick={() => removeFaq(faq.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Pertanyaan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berapa lama waktu pengerjaan proyek?"
                  value={faq.question}
                  onChange={(e) =>
                    updateFaq(faq.id, { question: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Jawaban *
                </label>
                <textarea
                  rows={3}
                  placeholder="Uraikan jawaban yang jelas dan informatif..."
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaq(faq.id, { answer: e.target.value })
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-800 py-3 text-xs font-medium text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900/40 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Pertanyaan FAQ Baru</span>
          </button>
        </div>
      )}
    </div>
  )
}
