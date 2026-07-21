'use client'

import { motion } from 'motion/react'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { Card } from '@/components/ui/card'
import { services } from '@/lib/data/services'
import { staggerContainer, fadeInUp } from '@/lib/utils/motion'
import {
  Palette,
  Megaphone,
  PenTool,
  FileText,
  Globe,
  Camera,
  Play,
  Video,
  Clapperboard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Megaphone,
  PenTool,
  FileText,
  Globe,
  Camera,
  Play,
  Video,
  Clapperboard,
}

export function ServicesSection() {
  return (
    <section id="layanan" className="py-20 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="Layanan"
          title="Solusi Kreatif untuk Setiap Kebutuhan"
          subtitle="Dari identitas brand hingga konten video, kami siap membantu bisnis Anda tampil menonjol."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services
            .sort((a, b) => a.order - b.order)
            .map((service) => {
              const Icon = iconMap[service.icon]
              return (
                <motion.div key={service.title} variants={fadeInUp}>
                  <Card className="h-full">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
        </motion.div>
      </Container>
    </section>
  )
}
