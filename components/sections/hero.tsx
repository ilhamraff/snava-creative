'use client'

import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { heroData } from '@/lib/data/hero'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Subtle Noise / Grain Overlay for editorial feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("/assets/noise.png")' }}
      />

      <Container className="relative z-10 py-32 text-center md:text-left flex flex-col items-center md:items-start justify-center h-full w-full">
        <div className="max-w-5xl mx-auto md:mx-0">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[6rem] lg:leading-[0.95]"
          >
            {heroData.headline}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-2xl border-l border-foreground/20 pl-6"
          >
            <p className="text-base text-muted sm:text-lg lg:text-xl font-light leading-relaxed">
              {heroData.subheadline}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:gap-6 flex-wrap"
          >
            <Button href={heroData.ctaPrimary.url} size="lg" className="rounded-none px-8 bg-foreground text-background hover:bg-foreground/90">
              {heroData.ctaPrimary.label}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            {/* <Button href="#pricing" variant="ghost" size="lg" className="rounded-none px-8 uppercase tracking-widest text-xs">
              Cek Harga
            </Button> */}

            <a 
              href={heroData.ctaSecondary.url}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 group uppercase tracking-widest border-b border-transparent hover:border-foreground pb-1"
            >
              {heroData.ctaSecondary.label}
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
