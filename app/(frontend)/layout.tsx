import React from 'react'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import './styles.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Snava Creative — Creative Digital Agency',
  description:
    'Creative agency yang membantu UMKM, startup, dan perusahaan membangun brand yang kuat melalui desain kreatif, video profesional, dan strategi visual yang tepat sasaran.',
  keywords: [
    'creative agency',
    'digital agency',
    'branding',
    'desain grafis',
    'video production',
    'social media',
    'landing page',
    'logo design',
    'Indonesia',
    'Jakarta',
  ],
  openGraph: {
    title: 'Snava Creative — Creative Digital Agency',
    description:
      'Creative agency yang membantu bisnis tampil menonjol melalui desain dan strategi visual yang tepat.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Snava Creative',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snava Creative — Creative Digital Agency',
    description:
      'Creative agency yang membantu bisnis tampil menonjol melalui desain dan strategi visual yang tepat.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Snava Creative',
              description:
                'Creative agency yang membantu bisnis tampil menonjol melalui desain dan strategi visual.',
              url: 'https://snavacreative.com',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+62-812-3456-789',
                contactType: 'customer service',
                availableLanguage: 'Indonesian',
              },
              sameAs: [
                'https://instagram.com/snavacreative',
                'https://linkedin.com/company/snavacreative',
              ],
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
