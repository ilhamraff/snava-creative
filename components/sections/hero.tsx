import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { heroData } from '@/lib/data/hero'
import { ArrowRight, MessageCircle } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient mesh background — the signature element */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-40%] left-[-20%] h-200 w-200 rounded-full bg-accent/[0.07] blur-[120px] animate-float-slow" />
        <div className="absolute bottom-[-30%] right-[-15%] h-150 w-150 rounded-full bg-accent-light/5 blur-[100px] animate-float-reverse" />
        <div className="absolute top-[30%] right-[25%] h-100 w-100 rounded-full bg-accent/4 blur-[80px] animate-float-medium" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground, rgba(255,255,255,0.1)) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground, rgba(255,255,255,0.1)) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <Container className="relative z-10 py-32 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.1]">
            {heroData.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg lg:text-xl leading-relaxed">
            {heroData.subheadline}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={heroData.ctaPrimary.url} size="lg">
              <MessageCircle className="h-5 w-5" />
              {heroData.ctaPrimary.label}
            </Button>
            <Button href={heroData.ctaSecondary.url} variant="secondary" size="lg">
              {heroData.ctaSecondary.label}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <a 
              href="/pricing" 
              className="text-sm font-medium text-muted hover:text-foreground transition-colors inline-flex items-center gap-1 group"
            >
              Atau lihat daftar harga layanan kami
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
