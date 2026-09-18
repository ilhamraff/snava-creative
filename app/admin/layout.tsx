import React from 'react'
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s — Snava Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark h-full" suppressHydrationWarning>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  )
}
