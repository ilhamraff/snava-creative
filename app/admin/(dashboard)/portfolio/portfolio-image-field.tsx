'use client'

import { UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react'
import type { ChangeEventHandler, RefObject } from 'react'

interface Props {
  mode: 'create' | 'edit'
  imageMode: 'upload' | 'url'
  setImageMode: (mode: 'upload' | 'url') => void
  formImageUrl: string
  setFormImageUrl: (url: string) => void
  isUploading: boolean
  fileInputRef: RefObject<HTMLInputElement | null>
  handleFileUpload: ChangeEventHandler<HTMLInputElement>
}

export function PortfolioImageField({ mode, imageMode, setImageMode, formImageUrl, setFormImageUrl, isUploading, fileInputRef, handleFileUpload }: Props) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-300">Gambar Thumbnail</span>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded ${
              imageMode === 'upload'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="h-3 w-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded ${
              imageMode === 'url'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>URL Gambar</span>
          </button>
        </div>
      </div>

      {imageMode === 'upload' ? (
        <div key={`${mode}-upload-box`}>
          <input
            key={`${mode}-file-input`}
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
          />
          <p className="mt-1 text-[10px] text-zinc-500">
            {mode === 'edit' ? 'Ganti gambar dengan mengunggah file baru ke Supabase Storage.' : 'Mendukung PNG, JPG, WebP (Maksimal 10MB). File langsung disimpan ke Supabase Storage.'}
          </p>
        </div>
      ) : (
        <div key={`${mode}-url-box`}>
          <input
            key={`${mode}-url-input`}
            type="url"
            placeholder="https://images.unsplash.com/... atau URL gambar"
            value={formImageUrl || ''}
            onChange={(e) => setFormImageUrl(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      )}

      {/* Live Preview */}
      {formImageUrl ? (
        <div className="relative mt-2 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
          <div className="h-16 w-24 shrink-0 overflow-hidden rounded border border-zinc-800 bg-zinc-950 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={formImageUrl}
              alt="Thumbnail Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                  <span>Mengunggah ke Supabase Storage...</span>
                </>
              ) : (
                <span>{mode === 'edit' ? 'Gambar aktif' : 'Gambar siap disimpan'}</span>
              )}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-zinc-500">
              {formImageUrl}
            </p>
          </div>
        </div>
      ) : null}
    </div>

  )
}
