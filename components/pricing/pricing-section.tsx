'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { PricingPlan, PricingSectionData } from '@/lib/types'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { PricingGrid } from './pricing-grid'
import { PricingCard } from './pricing-card'
import { AnimatedSection } from '@/components/ui/animated-section'
import { cn } from '@/lib/utils/cn'
import { Button } from '../ui/button'

interface PricingSectionProps {
  data: PricingSectionData
  plans: PricingPlan[]
  // If true, it won't render tabs and just show the plans directly (e.g., for homepage if filtered)
  hideTabs?: boolean
  viewMoreUrl?: string
  className?: string
}

export function PricingSection({ data, plans, hideTabs = false, viewMoreUrl, className }: PricingSectionProps) {
  // Extract unique categories from the plans
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(plans.map(p => p.serviceCategory)))
    return uniqueCats
  }, [plans])

  // State for active tab, default to data.defaultCategory or first category
  const [activeCategory, setActiveCategory] = useState<string>(
    data.defaultCategory && categories.includes(data.defaultCategory) 
      ? data.defaultCategory 
      : categories[0]
  )

  // Filter plans based on active category
  const filteredPlans = useMemo(() => {
    if (hideTabs) return plans
    return plans.filter(p => p.serviceCategory === activeCategory)
  }, [plans, activeCategory, hideTabs])

  return (
    <AnimatedSection className={cn('py-20 lg:py-28', className)}>
      <Container>
        <SectionHeader
          eyebrow="Harga & Layanan"
          title={data.headline}
          subtitle={data.subheadline}
        />

        {/* Category Tabs */}
        {!hideTabs && categories.length > 1 && (
          <div className="mb-14 flex justify-center">
            {/* Scrollable on small screens */}
            <div className="flex w-full max-w-full overflow-x-auto pb-4 sm:w-auto sm:pb-0 hide-scrollbar justify-start sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface p-1.5 whitespace-nowrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      'relative px-6 py-2.5 text-sm font-medium transition-colors duration-300 rounded-full cursor-pointer',
                      activeCategory === category 
                        ? 'text-white' 
                        : 'text-muted hover:text-foreground'
                    )}
                  >
                    {activeCategory === category && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid of Cards */}
        <PricingGrid>
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="h-full"
            >
              <PricingCard plan={plan} />
            </motion.div>
          ))}
        </PricingGrid>

        {/* Optional View More Button */}
        {viewMoreUrl && (
          <div className="mt-16 flex justify-center">
            <Button href={viewMoreUrl} variant="secondary" size="lg">
              Lihat Semua Paket Layanan
            </Button>
          </div>
        )}
      </Container>
    </AnimatedSection>
  )
}
