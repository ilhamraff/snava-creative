import { PricingPlan } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PricingFeatureItem } from './pricing-feature'
import { cn } from '@/lib/utils/cn'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  const isCustom = plan.isCustom

  return (
    <div className="flex h-full flex-col pt-8 pb-12 border-t border-border/50 group relative">
      {/* Hover line effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
      
      {/* Header Area */}
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          <h3 className="font-display text-2xl font-medium text-foreground">
            {plan.name}
          </h3>
          {/* <p className="mt-2 text-sm text-muted uppercase tracking-wider">
            {plan.subheadline}
          </p> */}
        </div>
        {plan.badge && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] px-2 py-1 border border-foreground/20 text-foreground">
            {plan.badge}
          </span>
        )}
      </div>

      {/* Pricing Area */}
      <div className="mb-8 flex items-baseline gap-2">
        {isCustom ? (
          <span className="font-display text-3xl md:text-4xl font-medium text-foreground">
            {plan.price}
          </span>
        ) : (
          <>
            <span className="font-display text-3xl md:text-4xl font-medium text-foreground">
              {plan.price}
            </span>
            {plan.billingPeriod && (
              <span className="text-sm text-muted uppercase tracking-widest font-light ml-2">
                / {plan.billingPeriod.replace('/', '')}
              </span>
            )}
          </>
        )}
      </div>

      {/* Description */}
      <p className="mb-8 text-base text-muted font-light leading-relaxed">
        {plan.description}
      </p>

      {/* Features List */}
      <div className="mt-auto pt-6 border-t border-border/20">
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature, idx) => (
            <PricingFeatureItem key={idx} feature={feature} />
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="mt-10">
        <Button 
          href={plan.cta.url} 
          variant="secondary"
          className="w-full sm:w-auto bg-transparent border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all"
        >
          {plan.cta.label}
        </Button>
      </div>
    </div>
  )
}
