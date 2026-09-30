import React from 'react'
import type { Metadata } from 'next'
import { AdminThemeProvider } from './_components/admin-theme-provider'
import './styles.css'

const adminThemeScript = `
  (() => {
    try {
      const theme = window.localStorage?.getItem('snava-admin-theme') === 'dark' ? 'dark' : 'light';
      document.documentElement.dataset.adminTheme = theme;
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch {
      document.documentElement.dataset.adminTheme = 'light';
    }
  })();
`

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
    <html
      lang="id"
      className="h-full"
      data-admin-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: adminThemeScript }} />
      </head>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <AdminThemeProvider>{children}</AdminThemeProvider>
      </body>
    </html>
  )
}
