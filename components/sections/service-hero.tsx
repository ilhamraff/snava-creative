import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export interface ServiceHeroProps {
  eyebrow?: string
  headline: string
  description: string
  ctaPrimary?: { label: string; url: string }
  ctaSecondary?: { label: string; url: string }
  image?: string
}

export function ServiceHero({
  eyebrow,
  headline,
  description,
  ctaPrimary,
  ctaSecondary,
  image,
}: ServiceHeroProps) {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1.5 border border-foreground/20 text-foreground mb-6">
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-foreground mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl font-light text-muted leading-relaxed max-w-xl mb-10">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {ctaPrimary && (
                <Button 
                  href={ctaPrimary.url} 
                  size="lg" 
                  className="w-full sm:w-auto rounded-none px-8 bg-foreground text-background hover:bg-foreground/90 text-base"
                >
                  {ctaPrimary.label}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              )}
              {ctaSecondary && (
                <a 
                  href={ctaSecondary.url}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 group uppercase tracking-widest border-b border-transparent hover:border-foreground pb-1"
                >
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-square w-full overflow-hidden bg-surface">
              {image ? (
                <Image
                  src={image}
                  alt={headline}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                  <span className="text-muted/50 font-mono text-sm uppercase tracking-widest">Visual Asset</span>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-l border-b border-foreground/20" />
            <div className="absolute -top-4 -right-4 w-24 h-24 border-r border-t border-foreground/20" />
          </div>
        </div>
      </Container>
    </section>
  )
}
