'use client'

import { Moon, Sun } from 'lucide-react'
import { useAdminTheme } from './admin-theme-provider'

export function AdminThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useAdminTheme()
  const isDark = theme === 'dark'
  const nextThemeLabel = isDark ? 'mode terang' : 'mode gelap'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${className}`}
      aria-label={`Aktifkan ${nextThemeLabel}`}
      title={`Aktifkan ${nextThemeLabel}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
