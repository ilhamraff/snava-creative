import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/ui/animated-section'
import { finalCtaData } from '@/lib/data/footer'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function FinalCTASection() {
  return (
    <AnimatedSection className="py-20 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-accent/20 via-accent/10 to-transparent border border-accent/20 px-6 py-16 text-center sm:px-12 lg:py-24">
          {/* Background decorative blobs */}
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/10 blur-[80px]" aria-hidden="true" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-accent-light/10 blur-[60px]" aria-hidden="true" />

          <div className="relative z-10">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
              {finalCtaData.headline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted lg:text-lg">
              {finalCtaData.subheadline}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href={finalCtaData.ctaPrimary.url} size="lg">
                <MessageCircle className="h-5 w-5" />
                {finalCtaData.ctaPrimary.label}
              </Button>
              <Button
                href={finalCtaData.ctaSecondary.url}
                variant="secondary"
                size="lg"
              >
                {finalCtaData.ctaSecondary.label}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </AnimatedSection>
  )
}
