'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/container'
import type { Service } from '@/lib/types'
import { staggerContainer, fadeInUp } from '@/lib/utils/motion'


interface ServicesSectionProps {
  title: string
  description: string
  services: Service[]
}

export function ServicesSection({ title, description, services }: ServicesSectionProps) {
  return (
    <section id="layanan" className="py-24 lg:py-32 bg-background">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base text-muted font-light leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="border-t border-border/50"
        >
          {services
            .sort((a, b) => a.order - b.order)
            .map((service, index) => {
              const number = String(index + 1).padStart(2, '0')
              
              return (
                <motion.div 
                  key={service.title} 
                  variants={fadeInUp}
                  className="group relative border-b border-border/50 py-8 md:py-12 transition-colors duration-500 hover:bg-foreground/5 cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 px-4">
                    <div className="w-16 md:w-32 shrink-0">
                      <span className="font-mono text-sm md:text-base text-muted group-hover:text-foreground transition-colors duration-500">
                        {number}
                      </span>
                    </div>
                    
                    <div className="flex-1 md:pr-12">
                      <h3 className="font-display text-2xl md:text-4xl font-medium text-foreground mb-4">
                        {service.title}
                      </h3>
                      <p className="text-base md:text-lg text-muted font-light leading-relaxed max-w-2xl">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>
      </Container>
    </section>
  )
}
