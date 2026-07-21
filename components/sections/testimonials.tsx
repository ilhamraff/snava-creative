'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Container } from '@/components/ui/container'
import { SectionHeader } from '@/components/ui/section-header'
import { testimonials } from '@/lib/data/testimonials'
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0) // -1 = left, 1 = right

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrent((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % testimonials.length
      }
      return (prev - 1 + testimonials.length) % testimonials.length
    })
  }, [])

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const testimonial = testimonials[current]

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  return (
    <section id="testimoni" className="py-20 lg:py-28">
      <Container>
        <SectionHeader
          eyebrow="Testimoni"
          title="Apa Kata Klien Kami"
          subtitle="Kepuasan klien adalah prioritas utama kami."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Prev Button */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:bg-surface-elevated hover:text-foreground hover:border-charcoal cursor-pointer sm:-translate-x-6 lg:-translate-x-14"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next Button */}
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:bg-surface-elevated hover:text-foreground hover:border-charcoal cursor-pointer sm:translate-x-6 lg:translate-x-14"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide Content */}
          <div className="overflow-hidden px-8 sm:px-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
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

                <blockquote className="text-lg text-foreground leading-relaxed sm:text-xl lg:text-[1.35rem] lg:leading-relaxed">
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
                  <p className="font-display text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="mt-10 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
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
