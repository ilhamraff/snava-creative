'use client'

import { Container } from '@/components/ui/container'
import type { SiteSettings, FooterData } from '@/lib/types'
import { getSocialIcon } from '@/lib/utils/social-icons'
import { resolveSiteHref } from '@/lib/utils/href'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/components/theme-provider'

interface FooterSectionProps {
  siteSettings: SiteSettings
  footerData: FooterData
}

export function FooterSection({ siteSettings, footerData }: FooterSectionProps) {
  const { theme } = useTheme()
  const logoSrc = theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo-black.png'

  return (
    <footer className="pt-24 pb-12 bg-background">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-24">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center">
                <Image
                  src={logoSrc}
                  alt={siteSettings.siteName}
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="mt-4 text-sm text-muted font-light leading-relaxed max-w-xs">
                {footerData.description}
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="mt-8 flex gap-4">
              {siteSettings.socialMedia.map((social) => {
                const Icon = getSocialIcon(social.platform)
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h3 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-6">Navigation</h3>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={resolveSiteHref(link.href)}
                    className="text-sm font-light text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-6">Services</h3>
            <ul className="space-y-3">
              {footerData.serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={resolveSiteHref(link.href)}
                    className="text-sm font-light text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-widest uppercase mb-6">Contact</h3>
            <ul className="space-y-3 text-sm font-light text-muted">
              <li>
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteSettings.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteSettings.contactPhone}`}
                  className="hover:text-foreground transition-colors"
                >
                  {siteSettings.contactPhone}
                </a>
              </li>
              <li className="pt-2 max-w-50 leading-relaxed">
                {siteSettings.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 sm:flex-row">
          <p className="text-xs text-muted font-light">{footerData.copyright}</p>
          <a
            href="#"
            aria-label="Kembali ke atas"
            className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-foreground transition-colors"
            onClick={(e) => {
              e.preventDefault()
              const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
            }}
          >
            Back to Top
          </a>
        </div>
      </Container>
    </footer>
  )
}

