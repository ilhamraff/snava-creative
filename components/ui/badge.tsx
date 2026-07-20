import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variant === 'default' &&
          'bg-surface-elevated text-muted border border-border',
        variant === 'accent' &&
          'bg-accent/10 text-accent-light border border-accent/20',
        className
      )}
    >
      {children}
    </span>
  )
}
