import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import type { Service } from '@/lib/types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/animated-section'

export interface RelatedServicesProps {
  services: Service[]
}

export function RelatedServices({ services }: RelatedServicesProps) {
  if (!services || services.length === 0) return null

  return (
    <AnimatedSection className="py-24 lg:py-32 bg-surface border-t border-border/50">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <SectionHeader
            eyebrow="Other Services"
            title="Layanan Terkait"
            className="mb-0"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.slug} 
              href={`/services/${service.slug}`}
              className="group block p-8 bg-background border border-border/50 hover:border-foreground/30 transition-colors duration-300"
            >
              <h3 className="font-display text-2xl font-medium text-foreground mb-4 group-hover:text-accent transition-colors">
                {service.title}
              </h3>
              <p className="text-muted font-light leading-relaxed mb-8 line-clamp-3">
                {service.description}
              </p>
              
              <div className="flex items-center text-sm font-medium text-foreground uppercase tracking-widest gap-2">
                <span>Pelajari Lebih Lanjut</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  )
}
