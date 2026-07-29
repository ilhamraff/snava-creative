import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { getFinalCtaData } from '@/lib/data/get-site-settings'
import { ArrowRight } from 'lucide-react'

export async function FinalCTASection() {
  const finalCtaData = await getFinalCtaData()

  return (
    <section id="final-cta" className="py-24 lg:py-32 bg-foreground text-background">
      <Container>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <h2 className="font-display text-4xl sm:text-6xl lg:text-[5rem] font-medium tracking-tight leading-[1.1] mb-8">
            {finalCtaData.headline}
          </h2>
          
          <p className="text-lg md:text-xl font-light text-background/80 mb-12 max-w-2xl">
            {finalCtaData.subheadline}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Button 
              href={finalCtaData.ctaPrimary.url} 
              size="lg" 
              className="rounded-none px-8 bg-background text-foreground hover:bg-background/90 text-base"
            >
              {finalCtaData.ctaPrimary.label}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <a 
              href={finalCtaData.ctaSecondary.url}
              className="text-sm font-medium text-background/70 hover:text-background transition-colors inline-flex items-center gap-2 group uppercase tracking-widest border-b border-transparent hover:border-background pb-1"
            >
              {finalCtaData.ctaSecondary.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
