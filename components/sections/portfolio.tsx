'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { Badge } from '@/components/ui/badge'
import { portfolioItems, portfolioCategories } from '@/lib/data/portfolio'
import { cn } from '@/lib/utils/cn'

export function PortfolioSection() {
  const [active, setActive] = useState('Semua')

  const filtered =
    active === 'Semua'
      ? portfolioItems
      : portfolioItems.filter((p) => p.category === active)

  return (
    <section id="portfolio" className="py-20 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="Portfolio"
          title="Project Terbaru"
          subtitle="Beberapa karya terbaik yang telah kami hasilkan untuk klien."
        />

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {portfolioCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                active === cat
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'bg-surface text-muted border border-border hover:text-white hover:border-charcoal'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-border"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div>
                    <Badge variant="accent">{item.category}</Badge>
                    <h3 className="mt-2 font-display text-base font-semibold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                      {item.client} · {item.year}
                    </p>
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
