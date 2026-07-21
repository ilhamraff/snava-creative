import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { AnimatedSection } from '@/components/ui/animated-section'
import { aboutData } from '@/lib/data/about'
import {
  Target,
  Lightbulb,
  Handshake,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Target,
  Lightbulb,
  Handshake,
  Zap,
}

export function AboutSection() {
  return (
    <AnimatedSection id="tentang" className="py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Text Content */}
          <div>
            <SectionHeader
              eyebrow="Tentang Kami"
              title={aboutData.title}
              align="left"
              className="mb-6 lg:mb-8"
            />
            <p className="text-muted leading-relaxed text-base lg:text-lg">
              {aboutData.description}
            </p>
            <div className="mt-6 rounded-xl border border-accent/20 bg-accent/4 p-4">
              <p className="text-sm font-medium text-accent-light">Visi Kami</p>
              <p className="mt-1 text-sm text-muted leading-relaxed">
                {aboutData.vision}
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border">
            <Image
              src={aboutData.image}
              alt="Tim Snava Creative bekerja kolaboratif"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* Values Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutData.values.map((value) => {
            const Icon = iconMap[value.icon]
            return (
              <div
                key={value.title}
                className="group rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-charcoal/60 hover:bg-surface-elevated"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </AnimatedSection>
  )
}
