import React from 'react'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
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
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid #27272a',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  )
}
