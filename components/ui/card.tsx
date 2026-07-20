import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-surface p-6',
        hover &&
          'transition-all duration-300 hover:border-charcoal/60 hover:bg-surface-elevated hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20',
        className
      )}
    >
      {children}
    </div>
  )
}
