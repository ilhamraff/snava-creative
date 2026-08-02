import React from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Hind, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import './styles.css'

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
  metadataBase: new URL("https://www.snavacreative.id"),
  alternates: {
    canonical: 'https://www.snavacreative.id',
  },

  title: {
    default: 'Creative Digital Agency | Snava Creative',
    template: '%s | Snava Creative',
  },

  description:
    'Your complete creative partner for building standout brands through strategic design, compelling visuals, and creative solutions',
  
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",

  keywords: [ 
    'creative agency',
    'snava creative',
    'snava',
    'digital agency',
    'branding',
    'desain grafis',
    'video production',
    'social media',
    'landing page',
    'logo design',
    'Indonesia',
    'Bandung',
  ],

  openGraph: {
    title: 'Snava Creative — Creative Digital Agency',
    description:
      'Your complete creative partner for standout brands and visuals.',
    url: 'https://www.snavacreative.id',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Snava Creative',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Snava Creative Open Graph Image',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Snava Creative — Creative Digital Agency',
    description:
      'Your complete creative partner for standout brands and visuals.',
    images: ['/assets/og-image.png'],
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
      className={`${spaceGrotesk.variable} ${hind.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent flash of wrong theme on page load (default: light) */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('snava-theme');if(t){document.documentElement.setAttribute('data-theme',t)}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`,
          }}
        />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Snava Creative',
              description:
                'Your complete creative partner for standout brands and visuals.',
              url: 'https://www.snavacreative.id',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+62-821-1983-889',
                contactType: 'customer service',
                availableLanguage: 'Indonesian',
              },
              sameAs: [
                'https://instagram.com/snavacreative',
              ],
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
