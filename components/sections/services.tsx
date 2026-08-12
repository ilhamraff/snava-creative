'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/container'
import type { Service } from '@/lib/types'
import { staggerContainer, fadeInUp } from '@/lib/utils/motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'


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
                  className="group relative border-b border-border/50 transition-colors duration-500 hover:bg-foreground/5"
                >
                  <Link href={`/services/${service.slug}`} className="flex flex-col md:flex-row md:items-center gap-6 px-4 py-8 md:py-12 w-full h-full">
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

                    <div className="shrink-0 flex items-center mt-2 md:mt-0 text-muted group-hover:text-foreground transition-colors duration-500">
                      <span className="md:hidden text-sm font-medium uppercase tracking-widest mr-3">Detail Layanan</span>
                      <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
        </motion.div>
      </Container>
    </section>
  )
}
