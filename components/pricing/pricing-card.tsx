import { PricingPlan } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PricingFeatureItem } from './pricing-feature'
import { cn } from '@/lib/utils/cn'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  const isPopular = plan.isPopular
  const isCustom = plan.isCustom

  return (
    <div
      className={cn(
        'relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300',
        isPopular 
          ? 'border-accent bg-surface shadow-xl shadow-accent/5' 
          : 'border-border bg-surface hover:border-charcoal/60 hover:shadow-lg hover:shadow-foreground/5'
      )}
    >
      {/* Badge Popular / Enterprise */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="accent" className="bg-accent text-white border-none shadow-md shadow-accent/20 px-4 py-1">
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Header Area */}
      <div className="mb-8">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {plan.name}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed min-h-10">
          {plan.subheadline}
        </p>
      </div>

      {/* Pricing Area */}
      <div className="mb-8 flex items-baseline gap-2">
        {isCustom ? (
          <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {plan.price}
          </span>
        ) : (
          <>
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {plan.price}
            </span>
            {plan.billingPeriod && (
              <span className="text-sm font-medium text-muted">
                {plan.billingPeriod}
              </span>
            )}
          </>
        )}
      </div>

      {/* Description */}
      <p className="mb-8 text-sm text-muted leading-relaxed">
        {plan.description}
      </p>

      {/* CTA Button */}
      <div className="mb-10">
        <Button 
          href={plan.cta.url} 
          variant={isPopular ? 'primary' : 'secondary'} 
          className="w-full"
        >
          {plan.cta.label}
        </Button>
      </div>

      {/* Features List */}
      <div className="mt-auto pt-6 border-t border-border/50">
        <p className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
          Yang Anda Dapatkan
        </p>
        <ul className="flex flex-col gap-4">
          {plan.features.map((feature, idx) => (
            <PricingFeatureItem key={idx} feature={feature} />
          ))}
        </ul>
      </div>
    </div>
  )
}
