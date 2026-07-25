'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { portfolioItems, portfolioCategories } from '@/lib/data/portfolio'
import { cn } from '@/lib/utils/cn'
import { ArrowRight } from 'lucide-react'

export function PortfolioSection() {
  const [active, setActive] = useState('Semua')

  const filtered =
    active === 'Semua'
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-background">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              Selected Works
            </h2>
          </div>

          {/* Filter Tabs - Minimalist */}
          <div className="flex flex-wrap gap-6 border-b border-border/50 pb-2">
            {portfolioCategories.map((cat) => (
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
                    className="absolute -bottom-[9px] left-0 right-0 h-[1px] bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid - Editorial 2-column */}
        <motion.div
          layout
          className="grid gap-12 sm:grid-cols-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "group cursor-pointer",
                  index % 2 !== 0 ? "md:mt-24" : "" // Staggered masonry effect
                )}
              >
                <div className="relative aspect-4/5 md:aspect-3/4 overflow-hidden bg-surface mb-6">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-2xl font-medium text-foreground group-hover:text-foreground/80 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted uppercase tracking-wider">
                      {item.category} — {item.year}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  )
}
