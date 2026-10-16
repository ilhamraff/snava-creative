import type { Metadata } from 'next'
import { Hind, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { MotionProvider } from '@/components/motion-provider'
import { NotFoundContent } from '@/components/sections/not-found-content'
import { ThemeProvider } from '@/components/theme-provider'
import './(frontend)/styles.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['500'],
})

const hind = Hind({
  subsets: ['latin'],
  variable: '--font-hind',
  display: 'swap',
  weight: ['500'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan | Snava Creative',
  description: 'Alamat yang Anda buka tidak mengarah ke halaman yang tersedia.',
}

export default function GlobalNotFound() {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${hind.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('snava-theme');document.documentElement.setAttribute('data-theme',t||'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`,
          }}
        />
      </head>
      <body className="theme-transition">
        <ThemeProvider>
          <MotionProvider>
            <Navbar />
            <main>
              <NotFoundContent />
            </main>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
