'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '../../login/actions'
import { AdminLogo } from '../../_components/admin-logo'
import { AdminThemeToggle } from '../../_components/admin-theme-toggle'
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  FolderOpen,
  MessageSquareQuote,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const globalNav: NavItem[] = [
  { label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
]

const collectionNav: NavItem[] = [
  { label: 'Portfolio', href: '/admin/portfolio', icon: Briefcase },
  { label: 'Layanan', href: '/admin/layanan', icon: Layers },
  { label: 'Kategori', href: '/admin/kategori', icon: FolderOpen },
  { label: 'Testimoni', href: '/admin/testimoni', icon: MessageSquareQuote },
]

function getInitials(email?: string): string {
  if (!email) return 'AD'
  const parts = email.split('@')[0]
  return parts.slice(0, 2).toUpperCase()
}

export function AdminSidebar({ user }: { user: { email?: string } }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const closeSidebar = () => setOpen(false)

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-md md:hidden">
        <Link href="/admin" className="flex items-center" aria-label="Dashboard Snava Creative">
          <AdminLogo className="w-28" priority />
        </Link>
        <div className="flex items-center gap-2">
          <AdminThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
            aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      ) : null}

      {/* Sidebar (Desktop Fixed + Mobile Slide-over) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[calc(100vw-2rem)] flex-col border-r border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl transition-transform duration-200 ease-in-out md:max-w-none md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-800/80 px-5">
          <Link
            href="/admin"
            className="group flex min-w-0 flex-1 flex-col items-start gap-0.5"
            onClick={closeSidebar}
            aria-label="Dashboard Snava Creative"
          >
            <AdminLogo className="w-32 transition-opacity group-hover:opacity-75" priority />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
              Admin Panel
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <AdminThemeToggle className="hidden md:inline-flex" />
            <button
              type="button"
              onClick={closeSidebar}
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 md:hidden"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {/* Global Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Global
            </div>
            <div className="mt-2 space-y-1">
              {globalNav.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-zinc-900/90 text-white shadow-sm border border-zinc-800'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                    }`}
                  >
                    {active ? (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500" />
                    ) : null}
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        active
                          ? 'text-indigo-400'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Collections Group */}
          <div>
            <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Koleksi
            </div>
            <div className="mt-2 space-y-1">
              {collectionNav.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                      active
                        ? 'bg-zinc-900/90 text-white shadow-sm border border-zinc-800'
                        : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                    }`}
                  >
                    {active ? (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500" />
                    ) : null}
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        active
                          ? 'text-indigo-400'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        <div className="border-t border-zinc-800/80 px-3 py-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            onClick={closeSidebar}
            className="group flex items-center justify-between gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2.5 text-xs font-medium text-zinc-300 transition-colors duration-150 hover:border-indigo-500/40 hover:bg-indigo-950/30 hover:text-indigo-300"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-indigo-400" aria-hidden="true" />
              Lihat Website
            </span>
            <span className="text-[10px] font-normal text-zinc-500">Tab baru</span>
          </Link>
        </div>

        {/* User Footer Profile */}
        <div className="border-t border-zinc-800/80 p-3 bg-zinc-950/60">
          <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-700/50">
                {getInitials(user.email)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-xs font-medium text-zinc-200">
                  {user.email ?? 'admin@snava.id'}
                </div>
                <div className="text-[10px] text-zinc-500">Administrator</div>
              </div>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-950/40 hover:text-red-400"
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
