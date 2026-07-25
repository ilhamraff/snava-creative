'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { PricingPlan, PricingSectionData } from '@/lib/types'
import { Container } from '@/components/ui/container'
import { PricingGrid } from './pricing-grid'
import { PricingCard } from './pricing-card'
import { cn } from '@/lib/utils/cn'
import { Button } from '../ui/button'

interface PricingSectionProps {
  data: PricingSectionData
  plans: PricingPlan[]
  hideTabs?: boolean
  viewMoreUrl?: string
  className?: string
}

export function PricingSection({ data, plans, hideTabs = false, viewMoreUrl, className }: PricingSectionProps) {
  const categories = useMemo(() => {
    return Array.from(new Set(plans.map(p => p.serviceCategory)))
  }, [plans])

  const [activeCategory, setActiveCategory] = useState<string>(
    data.defaultCategory && categories.includes(data.defaultCategory) 
      ? data.defaultCategory 
      : categories[0]
  )

  const filteredPlans = useMemo(() => {
    if (hideTabs) return plans
    return plans.filter(p => p.serviceCategory === activeCategory)
  }, [plans, activeCategory, hideTabs])

  return (
    <section id="pricing" className={cn('py-24 lg:py-32 bg-background', className)}>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              Engagement Models
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base text-muted font-light leading-relaxed">
              {data.subheadline}
            </p>
          </div>
        </div>

        {/* Category Tabs Minimalist */}
        {!hideTabs && categories.length > 1 && (
          <div className="flex flex-wrap gap-6 border-b border-border/50 pb-2 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'text-sm tracking-wider uppercase transition-colors duration-300 relative',
                  activeCategory === category 
                    ? 'text-foreground font-medium' 
                    : 'text-muted hover:text-foreground/80'
                )}
              >
                {category}
                {activeCategory === category && (
                  <motion.div
                    layoutId="pricing-active-tab"
                    className="absolute -bottom-[9px] left-0 right-0 h-[1px] bg-foreground"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Grid of Cards */}
        <PricingGrid>
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </PricingGrid>

        {/* Optional View More Button */}
        {viewMoreUrl && (
          <div className="mt-16 pt-8 border-t border-border/50 flex justify-center">
            <Button href={viewMoreUrl} variant="secondary" className="bg-transparent border-none text-foreground hover:bg-surface transition-colors uppercase tracking-widest text-xs font-semibold">
              Lihat Semua Paket Layanan
            </Button>
          </div>
        )}
      </Container>
    </section>
  )
}
