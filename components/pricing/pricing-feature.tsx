import { PricingFeature } from '@/lib/types'
import { Check, X, Info } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface PricingFeatureItemProps {
  feature: PricingFeature
}

export function PricingFeatureItem({ feature }: PricingFeatureItemProps) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">
        {feature.included ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated text-muted">
            <X className="h-3.5 w-3.5 stroke-[3]" />
          </div>
        )}
      </div>
      
      <span
        className={cn(
          'text-sm leading-relaxed',
          feature.included ? 'text-foreground' : 'text-muted line-through opacity-70'
        )}
      >
        {feature.name}
      </span>

      {feature.tooltip && (
        <div className="group relative mt-0.5 flex shrink-0 cursor-help items-center text-muted hover:text-foreground">
          <Info className="h-4 w-4" />
          
          {/* Simple Tooltip (CSS only) */}
          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 z-10">
            <div className="rounded-lg bg-surface-elevated border border-border p-2 text-xs text-foreground shadow-lg text-center">
              {feature.tooltip}
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-elevated" />
          </div>
        </div>
      )}
    </li>
  )
}
