import { PortfolioSectionServer } from '@/components/sections/portfolio-server'
import { Container } from '@/components/ui/container'
import { FooterSectionServer } from '@/components/sections/footer-server'

export const metadata = {
  title: 'Portfolio — Snava Creative',
  description: 'Eksplorasi karya-karya terbaik kami dari berbagai industri.',
}

export default function PortfolioPage() {
  return (
    <>
      <main className="pt-32 pb-8 bg-background">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Recent Work
            </h1>
            <p className="text-lg md:text-xl text-muted font-light leading-relaxed">
              Explore some of our latest projects, crafted with purpose to help brands stand out.
            </p>
          </div>
        </Container>
      </main>
      
      {/* 
        limit di-set 100 dan onlyFeatured false secara otomatis oleh default props,
        jadi akan memunculkan SEMUA karya.
        hideHeader=true agar H2 "Selected Works" tidak muncul ganda.
      */}
      <PortfolioSectionServer hideHeader={true} />
      
      <FooterSectionServer />
    </>
  )
}
