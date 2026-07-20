import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { AnimatedSection } from '@/components/ui/animated-section'
import { whyChooseUsData } from '@/lib/data/why-choose-us'
import {
  Brush,
  ClipboardList,
  MessageSquare,
  Rocket,
  BarChart3,
  FolderOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Brush,
  ClipboardList,
  MessageSquare,
  Rocket,
  BarChart3,
  FolderOpen,
}

export function WhyChooseUsSection() {
  return (
    <AnimatedSection className="py-20 lg:py-28 border-y border-border/50">
      <Container>
        <SectionHeader
          eyebrow="Keunggulan"
          title={whyChooseUsData.title}
          subtitle={whyChooseUsData.subtitle}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUsData.items.map((item) => {
            const Icon = iconMap[item.icon]
            return (
              <div
                key={item.title}
                className="group flex gap-4 rounded-xl p-5 transition-all duration-300 hover:bg-surface-elevated"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </AnimatedSection>
  )
}
