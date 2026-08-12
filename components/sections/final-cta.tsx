import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { getFinalCtaData } from '@/lib/data/get-site-settings'
import { ArrowRight } from 'lucide-react'

export interface CTASectionProps {
  headline?: string
  subheadline?: string
  ctaPrimary?: { label: string; url: string }
  ctaSecondary?: { label: string; url: string }
}

export async function FinalCTASection({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
}: CTASectionProps = {}) {
  const finalCtaData = await getFinalCtaData()

  const displayHeadline = headline || finalCtaData.headline
  const displaySubheadline = subheadline || finalCtaData.subheadline
  const displayCtaPrimary = ctaPrimary || finalCtaData.ctaPrimary
  const displayCtaSecondary = ctaSecondary || finalCtaData.ctaSecondary

  return (
    <section id="final-cta" className="py-24 lg:py-32 bg-foreground text-background">
      <Container>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-4xl lg:text-[4rem] font-medium tracking-tight leading-[1.1] mb-8">
            {displayHeadline}
          </h2>
          
          <p className="text-lg md:text-xl font-light text-background/80 mb-12 max-w-2xl">
            {displaySubheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Button 
              href={displayCtaPrimary.url} 
              size="lg" 
              className="rounded-none px-8 bg-background text-foreground hover:bg-background/90 text-base"
            >
              {displayCtaPrimary.label}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            {displayCtaSecondary && (
              <a 
                href={displayCtaSecondary.url}
                className="text-sm font-medium text-background/70 hover:text-background transition-colors inline-flex items-center gap-2 group uppercase tracking-widest border-b border-transparent hover:border-background pb-1"
              >
                {displayCtaSecondary.label}
              </a>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
