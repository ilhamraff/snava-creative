'use client'

import { ImageIcon, Link as LinkIcon, UploadCloud, X } from 'lucide-react'
import type { ChangeEventHandler, RefObject } from 'react'

interface PortfolioImageFieldProps {
  imageMode: 'upload' | 'url'
  onModeChange: (mode: 'upload' | 'url') => void
  imageUrl: string
  previewUrl: string
  selectedFileName?: string
  onUrlChange: (url: string) => void
  onRemove: () => void
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: ChangeEventHandler<HTMLInputElement>
}

export function PortfolioImageField({
  imageMode,
  onModeChange,
  imageUrl,
  previewUrl,
  selectedFileName,
  onUrlChange,
  onRemove,
  fileInputRef,
  onFileChange,
}: PortfolioImageFieldProps) {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5">
      <div className="flex flex-col gap-3 border-b border-zinc-800/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Thumbnail Portfolio</h2>
          <p className="mt-1 text-[11px] text-zinc-500">
            Gunakan gambar utama yang mewakili proyek.
          </p>
        </div>
        <div className="flex w-fit items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => onModeChange('upload')}
            className={`flex items-center gap-1 rounded px-2 py-1 transition ${
              imageMode === 'upload'
                ? 'bg-indigo-600 font-medium text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="h-3 w-3" aria-hidden="true" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => onModeChange('url')}
            className={`flex items-center gap-1 rounded px-2 py-1 transition ${
              imageMode === 'url'
                ? 'bg-indigo-600 font-medium text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" aria-hidden="true" />
            URL Gambar
          </button>
        </div>
      </div>

      {imageMode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onFileChange}
            className="block w-full cursor-pointer text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700"
          />
          <p className="mt-1.5 text-[10px] text-zinc-500">
            PNG, JPG, WebP, atau SVG hingga 10MB. File baru diunggah saat portfolio disimpan.
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="portfolio-image-url" className="mb-1.5 block text-xs font-medium text-zinc-300">
            URL Gambar
          </label>
          <input
            id="portfolio-image-url"
            type="url"
            placeholder="https://images.unsplash.com/... atau URL gambar"
            value={imageUrl}
            onChange={(event) => onUrlChange(event.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      )}

      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
          <div className="aspect-video w-full bg-zinc-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview thumbnail portfolio"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900/80 p-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-200">
                {selectedFileName || 'Gambar aktif'}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                {selectedFileName
                  ? 'Preview lokal — belum dikirim ke Supabase Storage'
                  : 'Thumbnail yang saat ini digunakan'}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
              aria-label="Hapus thumbnail"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 text-zinc-500">
          <ImageIcon className="mb-2 h-7 w-7 stroke-1 text-zinc-600" aria-hidden="true" />
          <span className="text-xs">Belum ada thumbnail</span>
        </div>
      )}
    </section>
  )
}
