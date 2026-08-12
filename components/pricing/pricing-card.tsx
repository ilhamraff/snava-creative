import { PricingPlan } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { PricingFeatureItem } from './pricing-feature'
import { cn } from '@/lib/utils/cn'
import { getWhatsAppUrl } from '@/lib/data/site-settings'

const formatPrice = (price: number | string | null | undefined) => {
  if (price === null || price === undefined) return 'Custom'
  if (typeof price === 'string') return price
  if (price >= 1000 && price % 1000 === 0) {
    return `Rp ${price / 1000}k`
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price).replace('Rp', 'Rp ')
}

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  const isCustom = plan.isCustom
  
  const ctaLabel = plan.cta?.label || (isCustom ? 'Konsultasi Sekarang' : `Pilih ${plan.name}`)
  const ctaUrl = plan.cta?.url || getWhatsAppUrl(`Halo Snava, saya tertarik dengan ${plan.name}`)

  return (
    <div className="flex h-full flex-col pt-8 pb-12 border-t border-border/50 group relative">
      {/* Hover line effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
      
      {/* Header Area */}
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          {plan.serviceCategory && (
            <p className="mb-2 text-xs text-muted uppercase tracking-[0.2em] font-medium">
              {plan.serviceCategory}
            </p>
          )}
          <h3 className="font-display text-2xl font-medium text-foreground">
            {plan.name}
          </h3>
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
            {formatPrice(plan.price)}
          </span>
        ) : (
          <>
            <span className="font-display text-3xl md:text-4xl font-medium text-foreground">
              {formatPrice(plan.price)}
            </span>
            {plan.billingPeriod && (
              <span className="text-sm text-muted uppercase tracking-widest font-light ml-2">
                / {plan.billingPeriod.replace('/', '').replace('Per ', '')}
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
      <div className="pt-6 border-t border-border/20">
        <ul className="flex flex-col gap-3">
          {plan.features.map((feature, idx) => (
            <PricingFeatureItem key={idx} feature={feature} />
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="mt-auto pt-10">
        <Button 
          href={ctaUrl} 
          variant="secondary"
          className="w-full sm:w-auto bg-transparent border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background transition-all"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
