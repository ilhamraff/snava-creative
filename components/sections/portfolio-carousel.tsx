'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { Button } from '@/components/ui/button'
import type { PortfolioItem } from '@/lib/types'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface PortfolioCarouselProps {
  items: PortfolioItem[]
  title?: string
}

export function PortfolioCarousel({
  items,
  title = 'Karya Terkait',
}: PortfolioCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <SectionHeader
            // eyebrow="Portfolio"
            title={title}
            className="mb-0"
            titleClassName="text-background"
          />
          
          {/* Navigation Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 flex items-center justify-center border border-background/20 hover:bg-background hover:text-foreground transition-colors duration-300"
              aria-label="Previous project"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 flex items-center justify-center border border-background/20 hover:bg-background hover:text-foreground transition-colors duration-300"
              aria-label="Next project"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Carousel Container (Bleeds to right) */}
      <div className="pl-4 md:pl-8 lg:pl-[max(2rem,calc((100vw-80rem)/2))]">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-10 -mb-10 gap-6 pr-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, index) => (
            <div 
              key={item.slug || index} 
              className="snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[30vw] group cursor-pointer"
            >
              <div className="relative aspect-4/5 sm:aspect-3/4 overflow-hidden bg-background/5 mb-5">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 30vw"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
              </div>
              
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 text-xs font-mono text-background/60 uppercase tracking-widest mb-2">
                  <span>{item.category}</span>
                  {item.year && (
                    <>
                      <span>—</span>
                      <span>{item.year}</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-medium text-background group-hover:text-background/80 transition-colors duration-300 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-20 pt-10 border-t border-background/10 flex justify-center">
          <Button 
            href="/portfolio" 
            size="lg" 
            variant="secondary"
            className="rounded-none px-10 bg-transparent border-background/20 text-background hover:bg-background hover:text-foreground"
          >
            Lihat Semua Portfolio
          </Button>
        </div>
      </Container>
      
      {/* Add global style to hide scrollbar for webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
