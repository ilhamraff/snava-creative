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
import { db } from '@/lib/db'
import {
  categories,
  portfolio,
  services,
  testimonials,
  media,
} from '@/lib/db/schema'
import { count } from 'drizzle-orm'
import { AdminLogo } from '../_components/admin-logo'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

export default async function AdminDashboardPage() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Parallel fetching counts from Supabase via Drizzle (Vercel best practice)
  const [
    catResult,
    portResult,
    servResult,
    testResult,
    medResult,
  ] = await Promise.all([
    db.select({ val: count() }).from(categories),
    db.select({ val: count() }).from(portfolio),
    db.select({ val: count() }).from(services),
    db.select({ val: count() }).from(testimonials),
    db.select({ val: count() }).from(media),
  ])

  const stats = [
    {
      label: 'Kategori',
      value: (catResult[0]?.val ?? 0).toString(),
      icon: FolderOpen,
      badge: 'Aktif',
      href: '/admin/kategori',
    },
    {
      label: 'Portfolio',
      value: (portResult[0]?.val ?? 0).toString(),
      icon: Briefcase,
      badge: 'Data Ada',
      href: '/admin/portfolio',
    },
    {
      label: 'Layanan',
      value: (servResult[0]?.val ?? 0).toString(),
      icon: Layers,
      badge: 'Data Ada',
      href: '/admin/layanan',
    },
    {
      label: 'Testimoni',
      value: (testResult[0]?.val ?? 0).toString(),
      icon: MessageSquareQuote,
      badge: 'Segera',
      href: '/admin/testimoni',
    },
    {
      label: 'Media',
      value: (medResult[0]?.val ?? 0).toString(),
      icon: ImageIcon,
      badge: 'Data Ada',
      href: '/admin/media',
    },
    {
      label: 'Pengaturan',
      value: '1',
      icon: Settings,
      badge: 'Sistem',
      href: '/admin/pengaturan',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            {getGreeting()} 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-400">
            {today} &bull; Panel Manajemen Snava Creative
          </p>
        </div>
        <AdminLogo className="w-36 shrink-0 sm:w-40" />
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
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      stat.badge === 'Aktif'
                        ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-400'
                    }`}>
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
      <div className="rounded-xl border border-indigo-500/20 bg-linear-to-r from-indigo-950/30 via-zinc-900/30 to-zinc-900/20 p-5 backdrop-blur-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              Modul Kategori Aktif
            </h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              Modul CRUD Kategori telah terhubung penuh ke Supabase Postgres via Drizzle ORM dengan validasi Zod dan proteksi relasi data.
            </p>
          </div>
          <Link
            href="/admin/kategori"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 sm:mt-0"
          >
            <span>Buka Kategori</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
