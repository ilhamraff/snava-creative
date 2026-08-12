import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils/cn'

interface PricingGridProps {
  children: ReactNode
  className?: string
}

export function PricingGrid({ children, className }: PricingGridProps) {
  const count = React.Children.count(children)
  const isTwo = count === 2

  return (
    <motion.div
      layout
      className={cn(
        'mx-auto grid gap-8',
        isTwo ? 'max-w-4xl' : 'max-w-7xl',
        'grid-cols-1',
        'sm:grid-cols-2',
        isTwo ? 'lg:grid-cols-2' : 'lg:grid-cols-3',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  )
}
