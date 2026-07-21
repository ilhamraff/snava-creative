import { clientLogos } from '@/lib/data/client-logos'

export function ClientLogosSection() {
  // Duplicate the logos for seamless infinite scroll
  const allLogos = [...clientLogos, ...clientLogos]

  return (
    <section className="py-16 overflow-hidden border-y border-border/50">
      <p className="mb-8 text-center text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        Dipercaya Oleh
      </p>
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-background to-transparent" />

        {/* Marquee */}
        <div className="flex animate-marquee">
          {allLogos.map((logo, i) => (
            <span
              key={`${logo.name}-${i}`}
              className="mx-10 shrink-0 text-xl font-display font-bold text-charcoal/60 transition-colors duration-300 hover:text-foreground whitespace-nowrap select-none"
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
