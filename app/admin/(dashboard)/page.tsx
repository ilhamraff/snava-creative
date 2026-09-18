import React from 'react'
import {
  Briefcase,
  Layers,
  FolderOpen,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  badge: string
  href: string
}

const stats: StatCardProps[] = [
  { label: 'Portfolio', value: '—', icon: Briefcase, badge: 'Segera', href: '/admin/portfolio' },
  { label: 'Layanan', value: '—', icon: Layers, badge: 'Segera', href: '/admin/layanan' },
  { label: 'Kategori', value: '—', icon: FolderOpen, badge: 'Segera', href: '/admin/kategori' },
  { label: 'Testimoni', value: '—', icon: MessageSquareQuote, badge: 'Segera', href: '/admin/testimoni' },
  { label: 'Media', value: '—', icon: ImageIcon, badge: 'Segera', href: '/admin/media' },
  { label: 'Pengaturan', value: '—', icon: Settings, badge: 'Segera', href: '/admin/pengaturan' },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/80 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {getGreeting()} 👋
        </h1>
        <p className="text-sm font-medium text-zinc-400">
          {today} &bull; Panel Manajemen Snava Creative
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Ringkasan Koleksi & Konten
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-black/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-colors group-hover:border-indigo-500/30 group-hover:bg-indigo-950/30 group-hover:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                      {stat.badge}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-500 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-zinc-900/30 to-zinc-900/20 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Fondasi Admin Panel Aktif
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Autentikasi Supabase & Tailwind CSS v4 siap digunakan. Langkah selanjutnya adalah migrasi schema Drizzle ORM untuk manajemen data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
