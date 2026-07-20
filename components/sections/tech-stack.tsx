import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { AnimatedSection } from '@/components/ui/animated-section'
import { techStack, techStackTitle, techStackSubtitle } from '@/lib/data/tech-stack'
import Image from 'next/image'

export function TechStackSection() {
  return (
    <AnimatedSection className="py-20 lg:py-28 border-t border-border/50">
      <Container>
        <SectionHeader
          eyebrow="Tools"
          title={techStackTitle}
          subtitle={techStackSubtitle}
        />

        <div className="flex flex-wrap justify-center gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="group flex w-28 sm:w-32 md:w-40 flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-charcoal/60 hover:bg-surface-elevated"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-elevated transition-colors group-hover:bg-white/5 p-2">
                <Image 
                  src={tech.icon}
                  alt={tech.name}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xs text-muted transition-colors group-hover:text-white text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </AnimatedSection>
  )
}
