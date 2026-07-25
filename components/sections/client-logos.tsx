import { clientLogos } from '@/lib/data/client-logos'

export function ClientLogosSection() {
  // Duplicate the logos for seamless infinite scroll
  const allLogos = [...clientLogos, ...clientLogos]

  return (
    <section className="py-24 overflow-hidden border-t border-border/20 bg-background">
      <p className="mb-12 text-center text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-muted uppercase">
        Trusted By
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-linear-to-l from-background to-transparent" />

        {/* Marquee */}
        <div className="flex animate-marquee opacity-60 hover:opacity-100 transition-opacity duration-500">
          {allLogos.map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              className="mx-12 sm:mx-16 shrink-0 text-lg sm:text-xl font-display font-medium text-foreground whitespace-nowrap select-none"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
