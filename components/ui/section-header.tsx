import { cn } from '@/lib/utils/cn'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  titleClassName?: string
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 lg:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {/* {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold tracking-[0.2em] text-accent uppercase">
          {eyebrow}
        </span>
      )} */}
      <h2 className={cn("font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight", titleClassName)}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base text-muted lg:text-lg leading-relaxed',
            align === 'center' && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
