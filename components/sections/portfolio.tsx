'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import type { PortfolioItem } from '@/lib/types'
import { cn } from '@/lib/utils/cn'
import { ArrowRight } from 'lucide-react'

interface PortfolioSectionProps {
  categories: string[]
  items: PortfolioItem[]
  showViewAll?: boolean
  hideHeader?: boolean
}

export function PortfolioSection({ categories, items, showViewAll = false, hideHeader = false }: PortfolioSectionProps) {
  const [active, setActive] = useState('All')

  const filtered =
    active === 'All'
      ? items
      : items.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-background">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          {/* Header Title - Hidden if hideHeader is true */}
          {!hideHeader ? (
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
                Karya Terbaik Kami
              </h2>
            </div>
          ) : (
            <div className="hidden md:block flex-1" /> /* Spacer if header is hidden */
          )}

          {/* Filter Tabs - Minimalist */}
          <div className="flex flex-wrap gap-6 border-b border-border/50 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  'text-sm tracking-wider uppercase transition-colors duration-300 relative',
                  active === cat
                    ? 'text-foreground font-medium'
                    : 'text-muted hover:text-foreground/80'
                )}
              >
                {cat}
                {active === cat && (
                  <motion.div
                    layoutId="portfolio-active-tab"
                    className="absolute -bottom-2.25 left-0 right-0 h-px bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid - Aligned 3-column Layout */}
        <motion.div
          layout
          className="grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer flex flex-col"
              >
                  <div className="relative aspect-4/5 sm:aspect-3/4 lg:aspect-4/5 overflow-hidden bg-surface mb-5">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10 dark:group-hover:bg-black/20" />
                  </div>
                  
                  <div className="flex justify-between items-start gap-4 mt-auto">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest mb-1.5">
                        <span>{item.category}</span>
                        <span>—</span>
                        <span>{item.year}</span>
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl lg:text-xl font-medium text-foreground group-hover:text-accent transition-colors duration-300 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {showViewAll && (
          <div className="mt-16 flex justify-center">
            <Button href="/portfolio" size="lg" className="rounded-none px-10 bg-foreground text-background hover:bg-foreground/90">
              Lihat Semua Karya
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}
