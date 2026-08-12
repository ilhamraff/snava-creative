'use client'

import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { AnimatedSection } from '@/components/ui/animated-section'
import * as LucideIcons from 'lucide-react'
import { motion } from 'motion/react'
import { staggerContainer, fadeInUp } from '@/lib/utils/motion'

export interface ServiceCapabilitiesProps {
  headline?: string
  capabilities: { title: string; description: string; icon?: string }[]
}

export function ServiceCapabilities({
  headline = 'What We Do',
  capabilities,
}: ServiceCapabilitiesProps) {
  if (!capabilities || capabilities.length === 0) return null

  return (
    <AnimatedSection className="py-24 lg:py-32 bg-background border-t border-border/50">
      <Container>
        <SectionHeader
          eyebrow="Capabilities"
          title={headline}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 pt-10"
        >
          {capabilities.map((capability, index) => {
            // Dynamically get the Lucide icon component, fallback to Check if not found
            const IconComponent = capability.icon && (LucideIcons as any)[capability.icon]
              ? (LucideIcons as any)[capability.icon]
              : LucideIcons.CheckCircle2

            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group flex flex-col p-8 bg-surface border border-border/50 hover:border-foreground/20 transition-all duration-300"
              >
                <div className="mb-6 w-12 h-12 bg-background flex items-center justify-center border border-border/50 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                  <IconComponent className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground mb-4">
                  {capability.title}
                </h3>
                <p className="text-base text-muted font-light leading-relaxed">
                  {capability.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </AnimatedSection>
  )
}
