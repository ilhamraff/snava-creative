import { Container } from '@/components/ui/container'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { AnimatedSection } from '@/components/ui/animated-section'
import { stats } from '@/lib/data/stats'

export function StatisticsSection() {
  return (
    <AnimatedSection className="py-20 lg:py-24">
      <Container>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl font-extrabold text-white sm:text-5xl lg:text-[3.5rem]">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  )
}
