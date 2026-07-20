'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { testimonials } from '@/lib/data/testimonials'
import { Quote, Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [isPaused, next])

  const testimonial = testimonials[current]

  return (
    <section
      id="testimoni"
      className="py-20 lg:py-28"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container>
        <SectionHeader
          eyebrow="Testimoni"
          title="Apa Kata Klien Kami"
          subtitle="Kepuasan klien adalah prioritas utama kami."
        />

        <div className="relative mx-auto max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-center"
            >
              <Quote className="mx-auto mb-6 h-10 w-10 text-accent/20" />

              {/* Stars */}
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <blockquote className="text-lg text-white leading-relaxed sm:text-xl lg:text-[1.35rem] lg:leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              <div className="mt-8">
                {/* Avatar initials */}
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent font-display font-bold text-sm">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <p className="font-display text-sm font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-muted">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Testimoni ${i + 1}`}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 cursor-pointer',
                  i === current
                    ? 'w-8 bg-accent'
                    : 'w-2 bg-charcoal hover:bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
