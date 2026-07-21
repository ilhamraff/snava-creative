import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils/cn'

interface PricingGridProps {
  children: ReactNode
  className?: string
}

export function PricingGrid({ children, className }: PricingGridProps) {
  return (
    <motion.div
      layout
      className={cn(
        'mx-auto grid max-w-7xl gap-8',
        'grid-cols-1',               // Mobile: 1 column
        'sm:grid-cols-2',            // Tablet: 2 columns
        'lg:grid-cols-3',            // Desktop: 3 columns
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  )
}
