'use client'

import { Container } from '@/components/ui/container'
import { siteSettings } from '@/lib/data/site-settings'
import { footerData } from '@/lib/data/footer'
import { FaInstagram, FaLinkedin, FaBehance, FaDribbble } from 'react-icons/fa'
import { IconType } from 'react-icons'

const socialIconMap: Record<string, IconType> = {
  FaInstagram,
  FaLinkedin,
  FaBehance,
  FaDribbble,
}

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 pt-16 pb-8">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="font-display text-lg font-bold text-foreground">
              {siteSettings.siteName}
            </a>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              {footerData.description}
            </p>
            {/* Social Icons */}
            <div className="mt-5 flex gap-3">
              {siteSettings.socialMedia.map((social) => {
                const Icon = socialIconMap[social.icon]
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all hover:border-charcoal hover:text-foreground hover:bg-surface-elevated"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Navigasi</h3>
            <ul className="space-y-2.5">
              {footerData.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Layanan</h3>
            <ul className="space-y-2.5">
              {footerData.serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Kontak</h3>
            <ul className="space-y-2.5 text-sm text-muted">
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
              <li>{siteSettings.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="text-xs text-muted">{footerData.copyright}</p>
          <a
            href="#"
            aria-label="Kembali ke atas"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-all hover:border-charcoal hover:text-foreground hover:bg-surface-elevated"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span className="text-xs">↑</span>
          </a>
        </div>
      </Container>
    </footer>
  )
}
