'use client'

import React, { useState } from 'react'
import { login } from './actions'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, the server action redirects — no need to handle here
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-b from-indigo-500/15 via-indigo-600/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-10">
          {/* Brand Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-lg shadow-indigo-600/25">
              <span className="text-xl font-bold">S</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Snava Creative
            </h1>
            <p className="mt-1.5 text-xs text-zinc-400">
              Masuk ke panel manajemen admin
            </p>
          </div>

          {/* Error Alert */}
          {error ? (
            <div
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          ) : null}

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-zinc-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@snavacreative.id"
                required
                autoComplete="email"
                autoFocus
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-zinc-300"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </span>
              ) : (
                'Masuk ke Admin'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 border-t border-zinc-800/60 pt-4 text-center">
            <p className="text-[11px] text-zinc-400">
              Dilindungi oleh Supabase Auth &bull; Snava Creative &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
